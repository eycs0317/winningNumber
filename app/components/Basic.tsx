'use client';

import { useState, useEffect } from "react";
import { shuffleArray } from "../utils/shuffleArray";
import { transformAwards } from "../utils/transformAwards";
import { getItemClass } from "../utils/getItemClass";
import { drawAward } from "../utils/draw";

interface BasicProps {
  count: number;
  jsonFileName: string;
}

export default function Basic({ count = 4, jsonFileName = "dummyData01" }: BasicProps) {

  // State to hold randomly selected number for the win
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  // State to hold whether the user won
  const [userWon, setUserWon] = useState<boolean | null>(null);
  // State to hold shuffled awards
  const [shuffledAwards, setShuffledAwards] = useState<{ id: number; text: string; isAvailable: boolean, isDummy:boolean }[]>([]);
  // State to determine if single gift mode is active, ex: award: [ inventory: 1 ]
  const [singleGiftMode, setSingleGiftMode] = useState<boolean>();

// OnLoad fetch awards data from api
useEffect(() => {
  fetch(`api/awards?jsonFileName=${jsonFileName}`)
    .then(res => res.json())
    .then(data => {
      // Transform awards data based on count and if data has item name.
      const { items, singleGiftMode } = transformAwards(data, count);
        setSingleGiftMode(singleGiftMode);
        setShuffledAwards(shuffleArray(items));
    });
}, []);

// Map through shuffled awards to render items
  const mappedItems = shuffledAwards.map((item) => {
    // Get CSS classes based on availability, selection, and mode
    const classes = getItemClass(
      item.isAvailable,
      selectedNumber === item.id,
      singleGiftMode
    );

    return (
      <div key={item.id} className={classes}>
        {item.text}
      </div>
    );
  });

// Handle click event to draw an award
  const handleOnClick = async () => {
    // Call drawAward utility with shuffled awards to get the winning pick and update inventory.
  const result = await drawAward(shuffledAwards, jsonFileName);
  const pick = result.pick;
  setSelectedNumber(pick.id);
  setUserWon(!pick.isDummy && pick.isAvailable); // only real & available = win
};


  return (
    <div>
      <h1>Basic Component</h1>
      <div className="flex flex-wrap">{mappedItems}</div>
      <button className="text-xl mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleOnClick}>
        Click Me
      </button>
      <p>Selected Number: {selectedNumber}</p>
      {userWon !== null && <p>{userWon ? "You Won!" : "You Lost."}</p>}
    </div>
  );
}

