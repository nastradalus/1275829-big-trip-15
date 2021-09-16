import AbstractObserver from '../utils/abstract-observer.js';
import {formatDateToISO} from '../utils/common';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
    this._destinationsModel = null;
    this._offersModel = null;
  }

  setDestinations(destinations) {
    this._destinationsModel = destinations;
  }

  setOffers(offers) {
    this._offersModel = offers;
  }

  getDestinations() {
    return this._destinationsModel.destinations;
  }

  getOffers() {
    return this._offersModel.offers;
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  adaptToClient(point) {
    const allPointOffers = this.getOffers()[point.type];
    const pointOffers = [];

    point['offers'].forEach((offer) => {
      pointOffers.push(
        allPointOffers.find(({title}) => title === offer.title).code,
      );
    });

    const adaptedPoint = Object.assign(
      {},
      point,
      {
        price: point['base_price'],
        destination: point['destination'].name,
        dateStart: formatDateToISO(point['date_from']),
        dateEnd: formatDateToISO(point['date_to']),
        isFavorite: point['is_favorite'],
        offers: pointOffers,
      },
    );

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  adaptToServer(point) {
    const allPointOffers = this.getOffers()[point.type];
    const pointOffers = [];

    allPointOffers.forEach(({code, title, price}) => {
      if (point.offers.includes(code)) {
        pointOffers.push({title, price});
      }
    });

    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'base_price': point.price,
        'destination': Object.assign({}, this.getDestinations()[point.destination], {name: point.destination}),
        'date_from': formatDateToISO(point.dateStart),
        'date_to': formatDateToISO(point.dateEnd),
        'is_favorite': point.isFavorite,
        'offers': pointOffers,
      },
    );

    delete adaptedPoint.price;
    delete adaptedPoint.dateStart;
    delete adaptedPoint.dateEnd;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
