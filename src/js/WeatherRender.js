    export default class WeatherRender {
        constructor(data) {
            this.addWeather(data);
        }
        weatherTemplate(data) {
            const weatherContainer = document.createElement('div');
            weatherContainer.classList.add('weather');
            weatherContainer.innerHTML = `<div class="weather__location">
                                                ${data.name}, ${data.sys.country}
                                            </div>
                                            <div class="weather__date">
                                                <time>
                                                    ${convertTime(data.dt)}
                                                </time>
                                            </div>
                                            <div class="weather__desc">
                                                ${data.weather[0].main}
                                            </div>
                                            <div class="weather__present present">
                                                <div class="present__visual visual">
                                                    <img src="img/weather/${data.weather[0].icon}.svg" alt="${data.weather[0].description}" class="visual__img">
                                                    <div class="visual__temperature temperature">
                                                        <span class="temperature__num">
                                                            ${convertKelvinToCelsius(data.main.temp)}
                                                        </span>
                                                        <span class="temperature__deg">&deg;C</span>
                                                    </div>
                                                </div>
                                                <div class="present__desc desc">
                                                    <div class="desc__humidity">
                                                        Humidity: <span class="desc__value">${data.main.humidity}%</span>
                                                    </div>
                                                    <div class="desc__wind">
                                                        Wind: <span class="desc__value">
                                                                ${convertSpeedWind(data.wind.speed)} km/h
                                                              </span>
                                                    </div>
                                                    <div class="desc__max-temp">
                                                        Max. temperature: 
                                                        <span class="desc__value">
                                                            ${convertKelvinToCelsius(data.main.temp_max)}&deg;C
                                                        </span>
                                                    </div>
                                                    <div class="desc__min-temp">
                                                        Min. temperature: 
                                                        <span class="desc__value">
                                                            ${convertKelvinToCelsius(data.main.temp_min)}&deg;C
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>`;
            
            return weatherContainer;
        }
        addWeather(data) {
            if(data.length < 1) {
                return false;
            }
            const weathersContainer = document.querySelector('.main');
            weathersContainer.appendChild(this.weatherTemplate(data));
        }
    };
    function convertTime(miliseconds) {
        const date = new Date(miliseconds * 1000);
        return date + date.getTimezoneOffset();
    }
    function convertKelvinToCelsius(kelvins) {
        return Math.round(kelvins - 273.15);
    }
    function convertSpeedWind(speed) {
        return Math.round(speed * 3.6);
    }
    