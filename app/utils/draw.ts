export async function drawAward(shuffledAwards: any[], jsonFileName: string) {
  console.log('drawAward json:', jsonFileName);
  const res = await fetch("/api/draw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shuffledAwards, jsonFileName }),
  });

  return res.json();
}
