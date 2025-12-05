import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


export async function POST() {
  const filePath = path.join(process.cwd(), "data", "awards.json");
  const awards = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // 1. Build full list with dummy flags
  const items = awards.map((a, index) => ({
    id: a.id,
    text: a.item ?? `${index + 1}`,
    isAvailable: a.inventory > 0,
    isDummy: a.item === undefined
  }));

  // 2. Filter pickable items
  const pickable = items.filter(item =>
    item.isDummy || ( !item.isDummy && item.isAvailable )
  );

  // 3. Randomly pick one
  const selected = pickable[Math.floor(Math.random() * pickable.length)];

  // 4. If winner, reduce inventory in JSON
  if (!selected.isDummy) {
    const index = awards.findIndex(a => a.id === selected.id);
    if (index !== -1 && awards[index].inventory > 0) {
      awards[index].inventory -= 1;
    }

    fs.writeFileSync(filePath, JSON.stringify(awards, null, 2));
  }

  return NextResponse.json({
    ...selected,
    isWinner: !selected.isDummy && selected.isAvailable
  });
}
