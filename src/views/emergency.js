export function renderEmergency(container, AppState) {
  const content = `
    <div class="emergency-wrapper">
      <div id="initial-emergency">
        <h2 style="font-size:36px; margin-bottom: 12px; color: var(--danger-color)">Emergency Assistance</h2>
        <p style="color: var(--text-secondary); margin-bottom: 40px; font-size: 18px;">If you require immediate help, press the button below.</p>

        <div class="card emergency-form">
          <div class="food-toolbar-group">
            <label for="incident-type">Issue Type</label>
            <select id="incident-type" class="input-control">
              <option value="Medical">Medical</option>
              <option value="Security">Security</option>
              <option value="Fire">Fire</option>
              <option value="Mobility">Mobility Support</option>
            </select>
          </div>
          <div class="food-toolbar-group">
            <label for="seat-reference">Seat / Zone</label>
            <input id="seat-reference" class="input-control" type="text" placeholder="e.g. NorthStand N2" />
          </div>
        </div>

        <button class="sos-button" id="btn-sos">SOS</button>
      </div>

      <div class="emergency-info" id="active-emergency">
        <h2 style="font-size:42px; color: var(--danger-color); margin-bottom: 10px;">
          <i class="fa-solid fa-triangle-exclamation"></i> EMERGENCY ACTIVATED
        </h2>
        <p style="font-size:20px; margin-bottom: 30px;">Authorities have been notified. Please remain calm and follow the exit route below.</p>
        <div class="emergency-meta">
          <span>Incident ID: <strong id="incident-id">-</strong></span>
          <span>Responder ETA: <strong id="responder-eta">3m 00s</strong></span>
          <span>Issue Type: <strong id="incident-type-label">-</strong></span>
        </div>

        <div class="emergency-grid">
          <div class="emergency-card">
            <h3><i class="fa-solid fa-person-running"></i> Nearest Exit Route</h3>
            <p style="margin-bottom: 16px;">Based on live gate load, proceed to <strong id="recommended-gate">${AppState.system.recommendedGate}</strong>.</p>
            <div style="background: rgba(0,0,0,0.5); padding: 10px; border-radius: 8px;">
               <svg viewBox="0 0 200 100" style="width:100%; height:80px">
                  <rect x="0" y="40" width="150" height="20" fill="rgba(255,255,255,0.1)"/>
                  <path d="M 20 50 L 150 50" stroke="var(--danger-color)" stroke-width="4" stroke-dasharray="8" style="animation: dash 5s linear infinite"/>
                  <polygon points="150,45 150,55 160,50" fill="var(--danger-color)"/>
                  <text x="20" y="30" fill="white" font-size="12">You</text>
                  <text x="160" y="30" fill="white" font-size="12">Exit</text>
               </svg>
            </div>
          </div>
          
          <div class="emergency-card">
            <h3><i class="fa-solid fa-phone"></i> Emergency Contacts</h3>
            <ul class="contact-list">
              <li>
                <span>Medical Help</span>
                <a href="tel:+91102001" class="contact-btn">Call Now</a>
              </li>
              <li>
                <span>Stadium Security</span>
                <a href="tel:+91102002" class="contact-btn">Call Now</a>
              </li>
              <li>
                <span>Fire Dept</span>
                <a href="tel:+91102003" class="contact-btn">Call Now</a>
              </li>
            </ul>
          </div>
        </div>
        
        <button class="btn" style="margin-top: 40px; background: transparent; border: 1px solid var(--text-secondary); color: var(--text-secondary)" id="btn-cancel">Cancel Alert</button>
      </div>
    </div>
  `;
  container.innerHTML = content;

  const btnSos = document.getElementById('btn-sos');
  const btnCancel = document.getElementById('btn-cancel');
  const incidentType = document.getElementById('incident-type');
  const seatReference = document.getElementById('seat-reference');
  const incidentId = document.getElementById('incident-id');
  const responderEta = document.getElementById('responder-eta');
  const incidentTypeLabel = document.getElementById('incident-type-label');
  const recommendedGateEl = document.getElementById('recommended-gate');

  const initialView = document.getElementById('initial-emergency');
  const activeView = document.getElementById('active-emergency');
  let etaSeconds = 180;
  let etaTimer = null;

  const formatEta = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${String(secs).padStart(2, '0')}s`;
  };

  btnSos.addEventListener('click', () => {
    const id = `INC-${Math.floor(Math.random() * 9000 + 1000)}`;
    const type = incidentType.value || 'Medical';
    const seat = seatReference.value?.trim();

    initialView.style.display = 'none';
    activeView.classList.add('active');
    document.body.classList.add('emergency-active');
    incidentId.textContent = id;
    incidentTypeLabel.textContent = seat ? `${type} (${seat})` : type;
    if (recommendedGateEl) recommendedGateEl.textContent = AppState.system.recommendedGate;

    etaSeconds = 180;
    responderEta.textContent = formatEta(etaSeconds);
    etaTimer = setInterval(() => {
      etaSeconds = Math.max(0, etaSeconds - 1);
      responderEta.textContent = formatEta(etaSeconds);
      if (etaSeconds === 0) {
        clearInterval(etaTimer);
      }
    }, 1000);
  });

  btnCancel.addEventListener('click', () => {
    activeView.classList.remove('active');
    initialView.style.display = 'block';
    document.body.classList.remove('emergency-active');
    if (etaTimer) clearInterval(etaTimer);
  });

  container.onUnmount = () => {
    if (etaTimer) clearInterval(etaTimer);
    document.body.classList.remove('emergency-active');
  };
}
