export default function newGallery({
    images = [
        "https://picsum.photos/400/400?random=1",
        "https://picsum.photos/400/400?random=2",
        "https://picsum.photos/400/400?random=3",
        "https://picsum.photos/400/400?random=4",
        "https://picsum.photos/400/400?random=5",
        "https://picsum.photos/400/400?random=6"
    ]
} = {}) {
    const data = { images };

    // Create container element dynamically
    const element = document.createElement('div');
    element.className = 'gallery-grid';

    // Populate images dynamically
    images.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = src;
        img.alt = `Artwork ${index + 1}`;

        item.appendChild(img);
        element.appendChild(item);
    });

    // Parent function to attach element to a specified parent element or selector
    const parent = (target) => {
        const parentNode = typeof target === 'string' ? document.querySelector(target) : target;
        if (parentNode) {
            parentNode.appendChild(element);
        }
        return parentNode;
    };

    // Destroy function to remove the component from the DOM
    const destroy = () => {
        element.remove();
    };

    // Replace function to replace an existing DOM node with this gallery
    const replace = (target) => {
        const targetNode = typeof target === 'string' ? document.querySelector(target) : target;
        if (targetNode && targetNode.parentNode) {
            targetNode.parentNode.replaceChild(element, targetNode);
        }
    };

    // Set display order function using CSS flex/grid order property
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
