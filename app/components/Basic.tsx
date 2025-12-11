'use client';

import { useState, useEffect } from "react";
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

export default function Basic({ uid = "dummyData02" }: BasicProps) {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [baseData, setBaseData] = useState<any>();
  const [displayData, setDisplayData] = useState<any>();
  const [hasItemNameMode, setHasItemNameMode] = useState<boolean | null>(null);
  const [selectedIndexValue, setSelectedIndexValue] = useState<number>()
  const [userWon, setUserWon] = useState<boolean | null>(null);

useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/onLoad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid }),
        })
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();

      setBaseData(data.baseResult);
      setDisplayData(data.displayResult);
      setHasItemNameMode(data.hasItemNameMode);
      setIsLoading(false);

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
    //The selected from server apply red ring
    const selectedClass = selectedIndexValue === shuffledIndex ? "animate-pulse ring-6 ring-red-400"  : "";
    // without item case
    if (!hasItemNameMode) {
      //Only the first item is green, indicate that the only prize that can be won.
      if(shuffledIndex === 0){
        classes = "bg-green-500 text-white font-bold"
      }

      return (
        <li key={key} className={`m-2 p-4 border rounded bg-gray-100 ${classes} ${selectedClass}` }>
          {shuffledIndex + 1}
        </li>
      );
    } else {
      //With item case
      return (
        <li key={key} className={`m-2 p-4 border rounded bg-gray-100 ${selectedClass}`}>
          {baseData ? baseData[shuffledIndex] : "Loading..."}
        </li>
      );
    }
  });

  const handleOnClick = async () => {
    setIsLoading(true)
    try{
        const res = await fetch('./api/getSelected', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid }),
        });
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const {selectedIndexValue, winStatus} = await res.json();
        setSelectedIndexValue(selectedIndexValue);
        setUserWon(winStatus);

      } catch (error) {
      console.error("Error in data during api/getSelected:", error);
    }
      finally {
        setIsLoading(false);
      }
  };

  return (
    <div>
      <h1 className='text-center p-4 text-2xl'>Basic Component</h1>
      <div className="flex flex-col items-center border-2 border-gray-300 rounded  max-w-sm mx-auto p-4 mt-4">
        <ul className="flex flex-wrap">{mappedItemsForDisplay}</ul>
        <button className="text-xl mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleOnClick}>
          Click Me
        </button>
      </div>

      <div className='text-center mt-5'>
        {userWon !== null && <p>{userWon ? "You Won!" : "You Lost."}</p>}
      </div>

    </div>
  );
}

