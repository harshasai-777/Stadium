export function renderEmergency(container, AppState) {
  const content = `
    <div class="emergency-wrapper">
      <div id="initial-emergency">
        <h2 style="font-size:36px; margin-bottom: 12px; color: var(--danger-color)">Emergency Assistance</h2>
        <p style="color: var(--text-secondary); margin-bottom: 40px; font-size: 18px;">If you require immediate help, press the button below.</p>
        
        <button class="sos-button" id="btn-sos">SOS</button>
      </div>

      <div class="emergency-info" id="active-emergency">
        <h2 style="font-size:42px; color: var(--danger-color); margin-bottom: 10px;">
          <i class="fa-solid fa-triangle-exclamation"></i> EMERGENCY ACTIVATED
        </h2>
        <p style="font-size:20px; margin-bottom: 30px;">Authorities have been notified. Please remain calm and follow the exit route below.</p>
        
        <div class="emergency-grid">
          <div class="emergency-card">
            <h3><i class="fa-solid fa-person-running"></i> Nearest Exit Route</h3>
            <p style="margin-bottom: 16px;">Based on your location, proceed to <strong>Gate 2</strong>.</p>
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
                <a href="#" class="contact-btn">Call Now</a>
              </li>
              <li>
                <span>Stadium Security</span>
                <a href="#" class="contact-btn">Call Now</a>
              </li>
              <li>
                <span>Fire Dept</span>
                <a href="#" class="contact-btn">Call Now</a>
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
  
  const initialView = document.getElementById('initial-emergency');
  const activeView = document.getElementById('active-emergency');

  btnSos.addEventListener('click', () => {
    initialView.style.display = 'none';
    activeView.classList.add('active');
    document.body.classList.add('emergency-active');
  });

  btnCancel.addEventListener('click', () => {
    activeView.classList.remove('active');
    initialView.style.display = 'block';
    document.body.classList.remove('emergency-active');
  });

  container.onUnmount = () => {
    document.body.classList.remove('emergency-active');
  };
}
