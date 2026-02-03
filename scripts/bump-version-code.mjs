import fs from "fs";
import app from "../app.json";

app.expo.android.versionCode += 1;

fs.writeFileSync("app.json", JSON.stringify(app, null, 2));
