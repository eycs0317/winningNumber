'use client';
// app/page.tsx (Example Usage)
// import WheelPicker from "./components/WheelPicker";
// import RouletteWheel from "./components/RouleeteWheel";
import WheelSpinner from "./components/WheelSpinner";
// import WheelSpinner01 from "./components/WheelSpinner01";
// ... sampleItems remains the same ...
import Basic from "./components/Basic";


export default function HomePage() {

//   const totalSlices = 4;
// const itemsList = ['a', 'b',];

// Determine the winning index (e.g., from an API call, or just fixed for testing)
// const winningGoalIndex = 1; // Item 'd' is the winner

// const handleSpinFinished = (landedIndex: number, didWin: boolean) => {
//   const landedItem = itemsList[landedIndex];

//   if (didWin) {
//     alert(`WIN! You landed on Item ${landedItem} (Index ${landedIndex}).`);
//   } else {
//     alert(`LOSE. Landed on Item ${landedItem} (Index ${landedIndex}). The winner was Item ${itemsList[winningGoalIndex]}.`);
//   }
// };

return (
    <main>
      <h1>Wheel Picker</h1>

      {/* <WheelSpinner
        range={totalSlices}
        items={itemsList}
        winningIndex={winningGoalIndex}
        onFinish={handleSpinFinished}
      /> */}
      <Basic
        uiStyle="default"
        count={7}
      />
    </main>
  );
}