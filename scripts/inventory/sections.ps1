# Step-1 analysis: reads every saved page in reference/live-site and lists its
# top-level bands (stripes) in order, with the Webflow features inside each.
# Writes reference/live-site/_sections.tsv:
#   address, index, tag.classes, id, interactions, embeds, cms-lists, forms, videos, iframes, text
# Run from the Website folder:  powershell -File scripts/inventory/sections.ps1

param([string]$Site = "reference/live-site")

$void = 'area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr'
$tagRx = [regex]'<(/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"'']|"[^"]*"|''[^'']*'')*?)(/?)>'

function Children([string]$html) {
  # Top-level elements of an HTML fragment, as @{tag; attrs; inner}.
  $out = @(); $depth = 0; $start = 0; $open = $null
  foreach ($m in $tagRx.Matches($html)) {
    $close = $m.Groups[1].Value -eq '/'; $tag = $m.Groups[2].Value.ToLower()
    $selfClose = $m.Groups[4].Value -eq '/' -or $tag -match "^($void)$"
    if (-not $close) {
      if ($depth -eq 0) { $open = @{ tag = $tag; attrs = $m.Groups[3].Value; from = $m.Index + $m.Length; start = $m.Index } }
      if ($selfClose) { if ($depth -eq 0) { $out += @{ tag = $tag; attrs = $open.attrs; inner = ''; outer = $m.Value } } }
      else { $depth++ }
    } else {
      $depth--
      if ($depth -eq 0 -and $open) {
        $out += @{ tag = $open.tag; attrs = $open.attrs; inner = $html.Substring($open.from, $m.Index - $open.from); outer = $html.Substring($open.start, $m.Index + $m.Length - $open.start) }
        $open = $null
      }
      if ($depth -lt 0) { $depth = 0 }
    }
  }
  return $out
}

function Attr($attrs, $name) { $m = [regex]::Match($attrs, "\b$name=""([^""]*)"""); if ($m.Success) { $m.Groups[1].Value } else { '' } }
function Count($s, $rx) { [regex]::Matches($s, $rx).Count }

$rows = New-Object System.Collections.Generic.List[string]
$rows.Add("address`tindex`tsection`tid`tinteractions`tembeds`tcms`tforms`tvideos`tiframes`tinner`ttext`tcombos`tslides`timages`tlinksout`tlinksin")
$pages = Get-Content "$Site/_pages.txt"
foreach ($addr in $pages) {
  $file = if ($addr -eq '/') { "$Site/index.html" } else { "$Site/$($addr.TrimStart('/')).html" }
  $html = [IO.File]::ReadAllText((Resolve-Path $file))
  $body = [regex]::Match($html, '(?s)<body[^>]*>(.*)</body>').Groups[1].Value
  $body = [regex]::Replace($body, '(?s)<script\b.*?</script>|<style\b.*?</style>|<!--.*?-->', '')

  # Descend through single wrappers (page-wrapper, main) until there are several bands.
  $kids = @(Children $body)
  while ($kids.Count -eq 1 -and $kids[0].inner) { $kids = @(Children $kids[0].inner) }
  # Open Webflow's page wrappers (main, *page-wrapper*, main-wrapper) in place.
  do {
    $opened = $false; $next = @()
    foreach ($k in $kids) {
      $c = Attr $k.attrs 'class'
      if ($k.inner -and ($k.tag -eq 'main' -or $c -match '(^|\s)(fl-page-wrapper[\w-]*|page-wrapper|main-wrapper)(\s|$)')) { $next += @(Children $k.inner); $opened = $true }
      else { $next += $k }
    }
    $kids = $next
  } while ($opened)

  $i = 0
  foreach ($k in $kids) {
    $cls = (Attr $k.attrs 'class') -replace '\s+', '.'
    $sig = $k.tag + $(if ($cls) { '.' + $cls } else { '' })
    $o = $k.outer
    $txt = ([regex]::Replace($o, '<[^>]+>', ' ') -replace '&[a-z#0-9]+;', ' ' -replace '\s+', ' ').Trim()
    if ($txt.Length -gt 80) { $txt = $txt.Substring(0, 80) }
    # Distinctive classes inside the band, in order of first appearance.
    $inner = [regex]::Matches($k.inner, 'class="([^"]+)"') | ForEach-Object { $_.Groups[1].Value -split '\s+' } |
      Where-Object { $_ -and $_ -notmatch '^(w-|u-|is-|container|wrapper|div-block|text-block|heading|paragraph|image|link|fl-spacing|_)' } |
      Select-Object -Unique -First 8
    # Every class combination inside (for finding variants), and simple counts.
    $combos = [regex]::Matches($k.inner, 'class="([^"]+)"') | ForEach-Object { ($_.Groups[1].Value -split '\s+' | Where-Object { $_ -notmatch '^w-' }) -join '.' } |
      Where-Object { $_ -match '\.' } | Select-Object -Unique
    $links = [regex]::Matches($o, '<a [^>]*href="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
    $rows.Add(("{0}`t{1}`t{2}`t{3}`t{4}`t{5}`t{6}`t{7}`t{8}`t{9}`t{10}`t{11}`t{12}`t{13}`t{14}`t{15}`t{16}" -f $addr, $i, $sig, (Attr $k.attrs 'id'),
      (Count $o 'data-w-id='), (Count $o 'w-embed'), (Count $o 'w-dyn-list'), (Count $o '<form'),
      (Count $o '<video|w-background-video'), (Count $o '<iframe|w-video'), ($inner -join ' '), $txt,
      ($combos -join ' '), (Count $o 'swiper-slide'), (Count $o '<img'),
      @($links | Where-Object { $_ -match '^https?://' -and $_ -notmatch 'studiobirthplace\.com' }).Count,
      @($links | Where-Object { $_ -match '^/' -or $_ -match 'studiobirthplace\.com' }).Count))
    $i++
  }
}
$rows | Set-Content -Encoding utf8 "$Site/_sections.tsv"
"wrote $($rows.Count - 1) bands from $($pages.Count) pages"
