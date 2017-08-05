class LocalStorage {
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

export default LocalStorage;