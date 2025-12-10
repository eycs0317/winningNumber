import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {

  const body = await request.json();
  const uid = body.uid
  // console.log('body  received in API uid:', uid);

  const filePath = path.join(process.cwd(), "data", `${uid}.json`);
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));

  return NextResponse.json(json);
}
