import WeatherRenderer from './WeatherRenderer';

class WeatherProvider {
    constructor(city = {}) {
        this.urlApi = 'http://api.openweathermap.org/data/2.5/weather';
        this.keyApi = '44474d9d409dc4313c91127230d0a569';
        this.id = city.id;
        this.getWeather(city.name);
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

export default WeatherProvider;