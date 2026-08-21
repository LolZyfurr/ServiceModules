export default function newProfileCard(data = {}) {
    const inputData = {
        avatar: "https://picsum.photos/200/200?random=1",
        banner: "https://picsum.photos/800/200?random=2",
        ...data
    };

    const SVG_NS = "http://www.w3.org/2000/svg";

    // Main component wrapper
    const element = document.createElement("div");
    element.className = "profile-card";

    // Banner container
    const bannerDiv = document.createElement("div");
    bannerDiv.className = "banner";

    // Banner controls
    const bannerControls = document.createElement("div");
    bannerControls.className = "banner-controls";

    // Home Button
    const homeBtn = document.createElement("a");
    homeBtn.href = "/";
    homeBtn.id = "homeBannerBtn";
    homeBtn.className = "banner-btn";

    const homeSvg = document.createElementNS(SVG_NS, "svg");
    homeSvg.setAttribute("width", "16");
    homeSvg.setAttribute("height", "16");
    homeSvg.setAttribute("viewBox", "0 0 24 24");
    homeSvg.setAttribute("fill", "none");
    homeSvg.setAttribute("stroke", "currentColor");
    homeSvg.setAttribute("stroke-width", "2");
    homeSvg.setAttribute("stroke-linecap", "round");
    homeSvg.setAttribute("stroke-linejoin", "round");

    const homePath = document.createElementNS(SVG_NS, "path");
    homePath.setAttribute("d", "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z");
    const homePolyline = document.createElementNS(SVG_NS, "polyline");
    homePolyline.setAttribute("points", "9 22 9 12 15 12 15 22");

    homeSvg.appendChild(homePath);
    homeSvg.appendChild(homePolyline);
    homeBtn.appendChild(homeSvg);

    // Login Button
    const loginBtn = document.createElement("button");
    loginBtn.id = "loginBannerBtn";
    loginBtn.className = "banner-btn";
    if (typeof window !== "undefined" && window.isLoggedIn) {
        loginBtn.style.display = "none";
    }
    loginBtn.onclick = () => {
        if (typeof openLoginModal === "function") {
            openLoginModal();
        }
    };

    const loginSvg = document.createElementNS(SVG_NS, "svg");
    loginSvg.setAttribute("width", "16");
    loginSvg.setAttribute("height", "16");
    loginSvg.setAttribute("viewBox", "0 0 24 24");
    loginSvg.setAttribute("fill", "none");
    loginSvg.setAttribute("stroke", "currentColor");
    loginSvg.setAttribute("stroke-width", "2");
    loginSvg.setAttribute("stroke-linecap", "round");
    loginSvg.setAttribute("stroke-linejoin", "round");

    const loginPath = document.createElementNS(SVG_NS, "path");
    loginPath.setAttribute("d", "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4");
    const loginPolyline = document.createElementNS(SVG_NS, "polyline");
    loginPolyline.setAttribute("points", "10 17 15 12 10 7");
    const loginLine = document.createElementNS(SVG_NS, "line");
    loginLine.setAttribute("x1", "15");
    loginLine.setAttribute("y1", "12");
    loginLine.setAttribute("x2", "3");
    loginLine.setAttribute("y2", "12");

    loginSvg.appendChild(loginPath);
    loginSvg.appendChild(loginPolyline);
    loginSvg.appendChild(loginLine);

    loginBtn.appendChild(loginSvg);
    loginBtn.appendChild(document.createTextNode(" Login"));

    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.id = "editBannerBtn";
    editBtn.className = "banner-btn";
    editBtn.style.display = (typeof window !== "undefined" && window.isOwner) ? "inline-flex" : "none";
    editBtn.onclick = () => {
        if (typeof openEditProfileModal === "function") {
            openEditProfileModal();
        }
    };

    const editSvg = document.createElementNS(SVG_NS, "svg");
    editSvg.setAttribute("width", "16");
    editSvg.setAttribute("height", "16");
    editSvg.setAttribute("viewBox", "0 0 24 24");
    editSvg.setAttribute("fill", "none");
    editSvg.setAttribute("stroke", "currentColor");
    editSvg.setAttribute("stroke-width", "2");
    editSvg.setAttribute("stroke-linecap", "round");
    editSvg.setAttribute("stroke-linejoin", "round");

    const editPath1 = document.createElementNS(SVG_NS, "path");
    editPath1.setAttribute("d", "M12 20h9");
    const editPath2 = document.createElementNS(SVG_NS, "path");
    editPath2.setAttribute("d", "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z");

    editSvg.appendChild(editPath1);
    editSvg.appendChild(editPath2);
    editBtn.appendChild(editSvg);

    // Settings Button
    const settingsBtn = document.createElement("button");
    settingsBtn.id = "settingsBannerBtn";
    settingsBtn.className = "banner-btn";
    settingsBtn.style.display = (typeof window !== "undefined" && window.isOwner) ? "inline-flex" : "none";
    settingsBtn.onclick = () => alert("Settings opened");

    const settingsSvg = document.createElementNS(SVG_NS, "svg");
    settingsSvg.setAttribute("width", "16");
    settingsSvg.setAttribute("height", "16");
    settingsSvg.setAttribute("viewBox", "0 0 24 24");
    settingsSvg.setAttribute("fill", "none");
    settingsSvg.setAttribute("stroke", "currentColor");
    settingsSvg.setAttribute("stroke-width", "2");
    settingsSvg.setAttribute("stroke-linecap", "round");
    settingsSvg.setAttribute("stroke-linejoin", "round");

    const settingsCircle = document.createElementNS(SVG_NS, "circle");
    settingsCircle.setAttribute("cx", "12");
    settingsCircle.setAttribute("cy", "12");
    settingsCircle.setAttribute("r", "3");

    const settingsPath = document.createElementNS(SVG_NS, "path");
    settingsPath.setAttribute("d", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z");

    settingsSvg.appendChild(settingsCircle);
    settingsSvg.appendChild(settingsPath);
    settingsBtn.appendChild(settingsSvg);

    bannerControls.appendChild(homeBtn);
    bannerControls.appendChild(loginBtn);
    bannerControls.appendChild(editBtn);
    bannerControls.appendChild(settingsBtn);

    // Banner Fill
    const bannerFill = document.createElement("div");
    bannerFill.className = "banner-fill";
    bannerFill.style.backgroundImage = `url('${inputData.banner}')`;

    const bannerSvg = document.createElementNS(SVG_NS, "svg");
    bannerSvg.setAttribute("class", "banner-svg");
    bannerSvg.setAttribute("width", "100%");
    bannerSvg.setAttribute("height", "105");

    const mask = document.createElementNS(SVG_NS, "mask");
    mask.setAttribute("id", "avatar-cutout");
    mask.setAttribute("maskUnits", "userSpaceOnUse");

    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("fill", "white");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("fill", "black");
    circle.setAttribute("cx", "56");
    circle.setAttribute("cy", "101");
    circle.setAttribute("r", "46");

    mask.appendChild(rect);
    mask.appendChild(circle);
    bannerSvg.appendChild(mask);
    bannerFill.appendChild(bannerSvg);

    bannerDiv.appendChild(bannerControls);
    bannerDiv.appendChild(bannerFill);

    // Avatar Container
    const avatarContainer = document.createElement("div");
    avatarContainer.className = "avatar-container";

    const avatarImg = document.createElement("img");
    avatarImg.src = inputData.avatar;
    avatarImg.className = "avatar";
    avatarImg.alt = "Profile Picture";

    avatarContainer.appendChild(avatarImg);

    // Append to main element
    element.appendChild(bannerDiv);
    element.appendChild(avatarContainer);

    // Component Methods
    const parent = (target) => {
        const targetElem = typeof target === "string" ? document.querySelector(target) : target;
        if (targetElem) {
            targetElem.appendChild(element);
        }
    };

    const destroy = () => {
        element.remove();
    };

    const replace = (target) => {
        const targetElem = typeof target === "string" ? document.querySelector(target) : target;
        if (targetElem && targetElem.parentNode) {
            targetElem.parentNode.replaceChild(element, targetElem);
        }
    };

    const setDisplayOrder = (order) => {
        element.style.order = order;
    };

    return {
        element,
        data: inputData,
        parent,
        destroy,
        replace,
        setDisplayOrder
    };
}
