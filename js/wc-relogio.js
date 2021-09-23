(() => {
    const template = document.createElement('template');
    template.innerHTML = `
        <div class="display">
            <div class="digital">
                <span></span>
            </div>
            <div class="analogico">
            </div>
        </div>
    `;

    class WcRelogioElement extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });

            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this.digitalDisplay = this.shadowRoot.querySelector('.digital>span');
        }

        connectedCallback() {
            this.digitalDisplay.textContent = getHMS();
            this.timer = setInterval(() => {
                this.digitalDisplay.textContent = getHMS();
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

    window.customElements.define('wc-relogio', WcRelogioElement);
})();
