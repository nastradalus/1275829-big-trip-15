import AbstractObserver from '../utils/abstract-observer.js';
import {getDateFromServerFormat} from "../utils/common";

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
    this._destinations = {};
    this._offers = {};
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getDestinations() {
    return this._destinations;
  }

  getOffers() {
    return this._offers;
  }

  setPoints(points) {
    this._points = points.slice();
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
    const index = this._points.findIndex((task) => task.id === update.id);

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
    const allPointOffers = this._offers[point.type];
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
        dateStart: getDateFromServerFormat(point['date_from']),
        dateEnd: getDateFromServerFormat(point['date_to']),
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
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'base_price': point.price,
        'destination': point.price,
        'date_from': point.price,
        'date_to': point.price,
        'is_favorite': point.price,
        'offers': point.price,
      },
    );

    delete adaptedPoint.price;
    delete adaptedPoint.dateStart;
    delete adaptedPoint.dateEnd;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
