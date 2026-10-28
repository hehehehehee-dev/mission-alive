# Asset ledger

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
