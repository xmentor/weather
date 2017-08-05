import LocalStorage from './LocalStorage';
import City from './City';
import WeatherProvider from './WeatherProvider';

class WeatherApp {
    constructor() {
        this.storage = new LocalStorage('weather2');
        this.initEvents();
        this.init();
        this.activedElement = null;
    }
    init() {
        const cites = this.storage.load();
        if(cites.length < 1) {
            return false;
        }
        cites.forEach((city) => {
            new WeatherProvider(city);
        });
    }
    initEvents() {
        this.modalEvents();
        this.addWeatherEvent();
        this.refreshButtonEvent();
        this.removeWeatherEvent();
    }
    updateStatus(msg) {
        const status = document.querySelector('.status');
        status.textContent = msg;    
    }
    modalEvents() {
        const modalOpenBtn = document.querySelector('.menu__button_add');
        const modalCloseBtn = document.querySelector('.modal__close');
        const modal = document.querySelector('.modal');
        modalOpenBtn.addEventListener('click', () => {
            if(modal.classList.contains('modal_open')) {
                return false;
            }
            this.activedElement = document.activeElement;

            modal.classList.add('modal_open');
            modal.focus();
        });
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.remove('modal_open');

            this.activedElement.focus();
        });
        document.addEventListener('keydown', (e) => {
            const escKey = 27;
            if((e.keyCode === escKey) && modal.classList.contains('modal_open')) {
                modal.classList.remove('modal_open');

                this.activedElement.focus();
            }
        });
    }
    cityNameIsValid(city) {
        const rules = {
            /* http://stackoverflow.com/a/25677072 */
            name: /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/,
            length: /^.{1,}/
        };
        for(const rule in rules) {
            if(rules.hasOwnProperty(rule)) {
                if(!rules[rule].test(city)) {
                    return false;
                }
            }
        }
        return true;
    }
    countryCodeIsValid(code) {
        // standard ISO 639-1
        const codeRule = /^[a-z]{0,2}$/i;
        if(!codeRule.test(code)) {
            return false;
        }
        return true;
    }
    addWeatherEvent() {
        const formModal = document.querySelector('.modal__form');
        formModal.addEventListener('submit', (e) => {
            const cityName = document.querySelector('.form__input_city');
            const nameIsValid = this.cityNameIsValid(cityName.value);
            if(nameIsValid) {
                const countryCode = document.querySelector('.form__input_code').value;
                
                const id = Date.now();
                const name = (countryCode !== '' && this.countryCodeIsValid(countryCode)) ? `${cityName.value},${countryCode}` : cityName.value;
                const newCity = new City({
                    id,
                    name
                });

                new WeatherProvider(newCity);

                formModal.parentNode.classList.remove('modal_open');
                
                this.activedElement.focus();
                
                const cites = this.storage.load();
                cites.push(newCity);
                
                this.storage.save(cites);
                
                this.updateStatus(`Added weather from ${name}`);
            } else {
                cityName.focus();
                this.updateStatus('Invalid city name or the field is empty');
            }
            cityName.setAttribute('aria-invalid', !nameIsValid)
            e.preventDefault();
        });
    }
    refreshButtonEvent() {
        const refreshBtn = document.querySelector('.menu__button_refresh');
        const main = document.querySelector('.main');
        refreshBtn.addEventListener('click', () => {
            main.innerHTML = '';
            this.init();
        });
    }
    removeWeatherEvent() {
        const weathersContainer = document.querySelector('.main');
        weathersContainer.addEventListener('click', (e) => {
            const t = e.target;
            let element = null;
            if(t.classList.contains('weather__remove')) {
                element = t.parentNode;
            } else if(t.classList.contains('remove__img')) {
                element = t.parentNode.parentNode;
            } else {
                return false;
            }

            const cites = this.storage.load();
            const id = Number(element.dataset.id);
            const newListCites = cites.filter((city) => {
                return city.id !== id;
            });
            const removed = cites.filter((city) => {
                return city.id === id;
            });

            element.remove();
            this.storage.save(newListCites);
            this.updateStatus(`Removed weather from ${removed[0].name}`);

            const weather = weathersContainer.querySelector('.weather');
            if(weather) {
                weather.focus();
            }

        }, false);
    }
}

export default WeatherApp;