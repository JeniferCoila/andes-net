import modal from "./modal.js";

export default () => {
    class Cards {
        constructor() {
            this.cardContainer = document.querySelector(".andesnet-plans__cards .swiper-wrapper");
        }

        async loadCardData() {
            try {
                const response = await fetch('./js/data/cards-content.json');
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo JSON.');
                }
                return await response.json();
            } catch (error) {
                console.error('Error al cargar el archivo JSON:', error);
                return []; // Retornar un arreglo vacío o manejar el error según sea necesario
            }
        }

        async displayCards() {
            const cardsData = await this.loadCardData();
            this.setCards(cardsData);
        }

        setCards(cards) {
            const contentCards = this.getContent(cards);
            this.cardContainer.innerHTML = contentCards;
            modal();
        }

        getContent(cards) {
            let content = "";

            for (let i = 0; i < cards.length; i++) {
                const dataC = cards[i];
                const main = `<div class="andesnet-plans__card-main">
                <h3 class="card--title a-tc--blue">${dataC.title}</h3>
                ${(dataC.prom_enabled ? `<h4 class="card--vel">${dataC.vel}Mbps</h4>` : '')}
                <h3 class="card--doublevel a-tc--blue">
                    <b class="card--doublevel-qty">
                    ${(dataC.prom_enabled ? `${dataC.promocional_vel}` : `${dataC.vel}`)}
                    </b>
                    <b class="card--doublevel-mbps">Mbps</b>
                </h3></div>`
                const ribbon = `<div class="andesnet-plans__card-main-ribbon blue-bg">
                <p class="card--offer a-tc--white">
                ${(dataC.prom_enabled ? `DUPLICA TU VELOCIDAD + 10%DSCTO` : '')}
                 </p>
                 <h4 class="card--offer-time a-tc--white">
                    <strong>
                    ${(dataC.prom_enabled ? 'x 3 meses' : 'EN ALTA VELOCIDAD')}
                    </strong>
                </h4>
            </div>`
                const price = `                    
            <div class="andesnet-plans__card-price">
                <p class="card--price-ttl">Precio de lanzamiento</p>
                <div class="card--price">
                    <span>
                        <strong class="card--price-amount">
                        s/${(dataC.prom_enabled ? `${dataC.prom_price}` : `${dataC.price}`)}
                        </strong>
                        <strong class="card--price-month">
                            x mes
                        </strong>
                    </span>
                    ${(dataC.prom_enabled ? `
                    <strong class="card--price-dscto">
                        10% dto
                    </strong>`: ``)}
                    
                </div>
                <small class="card--price-disclaimer">
                ${(dataC.prom_enabled ? `A partir del 4to mes: s/${dataC.price}` : ``)}
                 </small>
                <button class="card--price-btn modal-opener a-button" data-plan=${dataC.vel}>
                    <span>
                        LO QUIERO
                    </span>
                </button>
            </div>`
                const benefits = `
            <div class="andesnet-plans__card-benefits">
                <div class="card--benefits-item">
                    <img src="assets/img/andesnet-cards-benefits--1.svg" class="card--benefits-item-icon" alt="Icono de 100% Fibra Optica">
                    <p>100% Fibra Optica</p>
                </div>
                <div class="card--benefits-item">
                    <img src="assets/img/andesnet-cards-benefits--2.svg" class="card--benefits-item-icon" alt="Icono de Velocidad simétrica garantizada">
                    <p>Velocidad simétrica garantizada</p>
                </div>
                <div class="card--benefits-item">
                    <img src="assets/img/andesnet-cards-benefits--3.svg" class="card--benefits-item-icon" alt="Icono de Soporte 365">
                    <p>Soporte 365</p>
                </div>
            </div>`;
                content += `<div class="swiper-slide andesnet-plans__card ${(!dataC.prom_enabled ? 'no-promo' : '')}"> ${main + ribbon + price + benefits} </div>`;
            }
            return content;
        }

        load() {
            this.displayCards();
        }
    }

    new Cards().load();
};
