// Fügt Sendungen aus einer zusätzlichen XMLTV-Datei (z. B. epg.best) in site/guide.xml ein.
// Nur Sender aus MAP werden übernommen, und nur wenn guide.xml für sie noch keine Sendungen hat.
// Aufruf: node scripts/merge-extra.mjs <extra.xml> <guide.xml>
import { readFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

const MAP = { "SyFy.de": "syfy", "NatGeoWild.de": "ngwild", "Puls24.at": "puls24" };
const NAMES = { syfy: "SYFY", ngwild: "Nat Geo Wild", puls24: "PULS 24" };

const [extraPath, guidePath] = process.argv.slice(2);
let raw = readFileSync(extraPath);
if (raw[0] === 0x1f && raw[1] === 0x8b) raw = gunzipSync(raw);
const extra = raw.toString("utf8");
let guide = readFileSync(guidePath, "utf8");

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let added = 0, channels = [], programmes = [];
for (const [src, id] of Object.entries(MAP)) {
  if (guide.includes(`channel="${id}"`)) { console.log(`${id}: schon vorhanden, übersprungen`); continue; }
  const re = new RegExp(`<programme\\b[^>]*\\bchannel="${esc(src)}"[^>]*>[\\s\\S]*?</programme>`, "g");
  const found = extra.match(re) || [];
  console.log(`${id}: ${found.length} Sendungen`);
  if (!found.length) continue;
  channels.push(`<channel id="${id}"><display-name>${NAMES[id]}</display-name></channel>`);
  programmes.push(...found.map(p => p.replace(`channel="${src}"`, `channel="${id}"`)));
  added += found.length;
}
if (added) {
  guide = guide.replace(/(<tv\b[^>]*>)/, `$1\n${channels.join("\n")}`).replace(/<\/tv>\s*$/, `${programmes.join("\n")}\n</tv>\n`);
  writeFileSync(guidePath, guide);
}
console.log(`Zusätzliche Sendungen eingefügt: ${added}`);
