export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const createElement = (tag, className = '', children = [], attrs = {}) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    
    for (const [key, val] of Object.entries(attrs)) {
        el.setAttribute(key, val);
    }

    if (Array.isArray(children)) {
        children.forEach(child => child && el.appendChild(child));
    } else if (typeof children === 'string') {
        el.innerHTML = children;
    }

    return el;
};

export function formatText(rawText) {
    let text = String(rawText);
    let escapes = [];
    
    // 1. Handle Escaping (Stores escaped character and replaces it with a token)
    text = text.replace(/\\(.)/g, (m, c) => {
        escapes.push(c);
        return `__ESC_${escapes.length - 1}__`;
    });

    // 2. Mentions
    text = text.replace(/<@(\d+)>/g, '<span class="mentionWrapper__0" role="button">@Kaedes</span>');

    // 3. Emojis (Mapping literals and shortcodes to Twemoji HTML)
    text = text.replace(/(😂|:joy:)/g, '<img class="messageEmoji__0" data-type="emoji" data-name=":joy:" alt="😂" draggable="false" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f602.svg">');

    // 4. Markdown Links
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" rel="noreferrer noopener" target="_blank" role="link"><span>$1</span></a>');

    // 5. Raw Links (Avoids replacing URLs already within HTML attributes like href="...")
    text = text.replace(/(^|[^"'])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" rel="noreferrer noopener" target="_blank" role="link"><span>$2</span></a>');

    // 6. Bold & Italics
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 7. New lines
    text = text.replace(/\n/g, '<br>');

    // 8. Restore Escaped Characters safely
    text = text.replace(/__ESC_(\d+)__/g, (m, idx) => escapes[idx]);

    return text;
}

export class BaseMessageBuilder {
    constructor() {
        this.root = createElement('div', 'messageObject__0');
        this.display = createElement('div', 'messageDisplay__0');
        this.header = createElement('div', 'messageHeader__0', [
            createElement('div', 'contentLeft__0'),
            createElement('div', 'contentRight__0')
        ]);
        
        this.avatar = createElement('img', 'messageAvatar__0', [], { role: 'button', src: '' });
        this.contentLeft = createElement('div', 'contentLeft__0', [this.avatar]);
        
        this.username = createElement('div', 'contentUsername__0', [], { role: 'button' });
        
        this.tagAvatar = createElement('img', 'tagAvatar__0', [], { width: '14', height: '14', src: '', alt: '' });
        this.tagText = createElement('span', 'tagText__0');
        this.messageTag = createElement('div', 'messageTag__0', [this.tagAvatar, this.tagText]);
        this.messageTag.style.display = 'none'; // Default hidden unless tag exists
        
        this.timestamp = createElement('div', 'contentTimestamp__0');
        
        this.contentHeader = createElement('div', 'contentHeader__0', [
            this.username,
            this.messageTag,
            this.timestamp
        ]);
        
        this.contentContainer = createElement('div', 'contentContainer__0');
        
        this.contentRight = createElement('div', 'contentRight__0', [
            this.contentHeader,
            this.contentContainer
        ]);
        
        this.content = createElement('div', 'messageContent__0', [
            this.contentLeft,
            this.contentRight
        ]);
        
        this.display.appendChild(this.header);
        this.display.appendChild(this.content);
        this.root.appendChild(this.display);
        
        this.parentElement = null;
    }

    setParent(element) {
        this.parentElement = element;
        return this;
    }

    setAuthor(data) {
        if (data.name) this.username.textContent = data.name;
        if (data.avatar) this.avatar.setAttribute('src', data.avatar);
        
        if (data.tag) {
            this.messageTag.style.display = '';
            if (data.tag.name) this.tagText.textContent = data.tag.name;
            if (data.tag.avatar) this.tagAvatar.setAttribute('src', data.tag.avatar);
        } else {
            this.messageTag.style.display = 'none';
        }
        return this;
    }

    animateIn() {
        if (this.parentElement && !this.root.parentElement) {
            this.parentElement.appendChild(this.root);
        }
        // Add basic fade animation functionality
        this.root.style.opacity = '0';
        this.root.style.transition = 'opacity 0.2s ease-in-out';
        requestAnimationFrame(() => {
            this.root.style.opacity = '1';
        });
        return this;
    }

    animateOut() {
        this.root.style.opacity = '0';
        
        // Wrap timeout inside a promise to support chained awaits or `.wait()` calls
        const p = new Promise(resolve => {
            setTimeout(() => {
                resolve(this);
            }, 200);
        });
        
        // Expose a custom wait function to fulfill `animateOut().wait()` implementation
        p.wait = function() { 
            return this; 
        };
        
        return p;
    }

    remove() {
        if (this.root.parentElement) {
            this.root.parentElement.removeChild(this.root);
        }
        return this;
    }
}

export class TypingBuilder extends BaseMessageBuilder {
    constructor() {
        super();
        this.root.classList.add('typeTyping__0');
        
        const typingDots = createElement('div', 'typingContainer__0', [
            createElement('div', 'typingDot__0'),
            createElement('div', 'typingDot__0'),
            createElement('div', 'typingDot__0')
        ]);
        
        this.contentContainer.appendChild(typingDots);
    }
}

export class MessageBuilder extends BaseMessageBuilder {
    constructor() {
        super();
        this.spanContent = createElement('span');
        this.contentContainer.appendChild(this.spanContent);
        this.isEdited = false;
        this.rawText = "";
    }
    
    setContent(text) {
        this.rawText = text;
        this.updateContent();
        return this;
    }

    setTimestamp(isoString) {
        const d = new Date(isoString);
        let hours = d.getHours();
        let minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12 || 12; // Formats 0 to 12
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        this.timestamp.textContent = `${hours}:${minutes} ${ampm}`;
        return this;
    }

    setEdited(edited) {
        this.isEdited = edited;
        this.updateContent();
        return this;
    }
    
    updateContent() {
        let formatted = formatText(this.rawText);
        
        if (this.isEdited) {
            formatted += ' <span class="messageEdited__0">(edited)</span>';
        }
        
        this.spanContent.innerHTML = formatted;
    }

    setFollowUp(isFollowUp) {
        if (isFollowUp) {
            this.root.classList.add('typeFollow__0');
        } else {
            this.root.classList.remove('typeFollow__0');
        }
        return this;
    }

    setSelf(isSelf) {
        if (isSelf) {
            this.root.classList.add('typeSelf__0');
        } else {
            this.root.classList.remove('typeSelf__0');
        }
        return this;
    }
}

export function createTyping() {
    return new TypingBuilder();
}

export function createMessage() {
    return new MessageBuilder();
}
