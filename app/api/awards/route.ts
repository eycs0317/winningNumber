import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("jsonFileName")

  const filePath = path.join(process.cwd(), "data", `${name}.json`);
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));

  return NextResponse.json(json);
}
