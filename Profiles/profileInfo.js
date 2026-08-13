export default function newProfileInfo({
    handle = "artist_handle",
    name = "Artist Studio",
    type = "founder",
    pronouns = "He/Him"
} = {}) {
    const data = { handle, name, type, pronouns };

    const element = document.createElement("div");
    element.className = "profile-padding";

    const header = document.createElement("div");
    header.className = "profile-header";

    const nameEl = document.createElement("h2");
    nameEl.className = "profile-name";
    nameEl.textContent = name;

    const icons = {
        founder: '<path d="M2 19h20v2H2v-2zm1.15-12.8L8 10.5 12 4l4 6.5 4.85-4.3 1.15 11.8H2l1.15-11.8z" />',
        staff: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />',
        member: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />'
    };

    const iconPath = icons[type.toLowerCase()] || icons.member;

    const badge = document.createElement("span");
    badge.className = "role-badge";
    badge.title = type.charAt(0).toUpperCase() + type.slice(1);
    badge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        ${iconPath}
    </svg>`;

    header.appendChild(nameEl);
    header.appendChild(badge);

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

    element.appendChild(header);
    element.appendChild(info);

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
