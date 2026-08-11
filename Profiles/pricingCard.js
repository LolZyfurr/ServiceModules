export default function newPricingCard({
    title = "Headshot / Icon",
    price = "$35",
    examples = [
        "https://picsum.photos/400/300?random=11",
        "https://picsum.photos/400/300?random=12",
        "https://picsum.photos/400/300?random=13",
        "https://picsum.photos/400/300?random=14"
        // max of 4 examples, if more are provided, only the first 4 will be used
    ],
    features = [
        "Fully shaded & colored", 
        "High-res digital PNG", 
        "Simple background included"
        // any number of features can be provided, they will be displayed in a list
    ],
} = {}) {
    const data = { title, price, examples, features };
    const validExamples = examples.slice(0, 4);

    // Root Card Element
    const card = document.createElement('div');
    card.className = 'card pricing-card';
    card.addEventListener('click', () => {
        if (typeof window.selectPricingOption === 'function') {
            window.selectPricingOption(title);
        }
    });

    // Carousel Setup
    const carousel = document.createElement('div');
    carousel.className = 'pricing-carousel';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'carousel-btn prev';
    prevBtn.innerHTML = '&lt;';

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'carousel-btn next';
    nextBtn.innerHTML = '&gt;';

    let currentIndex = 0;
    const imgElements = validExamples.map((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${title} Example ${index + 1}`;
        if (index === 0) img.classList.add('active');
        return img;
    });

    const cycleCarousel = (direction) => {
        if (imgElements.length === 0) return;
        imgElements[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + direction + imgElements.length) % imgElements.length;
        imgElements[currentIndex].classList.add('active');
    };

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleCarousel(-1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleCarousel(1);
    });

    carousel.appendChild(prevBtn);
    imgElements.forEach(img => carousel.appendChild(img));
    carousel.appendChild(nextBtn);

    // Title Element
    const h4 = document.createElement('h4');
    h4.textContent = title;

    // Price Element
    const priceDiv = document.createElement('div');
    priceDiv.className = 'price';
    priceDiv.textContent = price;

    // Features List Element
    const ul = document.createElement('ul');
    features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = `✓ ${feature}`;
        ul.appendChild(li);
    });

    // Append all parts to card
    card.appendChild(carousel);
    card.appendChild(h4);
    card.appendChild(priceDiv);
    card.appendChild(ul);

    return {
        element: card,
        data,
        parent(parentElement) {
            const target = typeof parentElement === 'string' ? document.querySelector(parentElement) : parentElement;
            if (target && target.appendChild) {
                target.appendChild(card);
            }
            return card;
        },
        destroy() {
            if (card.parentNode) {
                card.parentNode.removeChild(card);
            }
        },
        replace(targetElement) {
            const target = typeof targetElement === 'string' ? document.querySelector(targetElement) : targetElement;
            if (target && target.parentNode) {
                target.parentNode.replaceChild(card, target);
            } else if (card.parentNode && targetElement) {
                card.parentNode.replaceChild(targetElement, card);
            }
        },
        setDisplayOrder(order) {
            card.style.order = order;
        }
    };
}
