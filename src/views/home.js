export function renderHome(container, AppState) {
  const content = `
    <h2 class="section-title">Live Dashboard</h2>
    
    <div class="match-banner">
      <div class="match-teams">
        <div class="team">
          <div class="team-logo"><i class="fa-solid fa-flag"></i></div>
          <h3>${AppState.match.teamA}</h3>
        </div>
        <div class="vs">VS</div>
        <div class="team">
          <div class="team-logo" style="color: #facc15;"><i class="fa-brands fa-canadian-maple-leaf"></i></div>
          <h3>${AppState.match.teamB}</h3>
        </div>
      </div>
      <div class="match-score" id="home-score">${AppState.match.score}</div>
      <div class="match-time"><i class="fa-solid fa-circle-play"></i> LIVE</div>
    </div>

    <div class="dashboard-grid">
      <div class="card stat-card">
        <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
        <div class="stat-info">
          <h3>Total Audience</h3>
          <div class="value" id="home-audience">${AppState.match.audience.toLocaleString()}</div>
        </div>
      </div>
      
      <div class="card stat-card" style="cursor: pointer" onclick="document.querySelector('[data-route=stadium]').click()">
        <div class="stat-icon" style="color: var(--warning-color); background: rgba(245,158,11,0.1);"><i class="fa-solid fa-location-arrow"></i></div>
        <div class="stat-info">
          <h3>Stadium Status</h3>
          <div class="value" style="font-size: 20px; margin-top:5px; color: var(--warning-color);">View Map &rarr;</div>
        </div>
      </div>
      
      <div class="card stat-card" style="cursor: pointer" onclick="document.querySelector('[data-route=food]').click()">
        <div class="stat-icon" style="color: var(--success-color); background: rgba(16,185,129,0.1);"><i class="fa-solid fa-pizza-slice"></i></div>
        <div class="stat-info">
          <h3>Active Vendors</h3>
          <div class="value">${AppState.foodVendors.length} Open</div>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = content;

  // React to state changes
  const onUpdate = () => {
    if (document.getElementById('home-audience')) {
      document.getElementById('home-audience').innerText = AppState.match.audience.toLocaleString();
    }
  };
  
  AppState.events.addEventListener('stateChanged', onUpdate);
  
  // Cleanup listener on unmount
  container.onUnmount = () => {
    AppState.events.removeEventListener('stateChanged', onUpdate);
  };
}
