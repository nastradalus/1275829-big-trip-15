import {createElement, getRoutePeriod} from '../utils';

const MAX_POINT_COUNT_IN_ROUTE = 3;

const createRouteTemplate = (points = []) => {
  const routePoints = [];
  const startDates = [];
  const endDates = [];
  let lastPoint = '';

  points.forEach((point) => {
    startDates.push(point.dateStart);
    endDates.push(point.dateEnd);

    if (point.destination !== lastPoint) {
      routePoints.push(point.destination);
      lastPoint = point.destination;

      return point.destination;
    }
  });

  const route = routePoints.length <= MAX_POINT_COUNT_IN_ROUTE
    ? routePoints.join(' — ')
    : `${routePoints[0]}  — ... — ${routePoints[routePoints.length - 1]}`;

  const routePeriod = getRoutePeriod(Math.min(...startDates), Math.max(...endDates));

  return `<div class="trip-info__main">
      <h1 class="trip-info__title">${route}</h1>

      <p class="trip-info__dates">${routePeriod}</p>
    </div>`;
};

export default class Route {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  _getTemplate() {
    return createRouteTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

