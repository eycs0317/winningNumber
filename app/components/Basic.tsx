'use client';

import { useState, useEffect } from "react";

interface BaseAward {
  inventory: number;
  id: number;
}

interface ItemAward extends BaseAward {
  item?: string;
}

interface BasicProps {
  count: number;
  isWon?: boolean;
  award: ItemAward[];
  uiStyle?: 'default' | 'casino' | 'roulette';
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function Basic({ count, award, uiStyle = 'default' }: BasicProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [userWon, setUserWon] = useState<boolean | null>(null);
  const [shuffledAwards, setShuffledAwards] = useState<
    { id: number; text: string; isAvailable: boolean, isDummy: boolean }[]
  >([]);
  console.log('shuffledAwards', shuffledAwards);

  // Determine mode once from props: whether items are present (item-name mode)
  const singleGiftMode = !award[0]?.item;
// console.log('singleGiftMode at top', singleGiftMode);
// useEffect(() => {
//   fetch("/api/awards")
//     .then(res => res.json())
//     .then(data => setShuffledAwards(shuffleArray(data)));
// }, []);

// onLoad with award prop
  useEffect(() => {
    const items = Array.from({ length: count }, (_, index) => {

      const a = award[index];
      let label = "";
      let isDummy;

      if (singleGiftMode) {
        // case 1: no item mode → use index number
        label = `${index + 1}`;
        if(index === 0){
          isDummy = false;
        } else {
          isDummy = true;
        }
      } else if (!singleGiftMode && a?.item) {
        // case 2: 'x' item mode'
        label = a.item;
        isDummy = false;
      } else {
        // case 3: 'X' item mode (no item name)'
        label = "X";
        isDummy = true;
      }

      return {
        id: a?.id ?? index + 1,
        text: label,
        isAvailable: (a?.inventory ?? 0) > 0,
        isDummy
      };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    setShuffledAwards(shuffleArray(items));
  }, [count, award ]); // recompute if count/award change

  const mappedItems = shuffledAwards.map((item) => {
    const isAvailable = item.isAvailable;
    const isSelected = selectedNumber === item.id;

    const base =
      'max-w-md text-xl p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 shadow-md';

    // Apply green only when we're in "no item name" mode (withItem === false)
    const availableClass =
      singleGiftMode && isAvailable
        ? "bg-green-500 text-white font-bold" // green only for number mode
        : "bg-gray-200 hover:bg-gray-300 text-gray-800"; // default for item mode OR unavailable

    const selectedClass = isSelected ? "animate-pulse ring-6 ring-red-400" : "";

    const classes = [base, availableClass, selectedClass].join(" ");

    return (
      <div key={item.id} className={classes}>
        {item.text}
      </div>
    );
  });
// const handleOnClick = async () => {
//   const res = await fetch("/api/draw", { method: "POST" });
//   const result = await res.json();

//   setSelectedNumber(result.id);
//   setUserWon(result.isWinner);
// };

// onclick function when award prop pass in
  const handleOnClick = () => {
  if (shuffledAwards.length === 0) return;

  let pick = null;

  while (pick === null) {
    const randomIndex = Math.floor(Math.random() * shuffledAwards.length);
    const candidate = shuffledAwards[randomIndex];

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
