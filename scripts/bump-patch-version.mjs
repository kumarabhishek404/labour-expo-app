import fs from "fs";
import path from "path";

const appJsonPath = path.join(process.cwd(), "app.json");
const raw = fs.readFileSync(appJsonPath, "utf8");
const appJson = JSON.parse(raw);

const version = appJson.expo.version || "1.0.0";
const [major, minor, patch] = version.split(".").map(Number);

const newVersion = `${major}.${minor}.${patch + 1}`;
appJson.expo.version = newVersion;

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));

console.log(`✅ OTA patch version bumped to ${newVersion}`);
