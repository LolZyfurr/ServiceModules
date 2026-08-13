export default function newProfileBio({
    bio = "Digital Illustrator & Concept Artist. Commissions are currently OPEN! Check options & queue below.",
} = {}) {
    const data = { bio };

    const element = document.createElement('p');
    element.className = 'profile-bio';
    element.textContent = bio;

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
        return element;
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
        setDisplayOrder,
    };
}
