export default function newTerms({
    items = [
        {
            title: "Payment",
            content: "Payment is required upfront before any work begins. Accepted payment methods include PayPal, Venmo, and Cash App. Please ensure that you have the necessary funds available before placing an order."
        },
        {
            title: "Revisions",
            content: "I offer up to 2 rounds of revisions for each commission. Additional revisions may incur extra fees. Please provide clear and specific feedback to ensure that the final artwork meets your expectations."
        }
    ]
} = {}) {
    const data = { items };

    const element = document.createElement('div');
    element.className = 'card';
    Object.assign(element.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        lineHeight: '1.6',
        color: 'rgba(255, 255, 255, 0.85)'
    });

    const renderItems = (itemList) => {
        element.innerHTML = '';
        itemList.forEach((item, index) => {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = `${index + 1}. ${item.title}: `;
            p.appendChild(strong);
            p.appendChild(document.createTextNode(item.content));
            element.appendChild(p);
        });
    };

    renderItems(data.items);

    const parent = (target) => {
        const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
        if (targetEl) {
            targetEl.appendChild(element);
        }
    };

    const destroy = () => {
        element.remove();
    };

    const replace = (target) => {
        const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
        if (targetEl) {
            targetEl.replaceWith(element);
        }
    };

    const setDisplayOrder = (order) => {
        if (!Array.isArray(order)) return;
        if (typeof order[0] === 'number') {
            const reordered = order.map(index => data.items[index]).filter(Boolean);
            renderItems(reordered);
        } else {
            renderItems(order);
        }
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
