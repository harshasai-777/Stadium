export function renderStadium(container, AppState) {
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const getColor = (density) => {
    if (density === 'safe') return 'var(--success-color)';
    if (density === 'medium') return 'var(--warning-color)';
    return 'var(--danger-color)';
  };

  const standLabels = ['NorthStand', 'SouthStand', 'EastPavilion', 'WestPavilion'];
  const gateCoordinates = {
    'Gate 1': { x: 400, y: 30 },
    'Gate 2': { x: 100, y: 300 },
    'Gate 3': { x: 700, y: 300 }
  };

  const seatsPerBlock = 25000;
  const rowsPerBlock = 250;
  const seatsPerRow = 100;
  const totalSeats = seatsPerBlock * 4;

  const seatBlocks = {
    A: {
      zone: 'A',
      section: 'NorthStand',
      innerLeft: { x: 252, y: 186 },
      innerRight: { x: 548, y: 186 },
      outerLeft: { x: 214, y: 142 },
      outerRight: { x: 586, y: 142 }
    },
    B: {
      zone: 'B',
      section: 'EastPavilion',
      innerLeft: { x: 566, y: 202 },
      innerRight: { x: 566, y: 398 },
      outerLeft: { x: 604, y: 162 },
      outerRight: { x: 604, y: 438 }
    },
    C: {
      zone: 'C',
      section: 'SouthStand',
      innerLeft: { x: 548, y: 414 },
      innerRight: { x: 252, y: 414 },
      outerLeft: { x: 586, y: 458 },
      outerRight: { x: 214, y: 458 }
    },
    D: {
      zone: 'D',
      section: 'WestPavilion',
      innerLeft: { x: 234, y: 398 },
      innerRight: { x: 234, y: 202 },
      outerLeft: { x: 196, y: 438 },
      outerRight: { x: 196, y: 162 }
    }
  };

  const content = `
    <h2 class="section-title">Stadium Details</h2>
    <div class="stadium-container">
      <div class="map-area">
        <svg class="svg-map" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#16a34a" stop-opacity="0.3"/>
              <stop offset="70%" stop-color="#15803d" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#14532d" stop-opacity="0.9"/>
            </radialGradient>
            <pattern id="grassStripes" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="20" height="40" fill="#15803d" opacity="0.3"/>
              <rect x="20" width="20" height="40" fill="#16a34a" opacity="0.3"/>
            </pattern>
            <linearGradient id="beamGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="beamGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="beamGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#fef08a" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="beamGrad4" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#fef08a" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000" flood-opacity="0.8"/>
            </filter>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
            <filter id="labelShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#020617" flood-opacity="0.85"/>
            </filter>
            <pattern id="seats" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <circle cx="2" cy="2" r="1.5" fill="rgba(0,0,0,0.1)"/>
            </pattern>
          </defs>

          <ellipse cx="400" cy="300" rx="330" ry="280" fill="#020617" filter="url(#shadow)"/>
          <ellipse cx="400" cy="300" rx="320" ry="270" fill="#1e293b" />
          <ellipse cx="400" cy="300" rx="200" ry="160" fill="url(#fieldGrad)"/>
          <ellipse cx="400" cy="300" rx="200" ry="160" fill="url(#grassStripes)"/>
          <ellipse cx="400" cy="300" rx="200" ry="160" fill="transparent" stroke="#fff" stroke-width="2.5" stroke-dasharray="10,2"/>
          <ellipse cx="400" cy="300" rx="215" ry="175" fill="transparent" stroke="rgba(255,255,255,0.1)" stroke-width="12"/>
          <ellipse cx="400" cy="300" rx="100" ry="80" fill="transparent" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" stroke-dasharray="8,5"/>
          <ellipse cx="400" cy="300" rx="248" ry="198" fill="none" stroke="rgba(226,232,240,0.18)" stroke-width="2"/>
          <ellipse cx="400" cy="300" rx="296" ry="246" fill="none" stroke="rgba(226,232,240,0.14)" stroke-width="2"/>

          <rect x="380" y="260" width="40" height="80" fill="#a16207" opacity="0.6" rx="2"/>
          <rect x="382" y="260" width="36" height="80" fill="#b45309" opacity="0.8" rx="2"/>
          <rect x="390" y="262" width="20" height="76" fill="#fcd34d" opacity="0.3"/>
          <line x1="390" y1="272" x2="410" y2="272" stroke="#fff" stroke-width="1.2"/>
          <line x1="390" y1="264" x2="410" y2="264" stroke="#fff" stroke-width="1.2"/>
          <line x1="390" y1="328" x2="410" y2="328" stroke="#fff" stroke-width="1.2"/>
          <line x1="390" y1="336" x2="410" y2="336" stroke="#fff" stroke-width="1.2"/>
          <line x1="400" y1="265" x2="400" y2="335" stroke="#fef08a" stroke-width="1.5" stroke-dasharray="3,3"/>

          <g transform="translate(340, 115)">
            <rect width="40" height="15" fill="#334155" rx="3" filter="url(#shadow)"/>
            <rect x="2" y="2" width="36" height="11" fill="#475569" rx="2"/>
          </g>
          <g transform="translate(420, 115)">
            <rect width="40" height="15" fill="#334155" rx="3" filter="url(#shadow)"/>
            <rect x="2" y="2" width="36" height="11" fill="#475569" rx="2"/>
          </g>

          <g id="NorthStand" class="map-section" stroke="rgba(255,255,255,0.3)" stroke-width="1">
            <path d="M 250 185 A 220 180 0 0 1 550 185 L 565 170 A 240 195 0 0 0 235 170 Z" />
            <path d="M 250 185 A 220 180 0 0 1 550 185 L 565 170 A 240 195 0 0 0 235 170 Z" fill="url(#seats)" />
            <path d="M 233 166 A 243 198 0 0 1 567 166 L 590 140 A 290 240 0 0 0 210 140 Z" opacity="0.8" />
            <path d="M 233 166 A 243 198 0 0 1 567 166 L 590 140 A 290 240 0 0 0 210 140 Z" fill="url(#seats)" />
          </g>
          <g id="SouthStand" class="map-section" stroke="rgba(255,255,255,0.3)" stroke-width="1">
            <path d="M 550 415 A 220 180 0 0 1 250 415 L 235 430 A 240 195 0 0 0 565 430 Z" />
            <path d="M 550 415 A 220 180 0 0 1 250 415 L 235 430 A 240 195 0 0 0 565 430 Z" fill="url(#seats)" />
            <path d="M 567 434 A 243 198 0 0 1 233 434 L 210 460 A 290 240 0 0 0 590 460 Z" opacity="0.8" />
            <path d="M 567 434 A 243 198 0 0 1 233 434 L 210 460 A 290 240 0 0 0 590 460 Z" fill="url(#seats)" />
          </g>
          <g id="WestPavilion" class="map-section" stroke="rgba(255,255,255,0.3)" stroke-width="1">
            <path d="M 235 200 A 220 180 0 0 0 235 400 L 215 415 A 240 195 0 0 1 215 185 Z" />
            <path d="M 235 200 A 220 180 0 0 0 235 400 L 215 415 A 240 195 0 0 1 215 185 Z" fill="url(#seats)" />
            <path d="M 211 181 A 243 198 0 0 0 211 419 L 195 440 A 290 240 0 0 1 195 160 Z" opacity="0.8" />
            <path d="M 211 181 A 243 198 0 0 0 211 419 L 195 440 A 290 240 0 0 1 195 160 Z" fill="url(#seats)" />
          </g>
          <g id="EastPavilion" class="map-section" stroke="rgba(255,255,255,0.3)" stroke-width="1">
            <path d="M 565 400 A 220 180 0 0 0 565 200 L 585 185 A 240 195 0 0 1 585 415 Z" />
            <path d="M 565 400 A 220 180 0 0 0 565 200 L 585 185 A 240 195 0 0 1 585 415 Z" fill="url(#seats)" />
            <path d="M 589 419 A 243 198 0 0 0 589 181 L 605 160 A 290 240 0 0 1 605 440 Z" opacity="0.8" />
            <path d="M 589 419 A 243 198 0 0 0 589 181 L 605 160 A 290 240 0 0 1 605 440 Z" fill="url(#seats)" />
          </g>
          <g stroke="rgba(226,232,240,0.28)" stroke-width="2" stroke-dasharray="7 6" opacity="0.7">
            <path d="M 400 104 L 400 190"/>
            <path d="M 400 496 L 400 410"/>
            <path d="M 116 300 L 236 300"/>
            <path d="M 564 300 L 684 300"/>
          </g>

          <g class="zone-label" filter="url(#labelShadow)">
            <rect x="347" y="96" width="106" height="30" rx="15" fill="rgba(2,6,23,0.82)" stroke="rgba(125,211,252,0.6)" />
            <text x="400" y="116" fill="#e2e8f0" font-size="15" font-weight="800" text-anchor="middle">BLOCK A</text>
          </g>
          <g class="zone-label" filter="url(#labelShadow)" transform="rotate(90 640 300)">
            <rect x="587" y="285" width="106" height="30" rx="15" fill="rgba(2,6,23,0.82)" stroke="rgba(125,211,252,0.6)" />
            <text x="640" y="305" fill="#e2e8f0" font-size="15" font-weight="800" text-anchor="middle">BLOCK B</text>
          </g>
          <g class="zone-label" filter="url(#labelShadow)">
            <rect x="347" y="474" width="106" height="30" rx="15" fill="rgba(2,6,23,0.82)" stroke="rgba(125,211,252,0.6)" />
            <text x="400" y="494" fill="#e2e8f0" font-size="15" font-weight="800" text-anchor="middle">BLOCK C</text>
          </g>
          <g class="zone-label" filter="url(#labelShadow)" transform="rotate(-90 160 300)">
            <rect x="107" y="285" width="106" height="30" rx="15" fill="rgba(2,6,23,0.82)" stroke="rgba(125,211,252,0.6)" />
            <text x="160" y="305" fill="#e2e8f0" font-size="15" font-weight="800" text-anchor="middle">BLOCK D</text>
          </g>

          <polygon points="120,60 300,160 320,130" fill="url(#beamGrad1)"/>
          <polygon points="680,60 500,160 480,130" fill="url(#beamGrad2)"/>
          <polygon points="120,540 300,440 320,470" fill="url(#beamGrad3)"/>
          <polygon points="680,540 500,440 480,470" fill="url(#beamGrad4)"/>

          <path id="shortest-path" class="path-line" d="" style="display: none;" filter="url(#glow)"/>
          <circle id="seat-finder-pin" cx="0" cy="0" r="8" fill="#38bdf8" stroke="#ffffff" stroke-width="2" style="display: none;" />
          <text id="seat-finder-label" x="0" y="0" fill="#f8fafc" font-size="11" text-anchor="middle" style="display: none;">Seat</text>

          <g transform="translate(400, 30)">
            <rect class="gate-marker" x="-35" y="-14" width="70" height="28" rx="14" filter="url(#shadow)"/>
            <circle cx="-20" cy="0" r="4" fill="#3b82f6" />
            <text x="5" y="4" font-size="12" font-weight="bold" fill="white" text-anchor="middle">Gate 1</text>
          </g>
          <g transform="translate(100, 300)">
            <rect class="gate-marker" x="-35" y="-14" width="70" height="28" rx="14" filter="url(#shadow)"/>
            <circle cx="-20" cy="0" r="4" fill="#3b82f6" />
            <text x="5" y="4" font-size="12" font-weight="bold" fill="white" text-anchor="middle">Gate 2</text>
          </g>
          <g transform="translate(700, 300)">
            <rect class="gate-marker" x="-35" y="-14" width="70" height="28" rx="14" filter="url(#shadow)"/>
            <circle cx="-20" cy="0" r="4" fill="#3b82f6" />
            <text x="5" y="4" font-size="12" font-weight="bold" fill="white" text-anchor="middle">Gate 3</text>
          </g>
        </svg>

        <div class="map-controls">
          <button class="map-btn" title="Zoom In"><i class="fa-solid fa-plus"></i></button>
          <button class="map-btn" title="Zoom Out"><i class="fa-solid fa-minus"></i></button>
          <span id="map-zoom-label">100%</span>
        </div>

        <div class="info-panel panel-finder floating-finder">
          <h3>Seat Finder (1,00,000 seats)</h3>
          <p class="map-route-hint">Format: <strong>A-1</strong> to <strong>D-25000</strong>.</p>
          <div class="seat-finder-form">
            <input id="seat-input" class="input-control" placeholder="Example: B-10457" />
            <button id="seat-locate-btn" class="btn" type="button"><i class="fa-solid fa-location-crosshairs"></i> Locate</button>
          </div>
          <div class="seat-chip-row">
            <button type="button" class="seat-chip" data-seat-sample="A-48">A-48</button>
            <button type="button" class="seat-chip" data-seat-sample="B-10457">B-10457</button>
            <button type="button" class="seat-chip" data-seat-sample="C-8732">C-8732</button>
            <button type="button" class="seat-chip" data-seat-sample="D-23999">D-23999</button>
          </div>
          <p id="map-route-info" class="map-route-hint">Enter your seat number to get nearest gate and route.</p>
          <div id="seat-finder-result" class="seat-finder-result"></div>
        </div>
      </div>

      <div class="map-sidebar">
        <div class="info-panel panel-ops">
          <h3>Operational Snapshot</h3>
          <div class="health-item">
            <span class="metric-label">Congestion Index</span>
            <strong class="metric-value" id="stadium-congestion">${AppState.system.congestionIndex}/100</strong>
          </div>
          <div class="health-item">
            <span class="metric-label">Recommended Gate</span>
            <strong class="metric-value" id="stadium-best-gate">${AppState.system.recommendedGate}</strong>
          </div>
          <div class="health-item">
            <span class="metric-label">Last Refresh</span>
            <strong class="metric-value" id="stadium-updated-at">${AppState.system.lastUpdated}</strong>
          </div>
        </div>

        <div class="info-panel panel-inventory">
          <h3>Seating Inventory</h3>
          <div id="seat-capacity-stats"></div>
        </div>

        <div class="info-panel panel-live" id="section-stats">
          <h3>Live Section Stats</h3>
          <div id="stats-render"></div>
        </div>

        <div class="info-panel panel-gates" id="gate-details">
          <h3>Gate Details</h3>
          <div id="gate-stats-render"></div>
        </div>

      </div>
    </div>
  `;

  container.innerHTML = content;

  let selectedSection = 'NorthStand';
  let activeSeatLookup = null;

  const pathLine = document.getElementById('shortest-path');
  const routeInfo = document.getElementById('map-route-info');
  const finderPin = document.getElementById('seat-finder-pin');
  const finderLabel = document.getElementById('seat-finder-label');
  const seatResult = document.getElementById('seat-finder-result');
  const seatInput = document.getElementById('seat-input');
  const locateBtn = document.getElementById('seat-locate-btn');

  const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
  const nearestGate = (coords) => {
    return Object.entries(gateCoordinates)
      .sort((a, b) => distance(coords.x, coords.y, a[1].x, a[1].y) - distance(coords.x, coords.y, b[1].x, b[1].y))[0][0];
  };

  const highlightSection = (sectionName) => {
    standLabels.forEach((stand) => {
      const standElement = document.getElementById(stand);
      if (!standElement) return;
      standElement.classList.toggle('map-section-focus', stand === sectionName);
    });
  };

  const drawRoute = (gateName, seatCoords, seatCode) => {
    const gate = gateCoordinates[gateName];
    if (!gate || !seatCoords || !pathLine) return;
    const pathData = `M ${gate.x} ${gate.y} Q ${(gate.x + seatCoords.x) / 2} ${gate.y} ${seatCoords.x} ${seatCoords.y}`;
    pathLine.setAttribute('d', pathData);
    pathLine.style.display = 'block';

    if (finderPin && finderLabel) {
      finderPin.setAttribute('cx', seatCoords.x);
      finderPin.setAttribute('cy', seatCoords.y);
      finderPin.style.display = 'block';
      finderLabel.setAttribute('x', seatCoords.x);
      finderLabel.setAttribute('y', seatCoords.y - 12);
      finderLabel.textContent = seatCode;
      finderLabel.style.display = 'block';
    }
  };

  const parseSeatCode = (rawValue) => {
    const normalized = (rawValue || '').toUpperCase().replace(/\s+/g, '');
    const match = normalized.match(/^([ABCD])[-]?(\d{1,5})$/);
    if (!match) return null;
    const block = match[1];
    const serial = Number(match[2]);
    if (!seatBlocks[block] || serial < 1 || serial > seatsPerBlock) return null;
    return { block, serial };
  };

  const seatToCoordinates = (blockKey, serial) => {
    const block = seatBlocks[blockKey];
    const row = Math.ceil(serial / seatsPerRow);
    const seatInRow = ((serial - 1) % seatsPerRow) + 1;
    const rowNorm = (row - 1) / (rowsPerBlock - 1);
    const seatNorm = (seatInRow - 1) / (seatsPerRow - 1);
    const lerp = (a, b, t) => a + (b - a) * t;

    // Bilinear interpolation between inner and outer stand edges.
    // This keeps seats inside the rendered stand surfaces.
    const innerX = lerp(block.innerLeft.x, block.innerRight.x, seatNorm);
    const innerY = lerp(block.innerLeft.y, block.innerRight.y, seatNorm);
    const outerX = lerp(block.outerLeft.x, block.outerRight.x, seatNorm);
    const outerY = lerp(block.outerLeft.y, block.outerRight.y, seatNorm);

    const x = lerp(innerX, outerX, rowNorm);
    const y = lerp(innerY, outerY, rowNorm);

    // Safety correction: never allow seat pins inside the field/ground ellipse.
    const cx = 400;
    const cy = 300;
    const noSeatRx = 230;
    const noSeatRy = 182;
    let dx = x - cx;
    let dy = y - cy;
    let px = x;
    let py = y;
    const insideGround = ((dx * dx) / (noSeatRx * noSeatRx)) + ((dy * dy) / (noSeatRy * noSeatRy)) < 1;

    if (insideGround) {
      if (dx === 0 && dy === 0) {
        if (blockKey === 'A') dy = -1;
        else if (blockKey === 'C') dy = 1;
        else if (blockKey === 'B') dx = 1;
        else dx = -1;
      }

      const ellipseFactor = ((dx * dx) / (noSeatRx * noSeatRx)) + ((dy * dy) / (noSeatRy * noSeatRy));
      const pushScale = Math.sqrt(1.08 / Math.max(ellipseFactor, 0.0001));
      px = cx + dx * pushScale;
      py = cy + dy * pushScale;
    }

    return {
      x: clamp(px, 188, 612),
      y: clamp(py, 134, 466),
      row,
      seatInRow
    };
  };

  const renderCapacityStats = () => {
    const capacityHost = document.getElementById('seat-capacity-stats');
    if (!capacityHost) return;
    capacityHost.innerHTML = `
      <div class="stat-row"><span class="metric-label">Total Seats</span><strong class="metric-value">${totalSeats.toLocaleString()}</strong></div>
      <div class="stat-row"><span class="metric-label">Seat Blocks</span><strong class="metric-value">4 (A-D)</strong></div>
      <div class="stat-row"><span class="metric-label">Seats / Block</span><strong class="metric-value">${seatsPerBlock.toLocaleString()}</strong></div>
      <div class="stat-row"><span class="metric-label">Rows / Block</span><strong class="metric-value">${rowsPerBlock}</strong></div>
    `;
  };

  const renderSelectedSection = () => {
    highlightSection(selectedSection);
  };

  const renderSeatLookup = (lookup, isError = false) => {
    if (!seatResult) return;
    if (isError) {
      seatResult.innerHTML = `<div class="seat-error">Invalid seat. Use A-1 to D-25000.</div>`;
      return;
    }
    if (!lookup) {
      seatResult.innerHTML = '';
      return;
    }
    const gateKey = lookup.gate.replace(' ', '');
    const gateQueue = AppState.stadium.gates[gateKey]?.crowd ?? '-';
    seatResult.innerHTML = `
      <div class="seat-result-row"><span>Seat</span><strong>${lookup.seatCode}</strong></div>
      <div class="seat-result-row"><span>Zone / Block</span><strong>${lookup.zone} / ${lookup.block}</strong></div>
      <div class="seat-result-row"><span>Section</span><strong>${lookup.section}</strong></div>
      <div class="seat-result-row"><span>Row / Seat</span><strong>R${lookup.row} / S${lookup.seatInRow}</strong></div>
      <div class="seat-result-row"><span>Nearest Gate</span><strong>${lookup.gate}</strong></div>
      <div class="seat-result-row"><span>Live Queue</span><strong>${gateQueue} people</strong></div>
    `;
  };

  const locateSeat = (inputValue) => {
    const parsed = parseSeatCode(inputValue);
    if (!parsed) {
      activeSeatLookup = null;
      renderSeatLookup(null, true);
      if (routeInfo) routeInfo.textContent = 'Seat not recognized. Please check format.';
      return;
    }

    const details = seatToCoordinates(parsed.block, parsed.serial);
    const block = seatBlocks[parsed.block];
    const gate = nearestGate(details);
    const seatCode = `${parsed.block}-${parsed.serial}`;

    activeSeatLookup = {
      seatCode,
      block: parsed.block,
      zone: block.zone,
      section: block.section,
      row: details.row,
      seatInRow: details.seatInRow,
      gate,
      coords: { x: details.x, y: details.y }
    };

    selectedSection = block.section;
    renderSelectedSection();
    drawRoute(gate, activeSeatLookup.coords, seatCode);
    renderSeatLookup(activeSeatLookup);
    if (routeInfo) routeInfo.textContent = `Seat ${seatCode} located. Recommended entry via ${gate}.`;
  };

  const updateMapVisuals = () => {
    standLabels.forEach((stand) => {
      const element = document.getElementById(stand);
      if (element && AppState.stadium.sections[stand]) {
        element.setAttribute('fill', getColor(AppState.stadium.sections[stand].density));
      }
    });

    const statsContainer = document.getElementById('stats-render');
    const gateStatsContainer = document.getElementById('gate-stats-render');
    if (statsContainer) {
      let html = '';
      for (const stand in AppState.stadium.sections) {
        const density = AppState.stadium.sections[stand].density;
        html += `<div class="stat-row"><span>${stand}</span><span class="badge ${density}">${AppState.stadium.sections[stand].count.toLocaleString()} / ${density}</span></div>`;
      }
      statsContainer.innerHTML = html;
    }

    if (gateStatsContainer) {
      const recommended = AppState.system.recommendedGate.replace(' ', '');
      let gateHtml = '';
      for (const gate in AppState.stadium.gates) {
        const people = AppState.stadium.gates[gate].crowd;
        const normalized = gate.replace('Gate', 'Gate ');
        const isRecommended = gate === recommended;
        const status = people > 180 ? 'High' : people > 80 ? 'Moderate' : 'Smooth';
        gateHtml += `
          <div class="stat-row">
            <span>${normalized}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <strong>${people}</strong>
              <span class="badge ${people > 180 ? 'crowded' : people > 80 ? 'medium' : 'safe'}">${status}${isRecommended ? ' ★' : ''}</span>
            </div>
          </div>
        `;
      }
      gateStatsContainer.innerHTML = gateHtml;
    }

    const congestionEl = document.getElementById('stadium-congestion');
    const gateEl = document.getElementById('stadium-best-gate');
    const updateEl = document.getElementById('stadium-updated-at');
    if (congestionEl) congestionEl.textContent = `${AppState.system.congestionIndex}/100`;
    if (gateEl) gateEl.textContent = AppState.system.recommendedGate;
    if (updateEl) updateEl.textContent = AppState.system.lastUpdated;

    renderSelectedSection();
    renderSeatLookup(activeSeatLookup);
  };

  renderCapacityStats();
  updateMapVisuals();

  AppState.events.addEventListener('stateChanged', updateMapVisuals);
  container.onUnmount = () => {
    AppState.events.removeEventListener('stateChanged', updateMapVisuals);
  };

  standLabels.forEach((stand) => {
    const standElement = document.getElementById(stand);
    if (!standElement) return;
    standElement.addEventListener('click', () => {
      selectedSection = stand;
      renderSelectedSection();
    });
  });

  if (locateBtn && seatInput) {
    locateBtn.addEventListener('click', () => locateSeat(seatInput.value));
    seatInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        locateSeat(seatInput.value);
      }
    });
  }

  document.querySelectorAll('[data-seat-sample]').forEach((chip) => {
    chip.addEventListener('click', (event) => {
      const value = event.currentTarget.dataset.seatSample;
      if (seatInput) seatInput.value = value;
      locateSeat(value);
    });
  });

  let scale = 1;
  const mapSvg = document.querySelector('.svg-map');
  const btns = document.querySelectorAll('.map-btn');
  const zoomLabel = document.getElementById('map-zoom-label');
  if (btns.length === 2) {
    btns[0].onclick = () => {
      scale = Math.min(1.8, scale + 0.2);
      mapSvg.style.transform = `scale(${scale})`;
      if (zoomLabel) zoomLabel.textContent = `${Math.round(scale * 100)}%`;
    };
    btns[1].onclick = () => {
      scale = Math.max(0.5, scale - 0.2);
      mapSvg.style.transform = `scale(${scale})`;
      if (zoomLabel) zoomLabel.textContent = `${Math.round(scale * 100)}%`;
    };
  }
}
