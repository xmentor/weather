    export default class WeatherStorage {
        constructor(storage = 'weather_app') {
            this.storage = storage;
        }
        save(data) {
            localStorage.setItem(this.storage, JSON.stringify(data));
        }
        load() {
            return JSON.parse(localStorage.getItem(this.storage));
        }
    };