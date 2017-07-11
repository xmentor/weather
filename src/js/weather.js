(function() {
    'use strict';
    function getTime(type = 'long') {
        const date = new Date();
        if(type !== 'short') {
            return String(date);
        }
        const formatDate = new Intl.DateTimeFormat('en', {
            hour: 'numeric',
            minute: 'numeric',
            weekday: 'long',
            month: 'long',
            year: 'numeric',
            hour12: true
        });
        return formatDate.format(date);
    }
    function convertKelvinToCelsius(kelvins) {
        return Math.round(kelvins - 273.15);
    }
    function convertSpeedWind(speed) {
        return Math.round(speed * 3.6);
    }

    class Storage {
        constructor(storage = '_app') {
            this.storage = storage;
        }
        save(data) {
            localStorage.setItem(this.storage, JSON.stringify(data));
        }
        load() {
            return JSON.parse(localStorage.getItem(this.storage)) || [];
        }
    }
    
    class WeatherRenderer {
        constructor(data, id) {
            this.id = id;
            this.addWeatherToBody(data);
        }
        weatherTemplate(data) {
            const weatherContainer = document.createElement('article');
            
            weatherContainer.classList.add('weather');
            weatherContainer.tabIndex = 0;
            weatherContainer.dataset.id = this.id;
            
            weatherContainer.innerHTML = `<button class="weather__remove">
                                                <img src="img/close.svg" alt="Remove">
                                            </button>
                                            <h2 class="weather__location">
                                                ${data.name}, ${data.sys.country}
                                            </h2>
                                            <div class="weather__date">
                                                <time datetime="${getTime()}">
                                                    ${getTime('short')}
                                                </time>
                                            </div>
                                            <div class="weather__description">
                                                ${data.weather[0].main}
                                            </div>
                                            <div class="weather__row">
                                                <div class="weather__information information">
                                                    <img src="img/weather/${data.weather[0].icon}.svg" alt="" width="100">
                                                    <div class="information__temperature temperature">
                                                        <span class="temperature__value">
                                                            ${convertKelvinToCelsius(data.main.temp)}
                                                        </span>
                                                        <span class="temperature__deg">
                                                            &deg;C<span class="visuallyhidden">elsius</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <dl class="weather__details details">
                                                    <div class="details__row">
                                                        <dt class="details__label">
                                                            Humidity
                                                        </dt>
                                                        <dd class="details__value">
                                                            ${data.main.humidity}%
                                                        </dd>
                                                    </div>
                                                    <div class="details__row">
                                                        <dt class="details__label">
                                                            Wind
                                                        </dt>
                                                        <dd class="details__value">
                                                            ${convertSpeedWind(data.wind.speed)} km/h
                                                        </dd>
                                                    </div>
                                                    <div class="details__row">
                                                        <dt class="details__label">
                                                            <abbr title="Maximum">Max.</abbr> temperature
                                                        </dt>
                                                        <dd class="details__value">
                                                            ${convertKelvinToCelsius(data.main.temp_max)}&deg;C<span class="visuallyhidden">elsius</span>
                                                        </dd>
                                                    </div>
                                                    <div class="details__row">
                                                        <dt class="details__label">
                                                            <abbr title="Minimum">Min.</abbr> temperature
                                                        </dt>
                                                        <dd class="details__value">
                                                            ${convertKelvinToCelsius(data.main.temp_min)}&deg;C<span class="visuallyhidden">elsius</span>
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>`;
            
            return weatherContainer;
        }
        addWeatherToBody(data) {
            const weathersContainer = document.querySelector('.main');
            weathersContainer.appendChild(this.weatherTemplate(data));
        }
    }

    class WeatherProvider {
        constructor(city, id) {
            this.urlApi = 'http://api.openweathermap.org/data/2.5/weather';
            this.keyApi = '44474d9d409dc4313c91127230d0a569';
            this.id = id;
            this.getWeather(city);
        }
        getWeather(city) {
            const encodeValue = encodeURIComponent(city);
            if(!window.fetch) {
                throw Error('Sorry, your browser does not support Fetch API.');
            }
            fetch(`${this.urlApi}?q=${encodeValue}&appid=${this.keyApi}`)
            .then((response) => {
                if(!response.ok) {
                    throw Error('Ups, we have not connection :(');
                }
                const contentType = response.headers.get('content-type');
                if(contentType === null && contentType.indexOf('application/json') === -1) {
                    throw Error('We want JSON data!');
                }
                return response.json();
            })
            .then((json) => {
                if(json.cod !== 200) {
                    throw Error('Something is wrong :/ Try later.');
                }
                new WeatherRenderer(json, this.id);
            })
            .catch((e) => {
                throw Error(e.message);
            });
        }
    }

    class WeatherApp {
        constructor() {
            this.storage = new Storage('weather2');
            this.initEvents();
            this.init();
        }
        init() {
            const cites = this.storage.load();
            if(cites.length < 1) {
                return false;
            }
            cites.forEach((data) => {
                new WeatherProvider(data.nameCity, data.idCity);
            });
        }
        initEvents() {
            this.modalEvents();
            this.addWeatherEvent();
            this.refreshButtonEvent();
            this.removeWeatherEvent();
        }
        modalEvents() {
            const modalOpenBtn = document.querySelector('.menu__button_add');
            const modalCloseBtn = document.querySelector('.modal__close');
            const modal = document.querySelector('.modal');
            modalOpenBtn.addEventListener('click', () => {
                if(modal.classList.contains('modal_open')) {
                    return false;
                }
                modal.classList.add('modal_open');
                modal.focus();
            });
            modalCloseBtn.addEventListener('click', () => {
                modal.classList.remove('modal_open');
                modal.blur();
            });
            document.addEventListener('keydown', (e) => {
                const escKey = 27;
                if((e.keyCode === escKey) && modal.classList.contains('modal_open')) {
                    modal.classList.remove('modal_open');
                    modal.blur();
                }
            });
        }
        addWeatherEvent() {
            const formModal = document.querySelector('.modal__form');
            formModal.addEventListener('submit', (e) => {
                const cityName = document.querySelector('.form__input_city').value;
                const countryCode = document.querySelector('.form__input_code').value;
                const city = (countryCode === '') ? cityName : `${cityName},${countryCode}`;
                const cites = this.storage.load();
                const id = Date.now();
                /* http://stackoverflow.com/a/25677072 */
                if(/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(cityName)) {
                    new WeatherProvider(city, id);

                    formModal.parentNode.classList.remove('modal_open');
                    cites.push({nameCity: city, idCity: id});
                    this.storage.save(cites);
                }
                
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
                const newListCites = cites.filter((data) => {
                    return data.idCity !== id;
                });
                
                element.remove();
                this.storage.save(newListCites);
            }, false);
        }
    }
    new WeatherApp();
}());