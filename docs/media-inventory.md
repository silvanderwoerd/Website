# Media inventory (step 7)

Every file the site loads from Webflow's servers today, found in the content
files (`node scripts/media/collect.mjs`) and looked up on Webflow's CDN on
29 Oct 2026 (`node scripts/media/inventory.mjs`, read-only). The full list,
one row per file with its kind, pixel size, file size and where it's used, is
[media-inventory.csv](media-inventory.csv).

| Kind | Files | Size | What it is | Needed from you? |
|---|---:|---:|---|---|
| **Videos re-encoded by Webflow** | 72 (36 clips × MP4 + WebM) | 132.8 MB | Webflow never serves the uploaded video, only its own 1280-pixel-wide copies | **Yes: the original of each clip** |
| Video posters made by Webflow | 36 | 1.8 MB | The still frame Webflow cut from each video | No: made again from your originals |
| Images as uploaded | 1170 | 340.7 MB | The file as someone uploaded it, at full size | No |
| Images reduced before upload | 65 | 26.4 MB | Uploads whose names say they were made smaller first (`-optimized`, `-resized`, `thumbnail`, `webCover`) | Optional |
| WebP / AVIF images | 109 | 13.6 MB | Uploads in WebP or AVIF; some may be Webflow's own conversion | Optional: check |
| **Total** | **1452** | **515.2 MB** | | |

Films on YouTube and Vimeo aren't on Webflow and stay where they are. The Lato
font files are already in the project.

## Needed from you: the 36 video originals

Webflow re-encodes every background video to 1280 pixels wide (720 high for the
two full-screen heroes) and only ever serves those copies. The new site can copy
them as they are, so phase 1 looks exactly like live, but better quality only
comes from your originals. Most important: the two full-screen heroes (Home,
About), shown up to 1920+ pixels wide.

| Clip (name on Webflow) | Project | Used as | Webflow's copy | Size (MP4 + WebM) |
|---|---|---|---|---:|
| Birthplacecutdown | Birthplace | Work grid tile | 1280×536 | 1.8 MB |
| Canopycutdown | Pack4Good | Work grid tile | 1280×536 | 2.7 MB |
| ChangeDrivers2cutdown | Change Drivers | Work grid tile | 1280×536 | 2.8 MB |
| CoralCatch-Work-Final | To Love and Protect | Work grid tile | 1280×534 | 2.9 MB |
| DangerousLiescutdown | Dangerous Lies | Work grid tile | 1280×536 | 1.9 MB |
| Drifterscutdown | Drifters | Work grid tile | 1280×536 | 2.9 MB |
| EarthDefendercutdown | Earth Defender | Home featured work + Work grid tile | 1280×536 | 2.8 MB |
| Epochcutdown | Epoch | Work grid tile | 1280×536 | 1.9 MB |
| FeaturedWorkBrokenWings | Broken Wings | Work grid tile | 1280×534 | 2.4 MB |
| FeaturedWorkWasteminster | Wasteminster | Work grid tile | 1278×534 | 5.2 MB |
| FeaturedWorkWoolmark | Wear Wool, Not Fossil Fuel | Work grid tile | 1280×534 | 2.1 MB |
| Hazezillacutdown | Haze: Coming Soon | Work grid tile | 1280×536 | 2.9 MB |
| HumanitysImpactcutdown | Humanity's Impact | Work grid tile | 1280×536 | 4.5 MB |
| Hutan.cutdown | The Forest in Her Hands | Work grid tile | 1280×536 | 2.8 MB |
| InstaFilters | Total Pollution | Instagram filter (project page) | 1281×568 | 5.2 MB |
| jungleheroes-cutdown | Jungle Heroes | Work grid tile | 1280×536 | 2.4 MB |
| Mantracutdown | Mantra | Work grid tile | 1280×536 | 2.5 MB |
| MissionStatementVideov6HDmov | Mission statement | About hero (full screen) | 1280×720 | 9.0 MB |
| MoneyTreescutdown | MoneyTrees | Work grid tile | 1280×536 | 3.7 MB |
| Oilympics-frontpage-v2 | Oilympics | Home featured work | 1280×534 | 3.1 MB |
| Oilympics-WorkPage | Oilympics | Work grid tile | 1280×534 | 3.0 MB |
| Plastikcutdown | Plastik | Work grid tile | 1280×536 | 2.6 MB |
| Requimcutdown | Requiem 2019 | Work grid tile | 1280×536 | 1.2 MB |
| Rewildcutdown | Rewild | Work grid tile | 1280×536 | 2.8 MB |
| RUDcutdown | Repeat Until Death | Work grid tile | 1280×536 | 2.3 MB |
| SOScutdown | Save Our Souls | Work grid tile | 1280×536 | 5.1 MB |
| StudioBirthplacehighlightReelHDv5mov | Studio showreel | Home hero (full screen) | 1280×720 | 19.2 MB |
| TeamForest-MainPage | Team Forest | Home featured work | 1280×534 | 3.2 MB |
| TeamForest-WorkPage | Team Forest | Work grid tile | 1280×534 | 3.0 MB |
| Terraformcutdown | Terraform | Work grid tile | 1280×536 | 2.0 MB |
| TotalPollutioncutdown | TotalPollution | Work grid tile | 1280×536 | 4.7 MB |
| VHILScutdown | VHILS | Work grid tile | 1280×536 | 3.0 MB |
| WearWoolNotWastecutdown | Wear Wool, Not Waste | Home featured work + Work grid tile | 1280×536 | 4.1 MB |
| WebsiteVideo-smaller | Respect The Amazon | Work grid tile | 1278×534 | 5.1 MB |
| WorldOnFirecutdown | World On Fire | Work grid tile | 1280×536 | 2.9 MB |
| WW-WorkPage-Video | Inequality by the Gallon | Work grid tile | 1280×534 | 3.0 MB |

What helps most: the master export of each clip at its full resolution (MP4 is
fine). From one file the new site makes its own MP4, WebM, phone version and
poster.

## Optional: images that were already made smaller

These 65 uploads are already-reduced versions (Webflow didn't do it).
If you have the full-size originals, they would look sharper on large screens,
mostly in Team Forest, Oilympics, Respect the Amazon and Haze, and the Work
grid thumbnails (1280×533). The CSV lists them as `upload-reduced`.

The 109 WebP/AVIF images (`upload-check`) may be Webflow's conversions
of JPEGs or PNGs; if you still have those source files, they're the better copy.

## What happens next (step 7)

1. You choose where the media lives (proposal to follow; nothing is copied yet).
2. A copy script downloads all 1452 files from Webflow into that place
   and rewrites the content files to the new addresses: the site then looks
   exactly as now, without Webflow.
3. Your video originals (and any image originals) replace Webflow's copies as a
   named phase-2 change, each shown on a preview first.
