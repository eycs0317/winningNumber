export function getItemClass(isAvailable: boolean, isSelected: boolean, singleGiftMode: boolean | undefined) {
  const base =
    "max-w-md text-xl p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 shadow-md";

  const availableClass =
    singleGiftMode && isAvailable
      ? "bg-green-500 text-white font-bold"
      : "bg-gray-200 hover:bg-gray-300 text-gray-800";

  const selectedClass = isSelected ? "animate-pulse ring-6 ring-red-400" : "";

  return [base, availableClass, selectedClass].join(" ");
}
