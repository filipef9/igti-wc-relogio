(() => {
    const digitalTemplate = document.createElement('template');
    digitalTemplate.innerHTML = `
        <div class="display">
            <div class="digital">
                <span></span>
            </div>
        </div>
    `;

    const analogicTemplate = document.createElement('template');
    analogicTemplate.innerHTML = `
        <div class="display">
            <div class="analogic">
                <svg height="200" width="200">
                    <g transform="translate(100, 100)" fill="none">
                        <circle cx="0" cy="0" r="95" stroke="black" stroke-width="2" />

                        ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => 
                            `<path d="M 0 -90 v -7" transform="rotate(${angle})" stroke="black" stroke-width="4" />`
                        ).join('\n')}

                        <path id="hourPointer" d="M 0 0 v -75" stroke="black" stroke-width="4" />
                        <path id="minutePointer" d="M 0 0 v -85" stroke="black" stroke-width="2" />
                        <circle cx="0" cy="0" r="4" fill="black" stroke="none" />
                        <path id="secondPointer" d="M 0 0 v -85" stroke="red" stroke-width="2" />
                        <circle cx="0" cy="0" r="2" fill="red" stroke="none" />
                    </g>
                </svg>
            </div>
        </div>
    `;

    class WcRelogioElement extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
            const tipo = this.getAttribute("tipo");
            const isAnalogic = tipo === "analogico";
            const isDigital = tipo == null || tipo === undefined;

            if (isAnalogic) {
                this.shadowRoot.appendChild(analogicTemplate.content.cloneNode(true));

                this.hourPointer = this.shadowRoot.getElementById('hourPointer');
                this.minutePointer = this.shadowRoot.getElementById('minutePointer');
                this.secondPointer = this.shadowRoot.getElementById('secondPointer');

                this.timer = setInterval(() => {
                    const {h, m, s} = getHMS();

                    const hourTransform = `rotate(${((h % 12) + (m / 60)) * (360 / 12)})`;
                    this.hourPointer.setAttribute('transform', hourTransform);

                    const minuteTransform = `rotate(${(m + s / 60) * (360 / 60)})`;
                    this.minutePointer.setAttribute('transform', minuteTransform);

                    const secondTransform = `rotate(${s * (360 / 60)})`;
                    this.secondPointer.setAttribute('transform', secondTransform);
                }, 1000);
            } 
            
            if (isDigital) {
                this.shadowRoot.appendChild(digitalTemplate.content.cloneNode(true));
                this.digitalDisplay = this.shadowRoot.querySelector('.digital>span');
                this.digitalDisplay.textContent = getTimeNow();

                this.timer = setInterval(() => {
                    this.digitalDisplay.textContent = getTimeNow();
                }, 1000);
            }
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

    const getTimeNow = () => {
        return new Date().toLocaleTimeString();
    }

    window.customElements.define('wc-relogio', WcRelogioElement);
})();
