export default class Destinations {
  constructor() {
    this._destinations = {};
  }

  set destinations(destinations) {
    destinations.forEach(({name, description, pictures}) => {
      this._destinations[name] = {
        description,
        pictures,
      };
    });
  }

  get destinations() {
    return this._destinations;
  }
}
