import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


export async function POST(request: Request) {

  const body = await request.json();
  const shuffledAwards = body.shuffledAwards
  const name = body.jsonFileName

  const filePath = path.join(process.cwd(), "data", `${name}.json`);
  const awards = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const synced = shuffledAwards.map((item: any) => {
  const serverItem = awards.find((a: any) => a.id === item.id);
    return {
      ...item,
      isAvailable: serverItem?.isAvailable ?? item.isAvailable, // server wins
    };
  });



  if (synced.length === 0) {
    return NextResponse.json({
      ok: false,
      message: "No awards available to draw from."
    })
  }

  let pick = null;

    while (pick === null) {
    const randomIndex = Math.floor(Math.random() * synced.length);
    const candidate = synced[randomIndex];

    // Dummy → always allowed (lose)
    if (candidate.isDummy) {
      pick = candidate;
      break;
    }

    // Real prize → allowed only if in stock
    if (!candidate.isDummy && candidate.isAvailable) {
      pick = candidate;
      break;
    }

    // Otherwise → keep looping
  }


  return NextResponse.json({
    ok: true,
    pick
  });
}
