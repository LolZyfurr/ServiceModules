/* --- Order Edit State Management --- */
let activeOrderMainDraft = null;
let isOrderMainDirty = false;

let editingOrderIndex = -1;
let activeOrderItemDraft = null;
let isOrderItemDirty = false;

function openOrderMainModal() {
    const currentForm = (window.orderData && window.orderData[0]) ? window.orderData[0] : {
        fields: []
    };
    activeOrderMainDraft = {
        description: document.getElementById('orderHeaderDesc') ? document.getElementById('orderHeaderDesc').textContent : "",
        fields: JSON.parse(JSON.stringify(currentForm.fields || []))
    };
    isOrderMainDirty = false;
    document.getElementById('editOrderDescription').value = activeOrderMainDraft.description;
    renderOrderReorderList();
    updateOrderMainUnsavedBar();
    document.getElementById('orderMainEditModal').classList.add('active');
}

function renderOrderReorderList() {
    const listContainer = document.getElementById('orderReorderList');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    activeOrderMainDraft.fields.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'edit-item-row';
        row.innerHTML = `
            <div class="item-info">
                <strong>${item.label || item.name}</strong>
                <span style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">[${item.type}]</span>
            </div>
            <div class="item-actions">
                <button type="button" class="icon-btn" onclick="moveOrderItem(${idx}, -1)" ${idx === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
                <button type="button" class="icon-btn" onclick="moveOrderItem(${idx}, 1)" ${idx === activeOrderMainDraft.fields.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
                <button type="button" class="icon-btn" onclick="openOrderItemModal(${idx})" title="Edit Question">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button type="button" class="icon-btn danger-btn" onclick="removeOrderItem(${idx})" title="Remove Question">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        `;
        listContainer.appendChild(row);
    });
}

/* --- Question Type Picker Modal Functions --- */
function addOrderItem() {
    document.getElementById('orderTypeModal').classList.add('active');
}

function closeOrderTypeModal() {
    document.getElementById('orderTypeModal').classList.remove('active');
}

function confirmAddOrderItem() {
    const selectedType = document.getElementById('newFieldTypeSelect').value;
    const newField = {
        id: "field_" + Date.now(),
        name: "field_" + Date.now(),
        label: "New " + selectedType.charAt(0).toUpperCase() + selectedType.slice(1) + " Question",
        type: selectedType,
        required: false,
        placeholder: "",
        options: ["select", "radio", "checkbox"].includes(selectedType) ? [{
            label: "Option 1",
            value: "option_1"
        }] : undefined
    };

    activeOrderMainDraft.fields.push(newField);
    markOrderMainDirty();
    renderOrderReorderList();
    closeOrderTypeModal();

    // Immediately open edit modal for newly created question
    openOrderItemModal(activeOrderMainDraft.fields.length - 1);
}

function removeOrderItem(index) {
    activeOrderMainDraft.fields.splice(index, 1);
    markOrderMainDirty();
    renderOrderReorderList();
}

function moveOrderItem(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= activeOrderMainDraft.fields.length) return;
    const temp = activeOrderMainDraft.fields[index];
    activeOrderMainDraft.fields[index] = activeOrderMainDraft.fields[newIndex];
    activeOrderMainDraft.fields[newIndex] = temp;
    markOrderMainDirty();
    renderOrderReorderList();
}

function markOrderMainDirty() {
    isOrderMainDirty = true;
    updateOrderMainUnsavedBar();
}

function updateOrderMainUnsavedBar() {
    const bar = document.getElementById('orderMainUnsavedBar');
    const card = document.getElementById('orderMainEditCard');
    if (isOrderMainDirty) {
        bar.style.display = 'flex';
        card.classList.add('has-unsaved-bar');
    } else {
        bar.style.display = 'none';
        card.classList.remove('has-unsaved-bar');
    }
}

function tryCloseOrderMainModal() {
    if (isOrderMainDirty) {
        alert('You have unsaved changes. Please choose Save or Discard below.');
        return;
    }
    document.getElementById('orderMainEditModal').classList.remove('active');
}

function saveOrderMainChanges() {
    activeOrderMainDraft.description = document.getElementById('editOrderDescription').value;
    const headerDesc = document.getElementById('orderHeaderDesc');
    if (headerDesc) headerDesc.textContent = activeOrderMainDraft.description;

    if (window.orderData && window.orderData[0]) {
        window.orderData[0].fields = JSON.parse(JSON.stringify(activeOrderMainDraft.fields));
    }
    if (typeof exampleResponse !== 'undefined' && exampleResponse.user?.channels?.Order?.[0]) {
        exampleResponse.user.channels.Order[0].fields = JSON.parse(JSON.stringify(activeOrderMainDraft.fields));
    }

    if (typeof window.renderFormCard === 'function') {
        window.renderFormCard();
    }

    isOrderMainDirty = false;
    updateOrderMainUnsavedBar();
    document.getElementById('orderMainEditModal').classList.remove('active');
}

function discardOrderMainChanges() {
    const currentForm = (window.orderData && window.orderData[0]) ? window.orderData[0] : {
        fields: []
    };
    activeOrderMainDraft = {
        description: document.getElementById('orderHeaderDesc') ? document.getElementById('orderHeaderDesc').textContent : "",
        fields: JSON.parse(JSON.stringify(currentForm.fields || []))
    };
    document.getElementById('editOrderDescription').value = activeOrderMainDraft.description;
    renderOrderReorderList();
    isOrderMainDirty = false;
    updateOrderMainUnsavedBar();
    document.getElementById('orderMainEditModal').classList.remove('active');
}

/* --- Single Order Item Edit Modal Logic --- */
function openOrderItemModal(index) {
    editingOrderIndex = index;
    activeOrderItemDraft = JSON.parse(JSON.stringify(activeOrderMainDraft.fields[index]));
    isOrderItemDirty = false;

    document.getElementById('orderItemEditTitle').textContent = `Edit Question: ${activeOrderItemDraft.label || activeOrderItemDraft.name}`;
    document.getElementById('editOrderFieldLabel').value = activeOrderItemDraft.label || '';
    document.getElementById('editOrderFieldName').value = activeOrderItemDraft.name || '';
    document.getElementById('editOrderFieldPlaceholder').value = activeOrderItemDraft.placeholder || '';
    document.getElementById('editOrderFieldRequired').checked = !!activeOrderItemDraft.required;

    // Show/hide options input based on field type
    const optionsGroup = document.getElementById('orderOptionsGroup');
    if (["select", "radio", "checkbox"].includes(activeOrderItemDraft.type)) {
        optionsGroup.style.display = 'block';
        renderOrderOptionsInputs();
    } else {
        optionsGroup.style.display = 'none';
    }

    updateOrderItemUnsavedBar();
    document.getElementById('orderItemEditModal').classList.add('active');
}

function renderOrderOptionsInputs() {
    const container = document.getElementById('editOrderOptionsContainer');
    container.innerHTML = '';
    if (!activeOrderItemDraft.options) activeOrderItemDraft.options = [];

    activeOrderItemDraft.options.forEach((opt, idx) => {
        const optObj = typeof opt === 'string' ? {
            label: opt,
            value: opt
        } : opt;
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '8px';
        row.style.marginBottom = '8px';

        row.innerHTML = `
            <input type="text" placeholder="Option Label" value="${optObj.label || ''}" style="flex:1;" oninput="updateOrderOption(${idx}, 'label', this.value)">
            <input type="text" placeholder="Value" value="${optObj.value || ''}" style="flex:1;" oninput="updateOrderOption(${idx}, 'value', this.value)">
            <button type="button" class="icon-btn danger-btn" onclick="removeOrderOptionInput(${idx})">✕</button>
        `;
        container.appendChild(row);
    });
}

function updateOrderOption(idx, key, val) {
    if (typeof activeOrderItemDraft.options[idx] === 'string') {
        activeOrderItemDraft.options[idx] = {
            label: activeOrderItemDraft.options[idx],
            value: activeOrderItemDraft.options[idx]
        };
    }
    activeOrderItemDraft.options[idx][key] = val;
    markOrderItemDirty();
}

function addOrderOptionInput() {
    if (!activeOrderItemDraft.options) activeOrderItemDraft.options = [];
    activeOrderItemDraft.options.push({
        label: `Option ${activeOrderItemDraft.options.length + 1}`,
        value: `option_${activeOrderItemDraft.options.length + 1}`
    });
    renderOrderOptionsInputs();
    markOrderItemDirty();
}

function removeOrderOptionInput(idx) {
    activeOrderItemDraft.options.splice(idx, 1);
    renderOrderOptionsInputs();
    markOrderItemDirty();
}

function markOrderItemDirty() {
    isOrderItemDirty = true;
    updateOrderItemUnsavedBar();
}

function updateOrderItemUnsavedBar() {
    const bar = document.getElementById('orderItemUnsavedBar');
    const card = document.getElementById('orderItemEditCard');
    if (isOrderItemDirty) {
        bar.style.display = 'flex';
        card.classList.add('has-unsaved-bar');
    } else {
        bar.style.display = 'none';
        card.classList.remove('has-unsaved-bar');
    }
}

function tryCloseOrderItemModal() {
    if (isOrderItemDirty) {
        alert('You have unsaved changes. Please choose Save or Discard below.');
        return;
    }
    document.getElementById('orderItemEditModal').classList.remove('active');
}

function saveOrderItemChanges() {
    activeOrderItemDraft.label = document.getElementById('editOrderFieldLabel').value;
    activeOrderItemDraft.name = document.getElementById('editOrderFieldName').value;
    activeOrderItemDraft.placeholder = document.getElementById('editOrderFieldPlaceholder').value;
    activeOrderItemDraft.required = document.getElementById('editOrderFieldRequired').checked;

    activeOrderMainDraft.fields[editingOrderIndex] = JSON.parse(JSON.stringify(activeOrderItemDraft));
    markOrderMainDirty();
    renderOrderReorderList();

    isOrderItemDirty = false;
    updateOrderItemUnsavedBar();
    document.getElementById('orderItemEditModal').classList.remove('active');
}

function discardOrderItemChanges() {
    isOrderItemDirty = false;
    updateOrderItemUnsavedBar();
    document.getElementById('orderItemEditModal').classList.remove('active');
}
