// Curated NASA event dates; the visitor's local calendar chooses each day's card.
export const missionHistory = [
  { month: 1, day: 8, year: 2022, mission: "Webb", title: "The mirror finished unfolding", detail: "Webb latched its final primary-mirror wing in space. Its optics still needed months of alignment before science began.", source: "https://science.nasa.gov/blogs/webb/2022/01/08/primary-mirror-wings-deployed-all-major-deployments-complete/" },
  { month: 1, day: 18, year: 2024, mission: "Ingenuity", title: "A final flight", detail: "Ingenuity flew for the 72nd and last time. The technology demonstration had been designed for only five flights.", source: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/" },
  { month: 2, day: 8, year: 2013, mission: "Curiosity", title: "First rock sample drilling", detail: "Curiosity drilled into the John Klein rock to collect a sample for analysis inside the rover.", source: "https://science.nasa.gov/resource/curiositys-first-sample-drilling/" },
  { month: 2, day: 14, year: 1990, mission: "Voyager 1", title: "Earth became a pale blue dot", detail: "Voyager 1 turned its camera homeward and photographed Earth from billions of kilometers away.", source: "https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/" },
  { month: 3, day: 5, year: 1979, mission: "Voyager 1", title: "Close encounter with Jupiter", detail: "Voyager 1 made its closest approach to Jupiter and gave scientists a much sharper look at the giant planet and its moons.", source: "https://science.nasa.gov/mission/voyager/voyager-1/" },
  { month: 4, day: 19, year: 2021, mission: "Ingenuity", title: "First powered flight on another planet", detail: "Ingenuity rose from the Martian ground and proved controlled flight was possible in its thin atmosphere.", source: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/" },
  { month: 7, day: 12, year: 2022, mission: "Webb", title: "The first science images arrived", detail: "NASA released Webb's first full set of color images and spectra, opening its science operations.", source: "https://science.nasa.gov/mission/webb/webb-mission-timeline/" },
  { month: 8, day: 6, year: 2012, mission: "Curiosity", title: "A sky crane lowered a rover to Mars", detail: "Curiosity touched down inside Gale Crater and began searching for signs of a once-habitable environment.", source: "https://science.nasa.gov/mission/msl-curiosity/" },
  { month: 8, day: 25, year: 2012, mission: "Voyager 1", title: "Into interstellar space", detail: "Voyager 1 crossed the heliopause, the boundary of the Sun's protective bubble.", source: "https://science.nasa.gov/mission/voyager/voyager-1/" },
  { month: 9, day: 5, year: 1977, mission: "Voyager 1", title: "The journey began", detail: "Voyager 1 launched toward Jupiter and Saturn carrying a Golden Record of Earth.", source: "https://science.nasa.gov/mission/voyager/voyager-1/" },
  { month: 11, day: 12, year: 1980, mission: "Voyager 1", title: "A flyby of Saturn", detail: "Voyager 1 reached its closest approach to Saturn before heading toward interstellar space.", source: "https://science.nasa.gov/mission/voyager/voyager-1/" },
  { month: 11, day: 26, year: 2011, mission: "Curiosity", title: "A rover left Earth", detail: "NASA launched Curiosity on a journey to ask whether ancient Mars could have supported microbes.", source: "https://science.nasa.gov/mission/msl-curiosity/" },
  { month: 12, day: 25, year: 2021, mission: "Webb", title: "A folded observatory launched", detail: "Webb began its trip with its enormous mirror and sunshield packed for the rocket.", source: "https://science.nasa.gov/mission/webb/webb-mission-timeline/" },
];

export function pickMissionHistory(date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const anniversary = missionHistory.find((event) => event.month === month && event.day === day);
  if (anniversary) return { ...anniversary, anniversary: true };
  const start = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((Date.UTC(date.getFullYear(), month - 1, day) - Date.UTC(start.getFullYear(), 0, 1)) / 86_400_000);
  return { ...missionHistory[dayOfYear % missionHistory.length], anniversary: false };
}

export function missionHistoryMarkup(date = new Date()) {
  const event = pickMissionHistory(date);
  const eventDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(event.year, event.month - 1, event.day)));
  return `<section class="history-card" aria-labelledby="history-title">
    <div class="history-date"><span class="history-star" aria-hidden="true">✦</span><span>${event.anniversary ? "ON THIS DATE IN MISSION HISTORY" : "TODAY'S MISSION ARCHIVE CARD"}</span></div>
    <div class="history-main"><div><p class="eyebrow">${event.mission} · <time data-i18n-date="${new Date(Date.UTC(event.year, event.month - 1, event.day)).toISOString()}" data-i18n-timezone="UTC">${eventDate}</time></p><h2 id="history-title">${event.title}</h2><p>${event.detail}</p></div><a href="${event.source}" target="_blank" rel="noopener">Read the NASA record ↗</a></div>
    ${event.anniversary ? "" : "<p class=\"history-note\">An archive highlight selected for today, not an anniversary of today's date.</p>"}
  </section>`;
}
