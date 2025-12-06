export function transformAwards(data: any[], count: number) {
  const firstIndexItem = !data[0]?.item; // detect single gift mode

  const items = Array.from({ length: count }, (_, index) => {
    const a = data[index];
    let label = "";
    let isDummy = false;

    if (firstIndexItem) {
      // Case 1: numbered mode
      label = `${index + 1}`;
      isDummy = index !== 0;
    } else if (a?.item) {
      // Case 2: item mode (with name)
      label = a.item;
      isDummy = false;
    } else {
      // Case 3: "X" mode
      label = "X";
      isDummy = true;
    }

    return {
      id: a?.id ?? index + 1,
      text: label,
      isAvailable: (a?.inventory ?? 0) > 0,
      isDummy,
    };
  });

  return {
    items,
    singleGiftMode: firstIndexItem,
  };
}
