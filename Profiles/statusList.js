export default function newStatusList(inputData = {}) {
    const defaultData = {
        commissions: {
            type: "open",
            slots: {
                taken: 3,
                total: 5
            }
        },
        trades: {
            type: "selective",
            slots: null
        },
        requests: {
            type: "closed",
            slots: null
        }
    };

    const data = {
        commissions: { ...defaultData.commissions, ...inputData.commissions },
        trades: { ...defaultData.trades, ...inputData.trades },
        requests: { ...defaultData.requests, ...inputData.requests },
        ...inputData
    };

    const labels = {
        commissions: "Commissions",
        trades: "Art Trades",
        requests: "Requests"
    };

    const element = document.createElement("div");
    element.className = "profile-status-list";

    const itemElements = {};

    const createStatusItem = (key, itemData) => {
        const itemDiv = document.createElement("div");
        const statusType = itemData.type || "";
        itemDiv.className = `profile-status ${statusType}`.trim();

        const dotSpan = document.createElement("span");
        dotSpan.className = "profile-status-dot";

        const textSpan = document.createElement("span");
        const labelName = labels[key] || (key.charAt(0).toUpperCase() + key.slice(1));

        let statusText = "";
        if (itemData.slots && typeof itemData.slots.taken === "number" && typeof itemData.slots.total === "number") {
            statusText = `[${itemData.slots.taken}/${itemData.slots.total}]`;
        } else if (itemData.type) {
            const formattedType = itemData.type.charAt(0).toUpperCase() + itemData.type.slice(1);
            statusText = `[${formattedType}]`;
        }

        textSpan.textContent = `${labelName} ${statusText}`.trim();

        itemDiv.appendChild(dotSpan);
        itemDiv.appendChild(textSpan);

        return itemDiv;
    };

    const keys = ["commissions", "trades", "requests"];
    keys.forEach(key => {
        if (data[key]) {
            const itemEl = createStatusItem(key, data[key]);
            itemElements[key] = itemEl;
            element.appendChild(itemEl);
        }
    });

    const parent = (parentElement) => {
        if (parentElement && typeof parentElement.appendChild === "function") {
            parentElement.appendChild(element);
        }
        return element;
    };

    const destroy = () => {
        if (element.parentNode) {
            element.remove();
        }
    };

    const replace = (targetElement) => {
        if (targetElement && targetElement.parentNode) {
            targetElement.parentNode.replaceChild(element, targetElement);
        }
    };

    const setDisplayOrder = (orderArray) => {
        if (Array.isArray(orderArray)) {
            orderArray.forEach(key => {
                if (itemElements[key]) {
                    element.appendChild(itemElements[key]);
                }
            });
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
