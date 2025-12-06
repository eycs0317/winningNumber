'use client';
// app/page.tsx (Example Usage)
// import WheelPicker from "./components/WheelPicker";
// import RouletteWheel from "./components/RouleeteWheel";
import WheelSpinner from "./components/WheelSpinner";
// import WheelSpinner01 from "./components/WheelSpinner01";
// ... sampleItems remains the same ...
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
        uiStyle="default"
        count={3}
      />
    </main>
  );
}