import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-first-run", "--disable-extensions"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const errors = [];
page.on("pageerror", (err) => errors.push(`PAGEERROR: ${err.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`CONSOLE: ${msg.text()}`);
});
page.on("requestfailed", (req) =>
  errors.push(`REQFAIL: ${req.url().slice(0, 120)} ${req.failure()?.errorText}`)
);

console.log("— loading home —");
await page.goto("http://localhost:3000", { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, 5000));

console.log("— scrolling to projects —");
await page.evaluate(() => document.querySelector("#projects")?.scrollIntoView());
await new Promise((r) => setTimeout(r, 2500));

console.log("— clicking bridal tile —");
await page.click('a[href="/work/bridal"]');
await new Promise((r) => setTimeout(r, 5000));
console.log("URL now:", page.url());
const h1 = await page.evaluate(() => document.querySelector("h1")?.textContent ?? "(no h1)");
console.log("h1:", h1);
console.log("scrollY on gallery load:", await page.evaluate(() => Math.round(window.scrollY)));
const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 200));
console.log("body starts:", JSON.stringify(bodyText));

console.log("— back home, then to western gallery —");
await page.click('nav a[href="/#projects"]');
await new Promise((r) => setTimeout(r, 4000));
console.log("URL after back:", page.url());

await page.goto("http://localhost:3000/work/western", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3500));
await page.evaluate(() => window.scrollBy(0, 300));
await new Promise((r) => setTimeout(r, 2500));
const shot = process.env.SHOT ?? "western-check.png";
await page.screenshot({ path: shot });
console.log("screenshot:", shot);

console.log("\n=== captured errors ===");
console.log(errors.length ? errors.join("\n") : "(none)");
await browser.close();
