/* --- Pricing Edit State Management --- */
let activePricingMainDraft = null;
let isPricingMainDirty = false;

let editingItemIndex = -1;
let activePricingItemDraft = null;
let isPricingItemDirty = false;

/* --- Main Pricing Section Modal Functions --- */
function openPricingMainModal() {
    activePricingMainDraft = {
        description: document.getElementById('pricingHeaderDesc').textContent,
        items: JSON.parse(JSON.stringify(window.pricingData))
    };
    isPricingMainDirty = false;
    document.getElementById('editPricingDescription').value = activePricingMainDraft.description;
    renderReorderList();
    updatePricingMainUnsavedBar();
    document.getElementById('pricingMainEditModal').classList.add('active');
}

function renderReorderList() {
    const listContainer = document.getElementById('pricingReorderList');
    listContainer.innerHTML = '';
    activePricingMainDraft.items.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'edit-item-row';
        row.innerHTML = `
            <div class="item-info">
                <strong>${item.title}</strong>
                <span style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">(${item.price})</span>
            </div>
            <div class="item-actions">
                <button type="button" class="icon-btn" onclick="movePricingItem(${idx}, -1)" ${idx === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
                <button type="button" class="icon-btn" onclick="movePricingItem(${idx}, 1)" ${idx === activePricingMainDraft.items.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
                <button type="button" class="icon-btn" onclick="openPricingItemModal(${idx})" title="Edit Item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button type="button" class="icon-btn danger-btn" onclick="removePricingItem(${idx})" title="Remove Item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        `;
        listContainer.appendChild(row);
    });
}

function addPricingItem() {
    const newItem = {
        title: "New Option",
        price: "$0",
        examples: [],
        features: ["New Feature"]
    };
    activePricingMainDraft.items.push(newItem);
    markPricingMainDirty();
    renderReorderList();
    openPricingItemModal(activePricingMainDraft.items.length - 1);
}

function removePricingItem(index) {
    activePricingMainDraft.items.splice(index, 1);
    markPricingMainDirty();
    renderReorderList();
}

function movePricingItem(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= activePricingMainDraft.items.length) return;
    const temp = activePricingMainDraft.items[index];
    activePricingMainDraft.items[index] = activePricingMainDraft.items[newIndex];
    activePricingMainDraft.items[newIndex] = temp;
    markPricingMainDirty();
    renderReorderList();
}

function markPricingMainDirty() {
    isPricingMainDirty = true;
    updatePricingMainUnsavedBar();
}

function updatePricingMainUnsavedBar() {
    const bar = document.getElementById('pricingMainUnsavedBar');
    const card = document.getElementById('pricingMainEditCard');
    if (isPricingMainDirty) {
        bar.style.display = 'flex';
        card.classList.add('has-unsaved-bar');
    } else {
        bar.style.display = 'none';
        card.classList.remove('has-unsaved-bar');
    }
}

function tryClosePricingMainModal() {
    if (isPricingMainDirty) {
        alert('You have unsaved changes. Please choose Save or Discard below.');
        return;
    }
    document.getElementById('pricingMainEditModal').classList.remove('active');
}

function savePricingMainChanges() {
    activePricingMainDraft.description = document.getElementById('editPricingDescription').value;
    const headerDesc = document.getElementById('pricingHeaderDesc');
    if (headerDesc) headerDesc.textContent = activePricingMainDraft.description;

    const updatedItems = JSON.parse(JSON.stringify(activePricingMainDraft.items));
    window.pricingData = updatedItems;
    if (typeof exampleResponse !== 'undefined' && exampleResponse.user?.channels) {
        exampleResponse.user.channels.Pricing = updatedItems;
    }

    window.renderPricingGrid();
    isPricingMainDirty = false;
    updatePricingMainUnsavedBar();
    document.getElementById('pricingMainEditModal').classList.remove('active');
}

function discardPricingMainChanges() {
    activePricingMainDraft = {
        description: document.getElementById('pricingHeaderDesc').textContent,
        items: JSON.parse(JSON.stringify(window.pricingData))
    };
    document.getElementById('editPricingDescription').value = activePricingMainDraft.description;
    renderReorderList();
    isPricingMainDirty = false;
    updatePricingMainUnsavedBar();
    document.getElementById('pricingMainEditModal').classList.remove('active');
}

/* --- Single Pricing Item Modal Functions --- */
function openPricingItemModal(index) {
    editingItemIndex = index;
    activePricingItemDraft = JSON.parse(JSON.stringify(activePricingMainDraft.items[index]));
    isPricingItemDirty = false;

    document.getElementById('itemEditModalTitle').textContent = `Edit ${activePricingItemDraft.title}`;
    document.getElementById('editItemTitle').value = activePricingItemDraft.title;
    document.getElementById('editItemPrice').value = activePricingItemDraft.price;

    renderFeaturesInputs();
    renderImagePreviews();
    updatePricingItemUnsavedBar();

    document.getElementById('pricingItemEditModal').classList.add('active');
}

function renderFeaturesInputs() {
    const container = document.getElementById('editItemFeaturesContainer');
    container.innerHTML = '';
    activePricingItemDraft.features.forEach((feat, idx) => {
        const row = document.createElement('div');
        row.style.marginBottom = '8px';

        const inputRow = document.createElement('div');
        inputRow.className = 'feature-input-row';

        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 200;
        input.value = feat;
        input.oninput = (e) => {
            activePricingItemDraft.features[idx] = e.target.value;
            row.querySelector('.char-counter').textContent = `${e.target.value.length}/200`;
            markPricingItemDirty();
        };

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'icon-btn';
        removeBtn.innerHTML = '✕';
        removeBtn.onclick = () => {
            activePricingItemDraft.features.splice(idx, 1);
            renderFeaturesInputs();
            markPricingItemDirty();
        };

        inputRow.appendChild(input);
        inputRow.appendChild(removeBtn);

        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = `${feat.length}/200`;

        row.appendChild(inputRow);
        row.appendChild(counter);
        container.appendChild(row);
    });
}

function addFeatureInput() {
    if (!activePricingItemDraft.features) activePricingItemDraft.features = [];
    activePricingItemDraft.features.push('');
    renderFeaturesInputs();
    markPricingItemDirty();
}

function renderImagePreviews() {
    const container = document.getElementById('editItemImagePreviews');
    container.innerHTML = '';
    if (!activePricingItemDraft.examples) activePricingItemDraft.examples = [];
    activePricingItemDraft.examples.forEach((url, idx) => {
        const item = document.createElement('div');
        item.className = 'image-preview-item';
        item.innerHTML = `
            <img src="${url}" alt="Preview">
            <button type="button" class="remove-img" onclick="removeImageExample(${idx})">✕</button>
        `;
        container.appendChild(item);
    });
}

function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            activePricingItemDraft.examples.push(event.target.result);
            renderImagePreviews();
            markPricingItemDirty();
        };
        reader.readAsDataURL(file);
    });
    e.target.value = '';
}

function removeImageExample(idx) {
    activePricingItemDraft.examples.splice(idx, 1);
    renderImagePreviews();
    markPricingItemDirty();
}

function markPricingItemDirty() {
    isPricingItemDirty = true;
    updatePricingItemUnsavedBar();
}

function updatePricingItemUnsavedBar() {
    const bar = document.getElementById('pricingItemUnsavedBar');
    const card = document.getElementById('pricingItemEditCard');
    if (isPricingItemDirty) {
        bar.style.display = 'flex';
        card.classList.add('has-unsaved-bar');
    } else {
        bar.style.display = 'none';
        card.classList.remove('has-unsaved-bar');
    }
}

function tryClosePricingItemModal() {
    if (isPricingItemDirty) {
        alert('You have unsaved changes. Please choose Save or Discard below.');
        return;
    }
    document.getElementById('pricingItemEditModal').classList.remove('active');
}

function savePricingItemChanges() {
    activePricingItemDraft.title = document.getElementById('editItemTitle').value;
    activePricingItemDraft.price = document.getElementById('editItemPrice').value;

    activePricingMainDraft.items[editingItemIndex] = JSON.parse(JSON.stringify(activePricingItemDraft));
    markPricingMainDirty();
    renderReorderList();

    isPricingItemDirty = false;
    updatePricingItemUnsavedBar();
    document.getElementById('pricingItemEditModal').classList.remove('active');
}

function discardPricingItemChanges() {
    isPricingItemDirty = false;
    updatePricingItemUnsavedBar();
    document.getElementById('pricingItemEditModal').classList.remove('active');
}
