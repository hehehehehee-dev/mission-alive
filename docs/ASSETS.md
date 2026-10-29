# Asset ledger

The visitor-facing catalog is maintained in `src/resource-credits.js`, opened by **Sources & credits** in the header or footer. It records every shipped image, background, surface map, video, NASA recording, API/dataset, and the mission references used by the app. Each item includes its creator credit, source page, original download when retained, local file, use in the experience, and presentation changes. Curiosity archive images register their NASA IDs, supplied credit, image URLs, and NASA detail pages when loaded. `tests/resource-credits.test.js` checks that new public image/audio/video files cannot be shipped without catalog entries.

## Journey media added October 29, 2026

- `public/assets/voyager-pale-blue-dot.jpg`: Pale Blue Dot Revisited (PIA23645). Source: https://science.nasa.gov/photojournal/pale-blue-dot-revisited/ . Original: https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia23/pia23645/PIA23645.jpg . Credit: NASA/JPL-Caltech. Voyager 1 captured the observation on February 14, 1990; NASA reprocessed it in 2020. Original JPEG bytes retained. Used in the Voyager mission perspective, the optional finale return sequence, and a static graduation keepsake. A CSS ring identifies Earth at approximately 59.5% across and 52% down the original frame; it is an explanatory overlay, not a changed image pixel. Captions identify the historical observation rather than claiming a present-day live view.

The full-screen mission perspectives reuse the already credited Curiosity panorama, Ingenuity aerial image, Webb SMACS 0723 composite, and this Voyager observation. Their first-person lines are original Mission Alive narration. Planet comparison reuses the credited Blue Marble and LRO/Viking surface maps at the existing NASA diameter ratios; it does not change certification progress. The return route is an original illustration tracing the four training modules, not a physical spacecraft flight path.

- `public/assets/journey-sun-sdo.jpg`: NASA SDO/AIA 171 Å observation on September 10, 2025 (PIA26681). Credit: NASA/GSFC/Solar Dynamics Observatory. Source: https://science.nasa.gov/photojournal/image-of-sun-from-nasas-solar-dynamics-observatory/ . Original: https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia26/pia26681/PIA26681.jpg . Original bytes retained. The map uses a CSS soft-edge mask to blend it into space. Gold is the observation's false-color representation, not the Sun's visible-light color.
- `public/assets/journey-webb-esa.png`: official artist's impression with transparent background. Credit: ©ESA/ATG medialab. Source: https://www.esa.int/ESA_Multimedia/Images/2021/06/Webb_spacecraft_artist_s_impression . Original: https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2021/06/webb_spacecraft_artist_s_impression/23320227-1-eng-GB/Webb_spacecraft_artist_s_impression.png . Original PNG retained; displayed smaller on the map. This is an illustration, not a photo of Webb in space. ESA Standard Licence educational use; visible credit and terms link are retained.
- `public/assets/journey-webb-nasa.jpg`: NASA's official artist concept, included as an additional full-body reference in Sources & credits. Credit: NASA-GSFC, Adriana Gutierrez (CI Lab). Source: https://science.nasa.gov/asset/webb/james-webb-space-telescope-artist-conception/ . Original: https://assets.science.nasa.gov/content/dam/science/missions/webb/science/2022/06/STScI-01G1Q6WDRH19AMC8NXMRFSTBH6.png/jcr:content/renditions/2048x1593.jpg . NASA's published JPEG rendition is retained without content edits.

## Journey planetary imagery added October 28, 2026

- `public/assets/journey-earth-nasa.jpg`: Blue Marble 2002; NASA's Earth Observatory. Source: https://science.nasa.gov/resource/blue-marble-2002/ . Original: https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/1/1-bluemarble_west-1.jpg . NASA composite, displayed with a circular crop and soft shade.
- `public/assets/journey-moon-lroc.jpg`: NASA SVS CGI Moon Kit / LRO / LROC. Source: https://svs.gsfc.nasa.gov/4720/ . Original: https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_2k.jpg . Rendered onto a sphere at runtime, with simulated lighting.
- `public/assets/journey-mars-viking.jpg`: NASA/JPL/Caltech/USGS map from Viking imagery. Source: https://space.jpl.nasa.gov/tmaps/mars.html . Original: https://space.jpl.nasa.gov/tmaps/pix/mar0kuu2.jpg . Rendered onto a sphere at runtime, with simulated lighting.
- Diameter ratios use NASA's Planetary Fact Sheet: https://nssdc.gsfc.nasa.gov/planetary/factsheet/ . Distances are compressed, landing-site positions are approximate, and spacecraft icons are enlarged.

## Voyager solar-system flyout

- Local: `public/assets/solar-system-flyout.webm`
- Source: https://svs.gsfc.nasa.gov/13544/
- Original download: https://svs.gsfc.nasa.gov/vis/a010000/a013500/a013544/voyager_location_pull_out_from_solar_system_IPAD_high.webm
- Credit: NASA's Scientific Visualization Studio; image credit NASA/JPL-Caltech
- Dimensions: 1280 × 720; 1,618,881 bytes
- Retrieved October 5, 2026. Original WebM preserved without edits.
- Used as a silent, looping Voyager backdrop beneath the procedural star field. It loads only in the Voyager exhibit, pauses when the page is hidden, and falls back to the heliosphere still for reduced-motion or data-saver visitors.

## Exhibit backgrounds

### Lobby galaxy field

- Local: `public/assets/lobby-galaxies.jpg`
- Source: https://svs.gsfc.nasa.gov/14950/
- Original: https://svs.gsfc.nasa.gov/vis/a010000/a014900/a014950/14950_Galaxies_FlyThrough_Still.jpg
- Credit: NASA's Goddard Space Flight Center/Conceptual Image Lab
- Dimensions: 3840 × 2160; 834,029 bytes
- Retrieved October 6, 2026. Original JPEG preserved without edits.

### Curiosity panorama

- Local: `public/assets/curiosity-gale-panorama.jpg`
- Source: https://svs.gsfc.nasa.gov/31140/
- Original: https://svs.gsfc.nasa.gov/vis/a030000/a031100/a031140/PIA23632_M34_projection_pan_00000_print.jpg
- Credit: NASA's Jet Propulsion Laboratory
- Dimensions: 1024 × 576; 192,420 bytes
- Retrieved October 6, 2026. Original JPEG preserved without edits.

### Ingenuity aerial view

- Local: `public/assets/ingenuity-aerial.jpg`
- Source: https://science.nasa.gov/resource/first-aerial-color-image-of-mars/
- Original: NASA dynamic-image delivery of PIA24593, resized to 1600 × 1186 before download
- Credit: NASA/JPL-Caltech
- Dimensions: 1600 × 1186; 273,953 bytes
- Retrieved October 6, 2026. Converted locally from PNG to quality-84 JPEG to reduce the page payload.

### Voyager heliosphere still

- Local: `public/assets/voyager-heliosphere.jpg`
- Source: https://svs.gsfc.nasa.gov/13544/
- Original: https://svs.gsfc.nasa.gov/vis/a010000/a013500/a013544/voyager_location_pull_out_from_solar_system_still_copy.jpg
- Credit: NASA's Scientific Visualization Studio; image credit NASA/JPL-Caltech
- Dimensions: 1024 × 576; 204,613 bytes
- Retrieved October 6, 2026. Original JPEG preserved without edits.

## Webb deep-field atmosphere

- Local: `public/assets/webb-deep-field.jpg`
- Source: https://svs.gsfc.nasa.gov/31186
- Original download: https://svs.gsfc.nasa.gov/vis/a030000/a031100/a031186/deep-field_00439_print.jpg
- Credit: NASA, ESA, CSA, and STScI
- Dimensions: 1024 × 576; 106,135 bytes
- Retrieved October 5, 2026.
- Used at low opacity behind the procedural star field, color treatment, and motion layers. The image is decorative; the original scientific image is linked here with its full description and credit.

## Webb alignment sequence and first deep field

Retrieved October 21, 2026 for the alignment feedback. These are distinct from the decorative `webb-deep-field.jpg` backdrop.

- `public/assets/webb-hd84406-18-dots-mosaic.jpg`: NASA's actual initial HD 84406 alignment mosaic, February 11, 2022. Source: https://science.nasa.gov/blogs/webb/2022/02/11/photons-received-webb-sees-its-first-star-18-times/ ; original PNG: https://science.nasa.gov/wp-content/uploads/2022/02/alignment_mosaic_compressed.png . Credit: NASA. Downloaded PNG converted to JPEG locally without cropping or changing its content, 2487 × 1685, 369,722 bytes.
- `public/assets/webb-hd84406-hexagonal-array.jpg`: NASA's actual hexagonal image array, February 18, 2022. Source: https://science.nasa.gov/blogs/webb/2022/02/18/webb-team-brings-18-dots-of-starlight-into-hexagonal-formation/ ; original JPEG: https://science.nasa.gov/wp-content/uploads/2022/02/webb_img_array_noLabels_sm.jpeg . Credit: NASA/STScI/J. DePasquale. Original bytes retained, 1024 × 1024, 499,237 bytes.
- `public/assets/webb-first-deep-field-smacs0723.png`: Webb's First Deep Field (NIRCam Image), SMACS 0723, July 2022 release. Source: https://science.nasa.gov/asset/webb/webbs-first-deep-field-nircam-image/ ; NASA's 1960 × 2000 PNG rendition: https://assets.science.nasa.gov/content/dam/science/missions/webb/science/2022/07/STScI-01G8H1K2BCNATEZSKVRN9Z69SR.png/jcr:content/renditions/1960x2000.png . Full credit: NASA, ESA, CSA, STScI. Original rendition retained, 5,788,510 bytes.

The visible credit is `Images: NASA/STScI` as requested. The centered-dot stacking stage is an original schematic, explicitly identified as simplified in its accessible description; it is not a photograph or a claim to reproduce a calibrated point-spread function. If a local image fails to load, the feedback silently keeps a matching schematic and never displays a broken image or a deep-field caption without the field. Alignment stages are tied to the existing three-star progress, and the point holds for 1.2 seconds before the deep field appears, including with reduced motion.

## Golden Record front

- Local: `src/assets/golden-record-front.jpg`
- Source: https://science.nasa.gov/image-detail/voyager-gold-record-front/
- Original: https://science.nasa.gov/wp-content/uploads/2024/03/voyager-gold-record-front.jpg
- Credit: NASA/JPL-Caltech
- Original dimensions: 1975 × 1971; 342,808 bytes
- Retrieved October 4, 2026. Original file preserved without image edits.
- The disc's front has the _Sounds of Earth_ center label.

## Golden Record protective cover

- Local: `src/assets/voyager-golden-record-cover.webp`
- Source and background: https://science.nasa.gov/mission/voyager/voyager-golden-record-overview/
- Credit: NASA/JPL-Caltech
- Dimensions: 600 × 600; 42,094 bytes
- Supplied by the user on October 4, 2026 and preserved without image edits.
- This is a separate protective cover, not the reverse face of the audio disc. It includes playback and location diagrams.

Both photos are presented as flat textures on a simplified circular 3D object, or directly as images in the 2D fallback. Photographic reflections are part of the original image. The cover is fetched only when selected. Credits and source links are visible beside the view controls.

NASA media usage guidance: https://www.nasa.gov/nasa-brand-center/images-and-media/

These images are used for factual educational presentation, with credit and no implication of endorsement. No separate third-party copyright holder was identified on their source pages. Do not treat the NASA mark visible inside the historical photograph as this project's branding.

## Greeting recordings

The user supplied 55 original MP3 files in `golden-record-greetings`. The numbered filenames identify their language association. All originals are preserved; the build copies their bytes into separately requested assets. Reference list and translations: https://science.nasa.gov/mission/voyager/golden-record-contents/greetings/

Country/region associations in `src/greetings-catalog.js` are curated discovery aids and explicitly non-exhaustive. They do not identify the speaker's nationality. Individual recording provenance and redistribution rights have not been independently authenticated.

## Other assets

The other exhibits use original simplified Three.js geometry. Interface feedback tones are synthesized using Web Audio. There are no externally hosted fonts or runtime AI services.
