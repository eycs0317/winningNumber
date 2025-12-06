'use client';

import { useState, useEffect } from "react";
import { shuffleArray } from "../utils/shuffleArray";
import { transformAwards } from "../utils/transformAwards";
import { getItemClass } from "../utils/getItemClass";
import { drawAward } from "../utils/draw";

interface BasicProps {
  count: number;
  uiStyle?: 'default' | 'casino' | 'roulette';
}

export default function Basic({ count, uiStyle = 'default' }: BasicProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [userWon, setUserWon] = useState<boolean | null>(null);
  const [shuffledAwards, setShuffledAwards] = useState<{ id: number; text: string; isAvailable: boolean, isDummy:boolean }[]>([]);
  const [singleGiftMode, setSingleGiftMode] = useState<boolean>();

useEffect(() => {
  fetch("/api/awards")
    .then(res => res.json())
    .then(data => {
      const { items, singleGiftMode } = transformAwards(data, count);
        setSingleGiftMode(singleGiftMode);
        setShuffledAwards(shuffleArray(items));
    });
}, []);

  const mappedItems = shuffledAwards.map((item) => {
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

  const handleOnClick = async () => {
  const result = await drawAward(shuffledAwards);

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

//  onload call api to get awards data
// basic on the count to render items and add dummy if necessary
//when user click, call api to get a random item and update inventory and return result
