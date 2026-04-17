export function renderFood(container, AppState) {
  const uiState = {
    search: '',
    status: 'all',
    sort: 'waitAsc',
    quantity: 1,
    selectedVendor: null,
    selectedMenuItemId: null,
    orderCart: [],
    latestOrderCode: null
  };

  const content = `
    <h2 class="section-title">Food Services</h2>
    <div class="food-toolbar card">
      <div class="food-toolbar-group">
        <label for="food-search">Search</label>
        <input id="food-search" class="input-control" type="text" placeholder="Search vendor..." />
      </div>
      <div class="food-toolbar-group">
        <label for="food-filter">Status</label>
        <select id="food-filter" class="input-control">
          <option value="all">All</option>
          <option value="safe">Safe</option>
          <option value="medium">Medium</option>
          <option value="crowded">Crowded</option>
        </select>
      </div>
      <div class="food-toolbar-group">
        <label for="food-sort">Sort</label>
        <select id="food-sort" class="input-control">
          <option value="waitAsc">Fastest wait</option>
          <option value="waitDesc">Longest wait</option>
          <option value="ratingDesc">Best rating</option>
        </select>
      </div>
      <div class="food-toolbar-group">
        <label>Top Recommendation</label>
        <strong id="food-recommendation">-</strong>
      </div>
    </div>
    <div class="food-grid" id="food-list"></div>
  `;
  container.innerHTML = content;

  // Safely manage the order-modal so it lives directly on document.body for perfect centering
  let modal = document.getElementById('order-modal');
  if (modal) {
    modal.remove(); // Clean up existing if re-rendering page
  }

  const modalHtml = `
    <div class="modal-overlay" id="order-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Order: <span id="modal-vendor-name" style="color:var(--text-secondary);">Vendor</span></h3>
          <button class="close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="order-items" id="modal-cart-items" style="max-height: 180px; overflow-y: auto; margin-bottom: 20px;">
          <!-- Cart items injected here -->
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; margin-bottom: 16px;">
          <div class="food-toolbar-group" style="margin-bottom: 16px;">
            <label for="modal-menu-select" style="font-size: 13px; color: var(--text-muted); margin-bottom: 4px; display:block;">Select Item to Add</label>
            <select id="modal-menu-select" class="input-control" style="width: 100%; border-radius: 8px; padding: 10px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white;"></select>
          </div>
          
          <div style="display: flex; gap: 16px; align-items: center;">
            <div class="qty-control" style="background: rgba(255,255,255,0.05); padding: 5px 12px; border-radius: 8px; display: flex; align-items: center; gap: 16px; border: 1px solid rgba(255,255,255,0.1);">
              <button class="qty-btn" id="qty-minus" type="button" style="background:none; border:none; color:white; cursor:pointer; font-size: 14px;"><i class="fa-solid fa-minus"></i></button>
              <span id="qty-value" style="font-weight: 600; width: 20px; text-align: center; font-size: 16px;">1</span>
              <button class="qty-btn" id="qty-plus" type="button" style="background:none; border:none; color:white; cursor:pointer; font-size: 14px;"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button class="btn btn-outline" id="add-to-cart-btn" style="flex: 1; padding: 10px; border-radius: 8px;"><i class="fa-solid fa-plus"></i> Add</button>
          </div>
        </div>

        <div class="order-total" style="font-size: 20px; font-weight: 700; display: flex; justify-content: space-between; margin-bottom: 24px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
          <span>Total</span>
          <span id="modal-total">Rs 0.00</span>
        </div>
        <button class="btn" style="width: 100%" id="confirm-btn" disabled>Confirm Order</button>
        <p id="order-code-message" style="margin-top:12px; text-align:center; color:var(--success-color); font-weight:600; display:none;"></p>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  modal = document.getElementById('order-modal');

  const list = document.getElementById('food-list');
  const searchInput = document.getElementById('food-search');
  const filterSelect = document.getElementById('food-filter');
  const sortSelect = document.getElementById('food-sort');

  const closeBtn = document.querySelector('#order-modal .close-modal');
  const confirmBtn = document.getElementById('confirm-btn');
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const qtyValue = document.getElementById('qty-value');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyMinus = document.getElementById('qty-minus');
  const modalMenuSelect = document.getElementById('modal-menu-select');
  const modalVendorName = document.getElementById('modal-vendor-name');
  const orderCodeMessage = document.getElementById('order-code-message');

  const parseRating = (ratingValue) => Number.parseFloat(ratingValue.split('/')[0]) || 0;
  const generateOrderCode = () => {
    const stamp = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `ORD-${stamp}-${rand}`;
  };

  const getVisibleVendors = () => {
    const filtered = AppState.foodVendors.filter((vendor) => {
      const textMatch = vendor.name.toLowerCase().includes(uiState.search.toLowerCase());
      const statusMatch = uiState.status === 'all' ? true : vendor.status === uiState.status;
      return textMatch && statusMatch;
    });

    return filtered.sort((a, b) => {
      if (uiState.sort === 'waitDesc') return b.waitTime - a.waitTime;
      if (uiState.sort === 'ratingDesc') return parseRating(b.rating) - parseRating(a.rating);
      return a.waitTime - b.waitTime;
    });
  };

  const updateRecommendation = () => {
    const recommendationEl = document.getElementById('food-recommendation');
    if (!recommendationEl) return;

    const best = [...AppState.foodVendors]
      .sort((a, b) => (a.waitTime - b.waitTime) || (parseRating(b.rating) - parseRating(a.rating)))[0];

    recommendationEl.textContent = best ? `${best.name} (${best.waitTime}m)` : 'Unavailable';
  };

  const syncQty = () => {
    qtyValue.textContent = `${uiState.quantity}`;
  };

  const renderCart = () => {
    const cartEl = document.getElementById('modal-cart-items');
    if (uiState.orderCart.length === 0) {
      cartEl.innerHTML = '<div style="color:var(--text-muted); font-size:14px; text-align:center; padding: 20px 0;">Your cart is empty. Add items below.</div>';
    } else {
      cartEl.innerHTML = uiState.orderCart.map((item, index) => `
        <div class="order-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed rgba(255,255,255,0.1);">
          <div>
            <h4 style="font-size: 14px; margin-bottom: 4px;">${item.name}</h4>
            <span style="font-size:12px;color:var(--text-secondary)">Qty: ${item.quantity}  (@ Rs ${item.price.toFixed(2)} ea)</span>
          </div>
          <div style="display: flex; gap: 16px; align-items: center;">
            <strong>Rs ${(item.price * item.quantity).toFixed(2)}</strong>
            <button class="remove-cart-item" data-index="${index}" style="background:none; border:none; cursor:pointer; color:var(--danger-color); font-size: 16px;"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `).join('');
      
      document.querySelectorAll('.remove-cart-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.index, 10);
          uiState.orderCart.splice(idx, 1);
          renderCart();
          syncOrderTotal();
        });
      });
    }
  };

  const syncOrderTotal = () => {
    const totalEl = document.getElementById('modal-total');
    const total = uiState.orderCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalEl.textContent = `Rs ${total.toFixed(2)}`;
    
    confirmBtn.disabled = uiState.orderCart.length === 0;
  };

  const openModal = (vendor) => {
    uiState.selectedVendor = vendor;
    uiState.selectedMenuItemId = vendor.menu[0]?.id || null;
    uiState.quantity = 1;
    uiState.orderCart = [];
    uiState.latestOrderCode = null;
    
    modalVendorName.textContent = vendor.name;

    modalMenuSelect.innerHTML = vendor.menu.map((item) => `
      <option value="${item.id}">${item.name} - Rs ${item.price.toFixed(2)}</option>
    `).join('');
    modalMenuSelect.value = uiState.selectedMenuItemId || '';

    syncQty();
    renderCart();
    syncOrderTotal();

    confirmBtn.innerHTML = 'Confirm Order';
    if (orderCodeMessage) {
      orderCodeMessage.style.display = 'none';
      orderCodeMessage.textContent = '';
    }
    modal.classList.add('active');
  };

  const renderVendors = () => {
    if (!list) return;
    const visibleVendors = getVisibleVendors();

    list.innerHTML = visibleVendors.map((vendor) => {
      let waitColor = 'var(--success-color)';
      if (vendor.status === 'medium') waitColor = 'var(--warning-color)';
      if (vendor.status === 'crowded') waitColor = 'var(--danger-color)';

      const waitPercent = Math.min(100, Math.max(5, (vendor.waitTime / 45) * 100));
      const menuPreview = vendor.menu.slice(0, 3).map((item) => `<span class="menu-pill">${item.name}</span>`).join('');

      return `
        <div class="card food-card ${vendor.type}">
          <div class="food-img" style="background-image: linear-gradient(to bottom, transparent, var(--bg-surface-solid)), url('${vendor.image}');"></div>
          <div class="food-header">
            <div>
              <div class="food-title">${vendor.name}</div>
              <div class="badge ${vendor.status}">${vendor.status}</div>
            </div>
            <div class="food-rating"><i class="fa-solid fa-star"></i> ${vendor.rating}</div>
          </div>
          <div class="menu-preview">${menuPreview}</div>
          <div class="wait-time-container">
            <i class="fa-solid fa-clock wait-icon" style="color: ${waitColor}"></i>
            <div style="flex:1">
              <div style="font-size: 14px; margin-bottom:4px;">Est. ${vendor.waitTime} mins</div>
              <div class="wait-bar-bg">
                <div class="wait-bar-fill" style="width: ${waitPercent}%; background-color: ${waitColor}"></div>
              </div>
            </div>
          </div>
          <div class="food-actions">
            <button class="btn btn-outline order-btn" data-id="${vendor.id}"><i class="fa-solid fa-cart-shopping"></i> Order Food</button>
          </div>
        </div>
      `;
    }).join('');

    if (visibleVendors.length === 0) {
      list.innerHTML = `<div class="card empty-state">No vendors match current filters.</div>`;
    }

    document.querySelectorAll('.order-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = Number(event.currentTarget.dataset.id);
        const vendor = AppState.foodVendors.find((item) => item.id === id);
        if (vendor) openModal(vendor);
      });
    });

    updateRecommendation();
  };

  renderVendors();

  searchInput.addEventListener('input', (event) => {
    uiState.search = event.target.value || '';
    renderVendors();
  });
  filterSelect.addEventListener('change', (event) => {
    uiState.status = event.target.value;
    renderVendors();
  });
  sortSelect.addEventListener('change', (event) => {
    uiState.sort = event.target.value;
    renderVendors();
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  
  qtyPlus.addEventListener('click', () => {
    uiState.quantity = Math.min(10, uiState.quantity + 1);
    syncQty();
  });
  qtyMinus.addEventListener('click', () => {
    uiState.quantity = Math.max(1, uiState.quantity - 1);
    syncQty();
  });
  
  modalMenuSelect.addEventListener('change', (event) => {
    uiState.selectedMenuItemId = event.target.value;
  });

  addToCartBtn.addEventListener('click', () => {
    const selectedItemDef = uiState.selectedVendor.menu.find(m => m.id === uiState.selectedMenuItemId) || uiState.selectedVendor.menu[0];
    
    // Check if item already in cart
    const existingIdx = uiState.orderCart.findIndex(item => item.id === selectedItemDef.id);
    if (existingIdx > -1) {
      uiState.orderCart[existingIdx].quantity += uiState.quantity;
    } else {
      uiState.orderCart.push({
        ...selectedItemDef,
        quantity: uiState.quantity
      });
    }

    // Reset qty for next addition
    uiState.quantity = 1;
    syncQty();
    renderCart();
    syncOrderTotal();
  });

  confirmBtn.addEventListener('click', () => {
    if (uiState.orderCart.length === 0) return;
    
    confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    confirmBtn.disabled = true;
    
    setTimeout(() => {
      uiState.latestOrderCode = generateOrderCode();
      confirmBtn.innerHTML = '<i class="fa-solid fa-check"></i> Order Placed';
      if (orderCodeMessage) {
        orderCodeMessage.style.display = 'block';
        orderCodeMessage.innerHTML = `Order Code: <strong>${uiState.latestOrderCode}</strong>`;
      }
    }, 1200);
  });

  AppState.events.addEventListener('stateChanged', renderVendors);
  
  container.onUnmount = () => {
    AppState.events.removeEventListener('stateChanged', renderVendors);
    if (modal) modal.remove();
  };
}
