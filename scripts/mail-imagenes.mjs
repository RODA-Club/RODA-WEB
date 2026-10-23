// Genera las imágenes del mail de confirmación (public/mail/*.png, a 2x) y sus
// tamaños (lib/mail/piezas.json) desde /dev/mail-piezas.
// Uso: con `npm run dev` corriendo en el puerto 3000, `node scripts/mail-imagenes.mjs`.
// Necesita Playwright con Chromium (npx playwright install chromium).
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 700, height: 800 } });
await page.goto(`${base}/dev/mail-piezas`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const tamanos = {};
for (const el of await page.$$("[data-pieza]")) {
  const id = await el.getAttribute("data-pieza");
  const box = await el.boundingBox();
  tamanos[id] = { width: Math.ceil(box.width), height: Math.ceil(box.height) };
  await el.screenshot({ path: `public/mail/${id}.png`, omitBackground: true });
}
writeFileSync("lib/mail/piezas.json", JSON.stringify(tamanos, null, 2) + "\n");
console.log(`${Object.keys(tamanos).length} imágenes generadas`);
await browser.close();
