import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the interface for the data structure you are working with
interface AwardItem {
  id: number;
  inventory?: number; // Optional, as dummy items may not have it
  item?: string;
}

interface AwardData {
  count: number;
  awards: AwardItem[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const uid: string = body.uid;

    // --- 1. Read JSON Data ---
    const filePath = path.join(process.cwd(), "data", `${uid}.json`);

    // Check if file exists before reading
    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: `File not found for uid: ${uid}` }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const json: AwardData = JSON.parse(fileContent);
    const award = json.awards

  const selectableIndices: number[] = [];

  Array.from({ length: json.count }, (_, index) => {
    // Safely check if the item exists at this index in the shorter 'json.awards' array
    const awardItem = json.awards[index];

    // Case 1: The index exists in the 'awards' array
    if (awardItem) {
      // Check for available inventory (> 0)
      const isAvailable: boolean = (awardItem.inventory ?? 0) > 0;

      if (isAvailable) {
        // Only push if inventory > 0
        selectableIndices.push(index);
      }

    } else {
      // Case 2: The index is missing (e.g., index 1, 2, 3 in your example)
      // This spot must be a dummy item, so we save its index.
      selectableIndices.push(index);
    }
  });

    const randomIndex = Math.floor(Math.random() * selectableIndices.length);

    const selectedIndexValue = selectableIndices[randomIndex];

    const pickedAward = award[selectedIndexValue];
    let winStatus = false;
    if ((pickedAward?.inventory ?? 0) > 0) {
      winStatus = true;
      //Decrement inventory here or via a subsequent API call
      if (pickedAward.inventory! > 0) { // Use ! assertion since we just checked > 0
          pickedAward.inventory! -= 1;
      }

      // save to json
      const updatedJsonContent = JSON.stringify(json, null, 2);
      fs.writeFileSync(filePath, updatedJsonContent);
      }

    return NextResponse.json({selectedIndexValue, winStatus});

  } catch (error) {
    console.error("API Error:", error);
    // Handle potential JSON parsing errors, file reading errors, etc.
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}