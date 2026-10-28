export const machineParts = {
  curiosity: {
    source: "https://science.nasa.gov/mission/msl-curiosity/science-instruments/",
    sourceLabel: "NASA · Curiosity science instruments",
    parts: [
      {
        id: "mastcam",
        label: "Mastcam eyes",
        position: [0.95, 2.58, 0],
        description: "The paired color cameras survey the landscape, build panoramas, and help mission planners choose safe driving routes and useful science targets.",
        sound: 710,
      },
      {
        id: "arm",
        label: "Robotic arm & turret",
        position: [1.72, 0.48, -0.42],
        description: "The arm places a drill, brush, close-up camera, and spectrometer against Martian rocks. Powdered samples can then travel to laboratories inside the rover.",
        sound: 240,
      },
      {
        id: "power",
        label: "Radioisotope power",
        position: [-0.92, 1.36, 0],
        description: "Curiosity converts heat from plutonium decay into electricity, allowing it to work through Martian nights and winters without relying on sunlight.",
        sound: 150,
      },
      {
        id: "mobility",
        label: "Wheels & suspension",
        position: [0.2, 0.4, 1.2],
        description: "Six independently driven wheels and a rocker-bogie suspension help the rover keep contact with rough ground while climbing over hazards.",
        sound: 120,
      },
    ],
  },
  ingenuity: {
    source: "https://www.jpl.nasa.gov/news/press_kits/mars_2020/ingenuity/landing/mission/spacecraft/",
    sourceLabel: "NASA/JPL · Ingenuity spacecraft",
    parts: [
      {
        id: "rotors",
        label: "Counter-rotating rotors",
        position: [1.15, 1.9, 0],
        description: "Two stacked rotors spin in opposite directions at roughly 2,400 rpm. Their lightweight carbon-fiber blades create lift in Mars’ extremely thin atmosphere.",
        sound: 520,
      },
      {
        id: "solar",
        label: "Solar panel",
        position: [0, 2.3, 0],
        description: "The panel charges Ingenuity’s batteries during the Martian day so the helicopter can fly and keep its electronics warm overnight.",
        sound: 820,
      },
      {
        id: "fuselage",
        label: "Fuselage",
        position: [0, 0.92, 0.24],
        description: "This tissue-box-sized body contains computers, batteries, sensors, heaters, and radio hardware needed for autonomous flight.",
        sound: 310,
      },
      {
        id: "legs",
        label: "Landing legs",
        position: [0.72, 0.22, 0.58],
        description: "Four light carbon-composite legs absorb touchdown loads and keep the fuselage above uneven Martian ground.",
        sound: 180,
      },
    ],
  },
  webb: {
    source: "https://science.nasa.gov/mission/webb/science-overview/science-explainers/telescope-overview/",
    sourceLabel: "NASA · Webb telescope overview",
    parts: [
      {
        id: "primary",
        label: "Primary mirror",
        position: [0.92, 2.28, 0.16],
        description: "Eighteen gold-coated beryllium segments align to act as one large mirror. Each segment is mounted to the backplane through actuators instead of floating on its own.",
        sound: 460,
      },
      {
        id: "secondary",
        label: "Secondary mirror",
        position: [0, 1.92, 2.08],
        description: "This smaller convex mirror receives light from the primary mirror and reflects it back toward Webb’s scientific instruments.",
        sound: 620,
      },
      {
        id: "backplane",
        label: "Mirror backplane",
        position: [-0.72, 2.42, -0.23],
        description: "This stiff composite structure supports the mirror segments, their actuators, and the two folding side wings so all 18 pieces can hold an exact shared shape.",
        sound: 370,
      },
      {
        id: "sunshield",
        label: "Five-layer sunshield",
        position: [1.35, -0.02, 0.9],
        description: "A tennis-court-sized shield blocks light and heat from the Sun, Earth, and Moon so Webb’s infrared instruments can remain extremely cold.",
        sound: 190,
      },
      {
        id: "instruments",
        label: "Science instruments",
        position: [-0.38, 0.55, -0.38],
        description: "Cameras and spectrographs behind the mirror turn focused infrared light into images and spectra that reveal temperature, motion, and chemistry.",
        sound: 760,
      },
    ],
  },
  voyager: {
    source: "https://science.nasa.gov/mission/voyager/voyager-golden-record-overview/",
    sourceLabel: "NASA · Golden Record overview",
    parts: [
      {
        id: "record",
        label: "Sounds of Earth record",
        position: [0.95, 1.7, 0.2],
        description: "The gold-plated copper disc stores music, natural sounds, photographs encoded as audio, and greetings in 55 languages.",
        sound: 440,
      },
      {
        id: "stylus",
        label: "Playback diagram",
        position: [-1.08, 2.2, 0.18],
        description: "The engraved upper-left diagram shows the record, stylus, playback direction, and the time needed for one rotation.",
        sound: 540,
      },
      {
        id: "image-code",
        label: "Image decoding",
        position: [0.98, 0.82, 0.18],
        description: "Another diagram explains how signals on the record can be reconstructed into rectangular pictures with the correct proportions.",
        sound: 680,
      },
      {
        id: "pulsars",
        label: "Pulsar map",
        position: [-1.05, 0.52, 0.18],
        description: "Lines identify the Sun’s position using the directions and pulse periods of 14 pulsars, creating a cosmic return address.",
        sound: 330,
      },
    ],
  },
};

export function machinePartGuide(id) {
  return machineParts[id] || machineParts.curiosity;
}
