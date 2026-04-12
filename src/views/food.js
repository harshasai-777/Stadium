export function renderFood(container, AppState) {
  const content = `
    <h2 class="section-title">Food Services</h2>
    <div class="food-grid" id="food-list">
      <!-- Injected by js -->
    </div>
    
    <!-- Modal -->
    <div class="modal-overlay" id="order-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Order Summary</h3>
          <button class="close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="order-items" id="modal-items">
          <!-- Items -->
        </div>
        <div class="order-total">
          <span>Total</span>
          <span id="modal-total">$0</span>
        </div>
        <button class="btn" style="width: 100%" id="confirm-btn">Confirm Order</button>
      </div>
    </div>
  `;
  container.innerHTML = content;

  const renderVendors = () => {
    const list = document.getElementById('food-list');
    if (!list) return;

    list.innerHTML = AppState.foodVendors.map(v => {
      let waitColor = 'var(--success-color)';
      if (v.status === 'medium') waitColor = 'var(--warning-color)';
      if (v.status === 'crowded') waitColor = 'var(--danger-color)';
      
      const waitPercent = Math.min(100, Math.max(5, (v.waitTime / 45) * 100));

      return `
        <div class="card food-card ${v.type}">
          <div class="food-img"></div>
          <div class="food-header">
            <div>
              <div class="food-title">${v.name}</div>
              <div class="badge ${v.status}">${v.status}</div>
            </div>
            <div class="food-rating"><i class="fa-solid fa-star"></i> ${v.rating}</div>
          </div>
          
          <div class="wait-time-container">
            <i class="fa-solid fa-clock wait-icon" style="color: ${waitColor}"></i>
            <div style="flex:1">
              <div style="font-size: 14px; margin-bottom:4px;">Est. ${v.waitTime} mins</div>
              <div class="wait-bar-bg">
                <div class="wait-bar-fill" style="width: ${waitPercent}%; background-color: ${waitColor}"></div>
              </div>
            </div>
          </div>

          <div class="food-actions">
            <button class="btn btn-outline order-btn" data-id="${v.id}"><i class="fa-solid fa-cart-shopping"></i> Order</button>
          </div>
        </div>
      `;
    }).join('');
    
    // Attach listeners
    document.querySelectorAll('.order-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openModal(AppState.foodVendors.find(x => x.id == id));
      });
    });
  };

  renderVendors();

  AppState.events.addEventListener('stateChanged', renderVendors);
  container.onUnmount = () => {
    AppState.events.removeEventListener('stateChanged', renderVendors);
  };

  // Modal logic
  const modal = document.getElementById('order-modal');
  const closeBtn = document.querySelector('.close-modal');
  const confirmBtn = document.getElementById('confirm-btn');

  const openModal = (vendor) => {
    document.getElementById('modal-items').innerHTML = `
      <div class="order-item">
        <div>
          <h4>${vendor.name} Special Combo</h4>
          <span style="font-size:12px;color:var(--text-secondary)">Pick up at stall</span>
        </div>
        <strong>$15.00</strong>
      </div>
    `;
    document.getElementById('modal-total').innerText = '$15.00';
    confirmBtn.innerHTML = 'Confirm Order';
    confirmBtn.disabled = false;
    modal.classList.add('active');
  };

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  
  confirmBtn.addEventListener('click', () => {
    confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    confirmBtn.disabled = true;
    setTimeout(() => {
      confirmBtn.innerHTML = '<i class="fa-solid fa-check"></i> Ordered successfully!';
      setTimeout(() => modal.classList.remove('active'), 1500);
    }, 1500);
  });
}
