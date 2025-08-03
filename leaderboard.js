window.addEventListener("DOMContentLoaded", () => {
  const leaderboard = document.getElementById("leaderboard");
  const stats = document.getElementById("stats");

  let allScores = JSON.parse(localStorage.getItem("scoreHistory") || "[]");

  const latest = localStorage.getItem("latestResult");
  if (latest) {
    const grossMatch = latest.match(/Gross WPM:<\/strong> (\d+)/);
    const netMatch = latest.match(/Net WPM:<\/strong> (\d+)/);
    const timeMatch = latest.match(/Time:<\/strong> (\d+)/);

    if (grossMatch && netMatch && timeMatch) {
      const entry = {
        time: new Date().toLocaleString(),
        gross: parseInt(grossMatch[1]),
        net: parseInt(netMatch[1]),
        duration: parseInt(timeMatch[1])
      };

      allScores.push(entry);
      if (allScores.length > 10) allScores.shift(); // Keep only last 10 scores
      localStorage.setItem("scoreHistory", JSON.stringify(allScores));
    }
  }

  if (leaderboard) {
    leaderboard.innerHTML = "<h3>Leaderboard (Last 10)</h3><ul>" +
      allScores
        .sort((a, b) => b.net - a.net)
        .map(s => `<li>${s.time} - Net WPM: ${s.net}</li>`)
        .join("") +
      "</ul>";
  }

  if (stats) {
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length || 0;
    const avgGross = Math.round(avg(allScores.map(s => s.gross)));
    const avgNet = Math.round(avg(allScores.map(s => s.net)));

    stats.innerHTML = `
      <h3>Stats</h3>
      <p><strong>Average Gross WPM:</strong> ${avgGross}</p>
      <p><strong>Average Net WPM:</strong> ${avgNet}</p>
    `;
  }
});
