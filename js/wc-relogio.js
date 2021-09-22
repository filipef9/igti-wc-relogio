class WcRelogioElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.spanEl = document.createElement('span');
        this.spanEl.textContent = getHMS();

        this.shadowRoot.append(this.spanEl);
    }

    connectedCallback() {
        this.spanEl.textContent = getHMS();
        this.timer = setInterval(() => {
            this.spanEl.textContent = getHMS();
        });
    }

    disconnectedCallback() {
        clearInterval(this.timer);
    }
}

const getHMS = () => {
    const dh = new Date();
    const h = formatNumber(dh.getHours());
    const m = formatNumber(dh.getMinutes());
    const s = formatNumber(dh.getSeconds());
    return `${h}:${m}:${s}`;
};

const formatNumber = (n) => {
    return String(n).padStart(2, '0');
}

customElements.define('wc-relogio', WcRelogioElement);
