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

    const element = document.createElement('div');
    element.className = 'kanban-column';

    const h4 = document.createElement('h4');
    h4.textContent = title;
    element.appendChild(h4);

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'kanban-card';

        const clientName = document.createElement('div');
        clientName.className = 'client-name';
        clientName.textContent = item.order;

        const description = document.createElement('div');
        description.textContent = item.description;

        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = item.status;

        card.appendChild(clientName);
        card.appendChild(description);
        card.appendChild(tag);

        element.appendChild(card);
    });

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
