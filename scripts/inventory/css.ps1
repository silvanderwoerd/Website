# Step-2 analysis: splits the live site's Webflow CSS into single declarations
# and marks which ones the saved pages actually use. Webflow ships the whole
# template's CSS (the "Portrait" template), so most rules are never used.
# Writes reference/live-site/_css.tsv: media, selector, property, value, used
# Run from the Website folder:  powershell -File scripts/inventory/css.ps1

param([string]$Site = "reference/live-site")

$cssFile = Get-ChildItem "$Site/_assets" -Filter '*.webflow.shared.*.css' | Select-Object -First 1
$css = [IO.File]::ReadAllText($cssFile.FullName)
$css = [regex]::Replace($css, '(?s)/\*.*?\*/', '')

# Every class name used on any saved page (class attributes only).
$used = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($f in Get-ChildItem $Site -Recurse -Filter *.html) {
  $h = [IO.File]::ReadAllText($f.FullName)
  foreach ($m in [regex]::Matches($h, 'class="([^"]+)"')) { foreach ($c in $m.Groups[1].Value -split '\s+') { if ($c) { [void]$used.Add($c) } } }
}

function IsUsed([string]$selector) {
  # A selector list is used if any of its parts has all its classes on the site.
  foreach ($part in $selector -split ',') {
    $classes = [regex]::Matches($part, '\.(-?[_a-zA-Z][\w-]*)') | ForEach-Object { $_.Groups[1].Value }
    if (-not $classes) { return $true }   # element/attribute selectors (body, h1, a …)
    $all = $true; foreach ($c in $classes) { if (-not $used.Contains($c)) { $all = $false; break } }
    if ($all) { return $true }
  }
  return $false
}

$rows = New-Object System.Collections.Generic.List[string]
$rows.Add("media`tselector`tproperty`tvalue`tused")
$stack = New-Object System.Collections.Generic.List[string]
$pos = 0; $len = $css.Length
while ($pos -lt $len) {
  $open = $css.IndexOf('{', $pos); $close = $css.IndexOf('}', $pos)
  if ($close -lt 0) { break }
  if ($open -ge 0 -and $open -lt $close) {
    $prelude = $css.Substring($pos, $open - $pos).Trim()
    if ($prelude.StartsWith('@media') -or $prelude.StartsWith('@supports') -or $prelude.StartsWith('@keyframes') -or $prelude.StartsWith('@font-face')) {
      if ($prelude.StartsWith('@keyframes') -or $prelude.StartsWith('@font-face')) {
        # Skip the whole block.
        $depth = 0; $i = $open
        do { if ($css[$i] -eq '{') { $depth++ } elseif ($css[$i] -eq '}') { $depth-- }; $i++ } while ($depth -gt 0 -and $i -lt $len)
        $pos = $i; continue
      }
      $stack.Add($prelude); $pos = $open + 1; continue
    }
    $body = $css.Substring($open + 1, $close - $open - 1)
    $media = ($stack | Where-Object { $_.StartsWith('@media') }) -join ' & '
    $isUsed = IsUsed $prelude
    $sel = ($prelude -replace '\s+', ' ')
    foreach ($d in $body -split ';') {
      $k = $d.IndexOf(':'); if ($k -lt 1) { continue }
      $rows.Add(("{0}`t{1}`t{2}`t{3}`t{4}" -f $media, $sel, $d.Substring(0, $k).Trim().ToLower(), $d.Substring($k + 1).Trim(), $isUsed))
    }
    $pos = $close + 1
  } else {
    if ($stack.Count -gt 0) { $stack.RemoveAt($stack.Count - 1) }
    $pos = $close + 1
  }
}
$rows | Set-Content -Encoding utf8 "$Site/_css.tsv"
"wrote $($rows.Count - 1) declarations; $($used.Count) class names used on the site"
