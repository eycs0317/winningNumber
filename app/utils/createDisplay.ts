
export function createDisplay(count: number) {
  const displayArray: number[] = Array.from({ length: count }, (_, index) => index);
    for(let i = displayArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = displayArray[i];
      displayArray[i] = displayArray[j];
      displayArray[j] = temp;
    }
  return displayArray
}