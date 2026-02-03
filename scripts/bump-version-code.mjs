import fs from "fs";
import path from "path";

const appJsonPath = path.join(process.cwd(), "app.json");

// Read app.json
const raw = fs.readFileSync(appJsonPath, "utf8");
const app = JSON.parse(raw);

// Ensure android config exists
if (!app.expo?.android?.versionCode) {
  throw new Error("android.versionCode is missing in app.json");
}

// Increment versionCode
app.expo.android.versionCode += 1;

// Write back
fs.writeFileSync(appJsonPath, JSON.stringify(app, null, 2));

console.log(
  `✅ Android versionCode updated to ${app.expo.android.versionCode}`,
);
