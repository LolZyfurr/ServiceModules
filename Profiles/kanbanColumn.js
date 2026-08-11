export default function newKanbanColumn({
    title = "Queued",
    items = [
        {
            order: "3674e32rtdguyhe",
            description: "Full Body Character",
            status: "Awaiting Sketch"
        },
        {
            order: "98yf9whuief89",
            description: "Profile Icon",
            status: "Queued"
        },
    ]
} = {}) {
    const data = { title, items };

    const container = document.createElement('div');
    container.innerHTML = `
<div class="kanban-column">
    <h4>${title}</h4>
    ${items.map(item => `
    <div class="kanban-card">
        <div class="client-name">${item.order}</div>
        <div>${item.description}</div>
        <span class="tag">${item.status}</span>
    </div>
    `).join('')}
</div>
    `.trim();

    const element = container.firstElementChild;

    const parent = (target) => {
        const parentEl = typeof target === 'string' ? document.querySelector(target) : target;
        if (parentEl) {
            parentEl.appendChild(element);
        }
        return element;
    };

    const destroy = () => {
        element.remove();
    };

    const replace = (target) => {
        const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
        if (targetEl && targetEl.parentNode) {
            targetEl.parentNode.replaceChild(element, targetEl);
        }
    };

    const setDisplayOrder = (order) => {
        element.style.order = order;
    };

    return {
        element,
        data,
        parent,
        destroy,
        replace,
        setDisplayOrder
    };
}
