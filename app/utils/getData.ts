import fs from "fs";
import path from "path";

export default function getData(uid: string) {

    const filePath = path.join(process.cwd(), "data", `${uid}.json`);
    const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return json

}