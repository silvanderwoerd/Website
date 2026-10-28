# Saves a copy of every page of the live site into reference/live-site/.
# The live site has no sitemap, so it follows links from the homepage.
# Writes:
#   <path>.html        one file per page (home = index.html)
#   _pages.txt         every address that answered 200, one per line
#   _crawl.tsv         address, status, final address, bytes, title
#   _assets/           the site's own CSS files (for the look in step 2)
# Run from the Website folder:  powershell -File scripts/save-live-site.ps1

param(
  [string]$Base = "https://www.studiobirthplace.com",
  [string]$Out = "reference/live-site",
  [int]$DelayMs = 150
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force $Out, "$Out/_assets" | Out-Null

$skipExt = '\.(png|jpe?g|gif|svg|webp|avif|mp4|webm|pdf|zip|css|js|ico|xml|txt)$'
$queue = New-Object System.Collections.Generic.Queue[string]
$seen = @{}
$rows = New-Object System.Collections.Generic.List[string]
$cssSeen = @{}

function Normalize([string]$href) {
  if ($href -match '^(mailto|tel|javascript):' -or $href -match '^#') { return $null }
  $href = $href -replace '#.*$', '' -replace '\?.*$', ''
  if ($href -match '^https?://(www\.)?studiobirthplace\.com(/.*)?$') { $href = $Matches[2] }
  if (-not $href.StartsWith('/')) { return $null }
  if ($href -match $skipExt) { return $null }
  if ($href.Length -gt 1) { $href = $href.TrimEnd('/') }
  if ($href -eq '') { $href = '/' }
  return $href.ToLowerInvariant()
}

function FileFor([string]$path) {
  if ($path -eq '/') { return Join-Path $Out 'index.html' }
  return Join-Path $Out (($path.TrimStart('/')) + '.html')
}

$queue.Enqueue('/'); $seen['/'] = $true
while ($queue.Count -gt 0) {
  $path = $queue.Dequeue()
  $status = 0; $final = ''; $html = ''
  try {
    $resp = Invoke-WebRequest -UseBasicParsing -Uri ($Base + $path) -MaximumRedirection 5
    $status = [int]$resp.StatusCode
    $final = $resp.BaseResponse.ResponseUri.AbsolutePath
    $html = $resp.Content
  } catch {
    if ($_.Exception.Response) { $status = [int]$_.Exception.Response.StatusCode } else { $status = -1 }
  }

  $title = ''
  if ($html) {
    $f = FileFor $path
    New-Item -ItemType Directory -Force (Split-Path $f) | Out-Null
    [IO.File]::WriteAllText((Resolve-Path -LiteralPath (Split-Path $f)).Path + '\' + (Split-Path $f -Leaf), $html, [Text.UTF8Encoding]::new($false))
    $m = [regex]::Match($html, '<title>(.*?)</title>'); if ($m.Success) { $title = $m.Groups[1].Value }

    foreach ($l in [regex]::Matches($html, 'href="([^"]+)"')) {
      $n = Normalize $l.Groups[1].Value
      if ($n -and -not $seen.ContainsKey($n)) { $seen[$n] = $true; $queue.Enqueue($n) }
    }
    foreach ($c in [regex]::Matches($html, 'href="(https://cdn\.prod\.website-files\.com/[^"]+\.css)"')) {
      $u = $c.Groups[1].Value
      if (-not $cssSeen.ContainsKey($u)) {
        $cssSeen[$u] = $true
        Invoke-WebRequest -UseBasicParsing -Uri $u -OutFile (Join-Path "$Out/_assets" ($u -split '/')[-1])
      }
    }
  }
  $rows.Add(("{0}`t{1}`t{2}`t{3}`t{4}" -f $path, $status, $final, $html.Length, $title))
  Write-Host ("{0,4} {1,-70} {2}" -f $status, $path, $queue.Count)
  Start-Sleep -Milliseconds $DelayMs
}

$rows.Insert(0, "address`tstatus`tfinal`tbytes`ttitle")
$rows | Set-Content -Encoding utf8 "$Out/_crawl.tsv"
$rows | Select-Object -Skip 1 | Where-Object { ($_ -split "`t")[1] -eq '200' } | ForEach-Object { ($_ -split "`t")[0] } | Sort-Object | Set-Content -Encoding utf8 "$Out/_pages.txt"
"saved $((Get-Content "$Out/_pages.txt").Count) pages; $($rows.Count - 1) addresses tried"
