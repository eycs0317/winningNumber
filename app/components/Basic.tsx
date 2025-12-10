'use client';

import { useState, useEffect } from "react";
import { fetchAllData } from "../utils/fetchAllData";
import { createBase } from "../utils/createBase";
import { createDisplay } from "../utils/createDisplay";
interface BasicProps {
  uid?: string;
}
interface BaseAward {
  id: number;
  inventory: number;
}

// Award structure that includes 'item' (Case 2)
interface ItemAward extends BaseAward {
  item: string; // The property 'item' is REQUIRED here
}

// The union type for any single item in the data array
type AwardItem = BaseAward | ItemAward;

export default function Basic({ uid = "dummyData03" }: BasicProps) {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>();
  // const [data, setData] = useState<any>();
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [baseData, setBaseData] = useState<any>();
  const [displayData, setDisplayData] = useState<any>();
  const [selectedIndexValue, setSelectedIndexValue] = useState<number>()
  const [userWon, setUserWon] = useState<boolean>(false);

useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true)

      const data = await fetchAllData(uid)
      const awardsData: AwardItem[] = data.awards
      const awardsCount: number = data.count ?? 0;
      const baseResult = createBase({data: awardsData, count: awardsCount});
      const displayResult = createDisplay(awardsCount);
      setAwards(awardsData);
      setCount(awardsCount);
      setBaseData(baseResult);
      setDisplayData(displayResult);

    }
    catch (error) {
      console.error("Error in data pipeline:", error);
    } finally {
      setIsLoading(false);
    }
  }
  loadData();

}, [uid]);

const mappedItemsForDisplay = displayData?.map((shuffledIndex: number) => {
    const key = `item-${shuffledIndex}`;
    let classes = ""
    const selectedClass = selectedIndexValue === shuffledIndex ? "animate-pulse ring-6 ring-red-400"  : "";
    // without item case
    if (baseData[0] === "") {
      if(shuffledIndex === 0){
        classes = "bg-green-500 text-white font-bold"
      }

      return (
        <div key={key} className={`m-2 p-4 border rounded bg-gray-100 ${classes} ${selectedClass}` }>
          {shuffledIndex + 1}
        </div>
      );
    } else {
      //With item case
      return (
        <div key={key} className={`m-2 p-4 border rounded bg-gray-100 ${selectedClass}`}>
          {baseData ? baseData[shuffledIndex] : "Loading..."}
        </div>
      );
    }
  });

  const handleOnClick = async () => {
    const res = await fetch('./api/getSelected', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid }),
    });
    const {selectedIndexValue, winStatus} = await res.json();
    setSelectedIndexValue(selectedIndexValue);
    setUserWon(winStatus);
};

  return (
    <div>
      <h1>Basic Component</h1>
      <div className="flex flex-wrap">{mappedItemsForDisplay}</div>
      <button className="text-xl mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleOnClick}>
        Click Me
      </button>
      {/* <p>Selected Number: {selectedNumber}</p> */}
      {userWon !== null && <p>{userWon ? "You Won!" : "You Lost."}</p>}
    </div>
  );
}

