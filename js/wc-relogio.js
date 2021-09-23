(() => {
    const template = document.createElement('template');
    template.innerHTML = `
        <div class="display">
            <div class="digital">
                <span></span>
            </div>
            <div class="analogic">
                <svg height="210" width="500">
                    <circle cx="100" cy="100" r="60" fill="none" stroke="black"/>
                    <g id="hourPointer" transform="rotate(360, 100, 100)">
                        <path d="M 100 100 V 50" stroke="red" />
                    </g>
                    <g id="minutePointer" transform="rotate(360, 100, 100)">
                        <path d="M 100 100 V 50" stroke="green" />
                    </g>
                    <g id="secondPointer" transform="rotate(360, 100, 100)">
                        <path d="M 100 100 V 50" stroke="blue" />
                    </g>
                </svg>
            </div>
        </div>
    `;

    class WcRelogioElement extends HTMLElement {
        constructor() {
            super();
            
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.digitalDisplay = this.shadowRoot.querySelector('.digital>span');

            this.hourPointer = this.shadowRoot.getElementById('hourPointer');
            this.minutePointer = this.shadowRoot.getElementById('minutePointer');
            this.secondPointer = this.shadowRoot.getElementById('secondPointer');
        }

        connectedCallback() {
            this.digitalDisplay.textContent = getHMSFormatted();
            this.timer = setInterval(() => {
                const {h, m, s} = getHMS();
                this.digitalDisplay.textContent = getHMSFormatted();

                const hourTransform = `rotate(${h * (360 / 12)}, 100, 100)`;
                this.hourPointer.setAttribute('transform', hourTransform);

                const minuteTransform = `rotate(${m * (360 / 60)}, 100, 100)`;
                this.minutePointer.setAttribute('transform', minuteTransform);

                const secondTransform = `rotate(${s * (360 / 60)}, 100, 100)`;
                this.secondPointer.setAttribute('transform', secondTransform);
            }, 1000);
        }

        disconnectedCallback() {
            clearInterval(this.timer);
        }
    }

    const getHMS = () => {
        const dh = new Date();
        const h = dh.getHours();
        const m = dh.getMinutes();
        const s = dh.getSeconds();
        return { h, m, s};
    };

    const getHMSFormatted = () => {
        const {h, m, s} = getHMS();
        return `${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}`;
    }

    const formatNumber = (n) => {
        return String(n).padStart(2, '0');
    }

    window.customElements.define('wc-relogio', WcRelogioElement);
})();
