import getTime from './getTime';
import convertKelvinToCelsius from './convertKelvinToCelsius';
import convertSpeedWind from './convertSpeedWind';

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

export default WeatherRenderer;