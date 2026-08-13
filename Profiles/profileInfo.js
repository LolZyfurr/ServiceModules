export default function newProfileInfo({
    handle = "artist_handle",
    name = "Artist Studio",
    type = "founder",
    pronouns = "He/Him"
} = {}) {
    const data = { handle, name, type, pronouns };

    // Create the outer element
    const element = document.createElement("div");
    element.className = "profile-padding";

    // Header section
    const header = document.createElement("div");
    header.className = "profile-header";

    const nameEl = document.createElement("h2");
    nameEl.className = "profile-name";
    nameEl.textContent = name;

    const badge = document.createElement("span");
    badge.className = "role-badge";
    badge.title = type.charAt(0).toUpperCase() + type.slice(1);
    badge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 19h20v2H2v-2zm1.15-12.8L8 10.5 12 4l4 6.5 4.85-4.3 1.15 11.8H2l1.15-11.8z" />
    </svg>`;

    header.appendChild(nameEl);
    header.appendChild(badge);

    // Info section
    const info = document.createElement("div");
    info.className = "profile-info";

    const username = document.createElement("span");
    username.className = "profile-username";
    username.textContent = `@${handle.replace(/^@/, '')}`;

    const pronounsEl = document.createElement("span");
    pronounsEl.className = "profile-pronouns";
    pronounsEl.textContent = pronouns;

    info.appendChild(username);
    info.appendChild(pronounsEl);

    // Assemble outer element
    element.appendChild(header);
    element.appendChild(info);

    // Helper functions
    const parent = (target) => {
        const parentEl = typeof target === "string" ? document.querySelector(target) : target;
        if (parentEl) {
            parentEl.appendChild(element);
        }
        return element;
    };

    const destroy = () => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    };

    const replace = (target) => {
        const targetEl = typeof target === "string" ? document.querySelector(target) : target;
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
