import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


export async function POST(req: Request) {
  const filePath = path.join(process.cwd(), "data", "awards.json");
  const awards = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const body = await req.json();
  const shuffledAwards = body.shuffledAwards
  const shuffledAwardsLength = shuffledAwards.length
  console.log('awards', awards)
  console.log('shuffledAwards', shuffledAwards)

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
