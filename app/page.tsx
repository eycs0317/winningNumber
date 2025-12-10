'use client';

// import WheelSpinner from "./components/WheelSpinner";

import Basic from "./components/Basic";


export default function HomePage() {


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
        // count={4}
        // uid={"dummyData01"}
      />
    </main>
  );
}