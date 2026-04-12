export function renderStadium(container, AppState) {
  // Helpers
  const getColor = (density) => {
    if (density === 'safe') return 'var(--success-color)';
    if (density === 'medium') return 'var(--warning-color)';
    return 'var(--danger-color)';
  };

  const content = `
    <h2 class="section-title">Stadium Details</h2>
    <div class="stadium-container">
      
      <div class="map-area">
        <svg class="svg-map" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
          <!-- Field -->
          <rect x="250" y="150" width="300" height="300" rx="150" fill="#22c55e" opacity="0.3" stroke="#fff" stroke-width="2"/>
          <rect x="350" y="250" width="100" height="100" fill="#ccb681" opacity="0.8"/> <!-- Pitch -->
          
          <!-- Stands -->
          <path id="NorthStand" class="map-section" d="M 250 130 C 400 50, 550 130, 550 130 L 400 150 Z" />
          <path id="SouthStand" class="map-section" d="M 250 470 C 400 550, 550 470, 550 470 L 400 450 Z" />
          <path id="WestPavilion" class="map-section" d="M 230 160 C 150 300, 230 440, 230 440 L 250 300 Z" />
          <path id="EastPavilion" class="map-section" d="M 570 160 C 650 300, 570 440, 570 440 L 550 300 Z" />

          <!-- Dynamic Path (Initially hidden) -->
          <path id="shortest-path" class="path-line" d="" style="display: none;"/>

          <!-- Gates / Entrances -->
          <g transform="translate(400, 50)">
            <rect class="gate-marker" x="-20" y="-10" width="40" height="20" rx="4"/>
            <text x="0" y="4" font-size="10" fill="white" text-anchor="middle">Gate 1</text>
          </g>
          <g transform="translate(150, 300)">
            <rect class="gate-marker" x="-20" y="-10" width="40" height="20" rx="4"/>
            <text x="0" y="4" font-size="10" fill="white" text-anchor="middle">Gate 2</text>
          </g>
          <g transform="translate(650, 300)">
            <rect class="gate-marker" x="-20" y="-10" width="40" height="20" rx="4"/>
            <text x="0" y="4" font-size="10" fill="white" text-anchor="middle">Gate 3</text>
          </g>

          <!-- Selectable Seats (mock) -->
          <circle class="seat-point" cx="300" cy="110" r="4" data-seat="N1" data-x="300" data-y="110" data-gate="400,50"/>
          <circle class="seat-point" cx="350" cy="110" r="4" data-seat="N2" data-x="350" data-y="110" data-gate="400,50"/>
          <circle class="seat-point" cx="300" cy="490" r="4" data-seat="S1" data-x="300" data-y="490" data-gate="650,300"/>
          <circle class="seat-point" cx="200" cy="300" r="4" data-seat="W1" data-x="200" data-y="300" data-gate="150,300"/>
          
          <!-- POI -->
          <rect class="fire-marker" x="480" y="100" width="10" height="10" rx="2" title="Fire Extinguisher"/>
          <circle class="staff-marker" cx="260" cy="280" r="6" title="Security Staff"/>
        </svg>

        <div class="map-controls">
          <button class="map-btn" title="Zoom In"><i class="fa-solid fa-plus"></i></button>
          <button class="map-btn" title="Zoom Out"><i class="fa-solid fa-minus"></i></button>
        </div>
      </div>

      <div class="map-sidebar">
        <div class="info-panel">
          <h3>Crowd Density Key</h3>
          <div class="legend-item">
            <div class="legend-color" style="background: var(--danger-color)"></div>
            <span>Crowded (High Delay)</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: var(--warning-color)"></div>
            <span>Medium Volume</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: var(--success-color)"></div>
            <span>Free / Safe</span>
          </div>
        </div>

        <div class="info-panel" id="section-stats">
          <h3>Live Section Stats</h3>
          <div id="stats-render"></div>
        </div>
      </div>

    </div>
  `;
  container.innerHTML = content;

  // Visual Update Logic
  const updateMapVisuals = () => {
    // Colors for stands
    const stands = ['NorthStand', 'SouthStand', 'EastPavilion', 'WestPavilion'];
    stands.forEach(stand => {
      const el = document.getElementById(stand);
      if (el && AppState.stadium.sections[stand]) {
        el.setAttribute('fill', getColor(AppState.stadium.sections[stand].density));
      }
    });

    // Sidebar text updating
    const statsContainer = document.getElementById('stats-render');
    if (statsContainer) {
      let html = '';
      for(let stand in AppState.stadium.sections) {
        let density = AppState.stadium.sections[stand].density;
        html += `
          <div class="stat-row">
            <span>${stand}</span>
            <span class="badge ${density}">${AppState.stadium.sections[stand].count} / ${density}</span>
          </div>
        `;
      }
      for(let gate in AppState.stadium.gates) {
        html += `
          <div class="stat-row" style="background: rgba(255,255,255,0.05); margin-top: 5px;">
            <span>${gate} Queue</span>
            <span>${AppState.stadium.gates[gate].crowd} people</span>
          </div>
        `;
      }
      statsContainer.innerHTML = html;
    }
  };

  updateMapVisuals();

  // AppState binding
  AppState.events.addEventListener('stateChanged', updateMapVisuals);
  container.onUnmount = () => {
    AppState.events.removeEventListener('stateChanged', updateMapVisuals);
  };

  // Interactions
  const pathLine = document.getElementById('shortest-path');
  
  // Seat click > draw path
  document.querySelectorAll('.seat-point').forEach(seat => {
    seat.addEventListener('click', (e) => {
      const gx = e.target.dataset.gate.split(',')[0];
      const gy = e.target.dataset.gate.split(',')[1];
      const sx = e.target.dataset.x;
      const sy = e.target.dataset.y;
      
      // Draw bezier curve from gate to seat
      const pathData = `M ${gx} ${gy} Q ${(parseInt(gx)+parseInt(sx))/2} ${gy} ${sx} ${sy}`;
      pathLine.setAttribute('d', pathData);
      pathLine.style.display = 'block';
    });
  });

  // Map Controls (Dummy zoom)
  let scale = 1;
  const mapSvg = document.querySelector('.svg-map');
  const btns = document.querySelectorAll('.map-btn');
  if(btns.length === 2) {
    btns[0].onclick = () => { scale += 0.2; mapSvg.style.transform = `scale(${scale})`; };
    btns[1].onclick = () => { scale = Math.max(0.5, scale - 0.2); mapSvg.style.transform = `scale(${scale})`; };
  }
}
