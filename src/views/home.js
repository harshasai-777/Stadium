export function renderHome(container, AppState) {
  const flagByTeam = {
    India: 'https://flagcdn.com/w80/in.png',
    Australia: 'https://flagcdn.com/w80/au.png',
    England: 'https://flagcdn.com/w80/gb-eng.png',
    Pakistan: 'https://flagcdn.com/w80/pk.png',
    'South Africa': 'https://flagcdn.com/w80/za.png',
    'New Zealand': 'https://flagcdn.com/w80/nz.png',
    SriLanka: 'https://flagcdn.com/w80/lk.png',
    Bangladesh: 'https://flagcdn.com/w80/bd.png',
    Afghanistan: 'https://flagcdn.com/w80/af.png'
  };
  const teamFlag = (teamName) => flagByTeam[teamName] || 'https://flagcdn.com/w80/un.png';

  const content = `
    <div class="ops-strip">
      <div class="ops-item">
        <span class="ops-label">Last Updated</span>
        <strong id="ops-updated">${AppState.system.lastUpdated}</strong>
      </div>
      <div class="ops-item">
        <span class="ops-label">Congestion Index</span>
        <strong id="ops-congestion">${AppState.system.congestionIndex}/100</strong>
      </div>
      <div class="ops-item">
        <span class="ops-label">Recommended Gate</span>
        <strong id="ops-gate">${AppState.system.recommendedGate}</strong>
      </div>
      <div class="ops-item">
        <span class="ops-label">Connectivity</span>
        <strong class="text-success">Stable</strong>
      </div>
    </div>

    <h2 class="section-title">Live Dashboard</h2>
    <div class="match-banner">
      <div class="match-teams">
        <div class="team">
          <div class="team-logo" aria-label="${AppState.match.teamA} flag">
            <img src="${teamFlag(AppState.match.teamA)}" alt="${AppState.match.teamA} flag" />
          </div>
        </div>
        <div class="vs">VS</div>
        <div class="team">
          <div class="team-logo" aria-label="${AppState.match.teamB} flag">
            <img src="${teamFlag(AppState.match.teamB)}" alt="${AppState.match.teamB} flag" />
          </div>
        </div>
      </div>
      <div class="match-score" id="home-score">${AppState.match.score}</div>
      <div class="match-time"><i class="fa-solid fa-circle-play"></i> LIVE</div>
      <div class="occupancy-wrap">
        <div class="occupancy-label-row">
          <span>Venue occupancy</span>
          <strong id="home-occupancy-percent">0%</strong>
        </div>
        <div class="occupancy-bar">
          <div id="home-occupancy-fill"></div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card stat-card">
        <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
        <div class="stat-info">
          <h3>Total Audience</h3>
          <div class="value" id="home-audience">${AppState.match.audience.toLocaleString()}</div>
        </div>
      </div>

      <button class="card stat-card quick-nav-card" data-quick-route="stadium" type="button">
        <div class="stat-icon" style="color: var(--warning-color); background: rgba(245,158,11,0.1);"><i class="fa-solid fa-location-arrow"></i></div>
        <div class="stat-info">
          <h3>Stadium Status</h3>
          <div class="value quick-value">View Map</div>
        </div>
      </button>

      <button class="card stat-card quick-nav-card" data-quick-route="food" type="button">
        <div class="stat-icon" style="color: var(--success-color); background: rgba(16,185,129,0.1);"><i class="fa-solid fa-pizza-slice"></i></div>
        <div class="stat-info">
          <h3>Active Vendors</h3>
          <div class="value" id="home-open-vendors">${AppState.foodVendors.length} Open</div>
        </div>
      </button>
    </div>

    <div class="insight-grid">
      <section class="card">
        <h3 class="panel-title"><i class="fa-solid fa-bell"></i> Live Alerts</h3>
        <div id="home-alert-list" class="alert-feed"></div>
      </section>
      <section class="card">
        <h3 class="panel-title"><i class="fa-solid fa-chart-line"></i> Venue Health</h3>
        <div class="health-item">
          <span>Average Gate Queue</span>
          <strong id="home-gate-average">-</strong>
        </div>
        <div class="health-item">
          <span>Fastest Vendor</span>
          <strong id="home-fastest-vendor">-</strong>
        </div>
        <div class="health-item">
          <span>Crowded Sections</span>
          <strong id="home-crowded-sections">-</strong>
        </div>
      </section>
    </div>
  `;
  container.innerHTML = content;

  const updateHealthCards = () => {
    const gateValues = Object.values(AppState.stadium.gates).map((gate) => gate.crowd);
    const gateAverage = Math.round(gateValues.reduce((acc, value) => acc + value, 0) / gateValues.length);
    const crowdedSections = Object.values(AppState.stadium.sections).filter((section) => section.density === 'crowded').length;
    const fastestVendor = [...AppState.foodVendors].sort((a, b) => a.waitTime - b.waitTime)[0];

    const gateAverageEl = document.getElementById('home-gate-average');
    const fastestVendorEl = document.getElementById('home-fastest-vendor');
    const crowdedSectionsEl = document.getElementById('home-crowded-sections');
    if (gateAverageEl) gateAverageEl.textContent = `${gateAverage} people`;
    if (fastestVendorEl) fastestVendorEl.textContent = `${fastestVendor.name} (${fastestVendor.waitTime}m)`;
    if (crowdedSectionsEl) crowdedSectionsEl.textContent = `${crowdedSections} section(s)`;
  };

  const renderAlerts = () => {
    const alertContainer = document.getElementById('home-alert-list');
    if (!alertContainer) return;

    alertContainer.innerHTML = AppState.alerts.slice(0, 4).map((alert) => `
      <div class="alert-item ${alert.level === 'warning' ? 'alert-warning' : 'alert-info'}">
        <div>
          <div class="alert-text">${alert.message}</div>
          <small>${alert.time}</small>
        </div>
      </div>
    `).join('');
  };

  const updateOccupancy = () => {
    const percent = Math.round((AppState.match.audience / AppState.match.maxAudience) * 100);
    const occupancyPercent = document.getElementById('home-occupancy-percent');
    const occupancyFill = document.getElementById('home-occupancy-fill');

    if (occupancyPercent) occupancyPercent.textContent = `${percent}%`;
    if (occupancyFill) occupancyFill.style.width = `${percent}%`;
  };

  const onUpdate = () => {
    const audienceEl = document.getElementById('home-audience');
    const scoreEl = document.getElementById('home-score');
    const updatedEl = document.getElementById('ops-updated');
    const congestionEl = document.getElementById('ops-congestion');
    const gateEl = document.getElementById('ops-gate');
    const openVendorsEl = document.getElementById('home-open-vendors');

    if (audienceEl) audienceEl.textContent = AppState.match.audience.toLocaleString();
    if (scoreEl) scoreEl.textContent = AppState.match.score;
    if (updatedEl) updatedEl.textContent = AppState.system.lastUpdated;
    if (congestionEl) congestionEl.textContent = `${AppState.system.congestionIndex}/100`;
    if (gateEl) gateEl.textContent = AppState.system.recommendedGate;
    if (openVendorsEl) openVendorsEl.textContent = `${AppState.foodVendors.length} Open`;

    updateOccupancy();
    updateHealthCards();
    renderAlerts();
  };

  container.querySelectorAll('[data-quick-route]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const route = event.currentTarget.dataset.quickRoute;
      const navTarget = document.querySelector(`.nav-link[data-route="${route}"]`);
      if (navTarget) navTarget.click();
    });
  });

  onUpdate();
  AppState.events.addEventListener('stateChanged', onUpdate);

  container.onUnmount = () => {
    AppState.events.removeEventListener('stateChanged', onUpdate);
  };
}
