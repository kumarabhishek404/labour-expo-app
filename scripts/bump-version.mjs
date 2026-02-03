// bump-version.mjs
import fs from "fs";

const app = JSON.parse(fs.readFileSync("app.json", "utf8"));
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

pkg.version = app.expo.version;

fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
