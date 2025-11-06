const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vROSqo1Tg3-HApC2pf4mywKRJMzDavUXjmL28d_kID3Mxnhx2aGDFZszsHrOhCcJUa5C0lrNN-MLmrH/pub?output=csv";

function updateLeaderboard() {
  // Add a timestamp to avoid caching
  const urlWithCacheBust = csvURL + "&t=" + new Date().getTime();

  fetch(urlWithCacheBust)
    .then(response => response.text())
    .then(csvText => {
      const rows = csvText.trim().split('\n').slice(1); // skip header
      const leaderboard = rows.map(row => {
        const cols = row.split(',');
        return { 
          name: cols[0].trim(),         
          points: parseInt(cols[1].trim(), 10)
        };
      });

      leaderboard.sort((a, b) => b.points - a.points); // highest points first

      const tbody = document.querySelector('#leaderboard tbody');
      tbody.innerHTML = ""; // clear old rows

      leaderboard.forEach((student, index) => {
        const row = document.createElement('tr');

        // Highlight top 3
        let bgColor = "";
        if(index === 0) bgColor = "gold";
        else if(index === 1) bgColor = "silver";
        else if(index === 2) bgColor = "#cd7f32";

        row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.points}</td>
          <td class="rank">${index + 1}</td>
        `;

        if(bgColor) {
          row.style.backgroundColor = bgColor;
          row.style.color = "#000";
          row.style.fontWeight = "bold";
        }

        tbody.appendChild(row);
      });
    })
    .catch(err => console.error("Error fetching leaderboard:", err));
}

// Initial load
updateLeaderboard();

// Refresh every 3 seconds
setInterval(updateLeaderboard, 3000);
