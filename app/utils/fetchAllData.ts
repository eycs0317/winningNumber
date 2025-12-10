export async function fetchAllData(uid : string) {
      try {
      const response = await fetch('/api/getData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid }),
      });
      const data = await response.json();
      return data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
}