export async function drawAward(shuffledAwards: any[]) {
  const res = await fetch("/api/draw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shuffledAwards }),
  });

  return res.json();
}
