// Base award structure (Case 1)
interface BaseAward {
  id: number;
  inventory: number;
  // item?: string;
}

// Award structure that includes 'item' (Case 2)
interface ItemAward extends BaseAward {
  item: string; // The property 'item' is REQUIRED here
}

// The union type for any single item in the data array
type AwardItem = BaseAward | ItemAward;
interface CreateBaseProps {
  data: AwardItem[]; // This array can now safely contain EITHER BaseAward or ItemAward
  count: number;
}

export default function createBase({ data, count }: CreateBaseProps) {

  // This is the fixed, type-safe check:
  const hasItemName = data.length > 0 && 'item' in data[0] && !!(data[0] as ItemAward).item;

  let base: Array<string> = [];

  if (hasItemName) {
    // Narrow the array to ItemAward[] since we've determined items exist on elements
    const itemData = data as ItemAward[];
    for (let i = 0; i < count; i++) {
      // Use a safe fallback so the pushed value is always a string
      base.push(itemData[i]?.item ?? "X");
    }
  } else {
    base = Array(count).fill("");
  }

  return base;
}