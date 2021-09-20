import {getRoutePeriod} from '../utils/common';
import AbstractView from './abstract';

const MAX_POINT_COUNT_IN_ROUTE = 3;

const createRouteTemplate = (points = []) => {
  const route = points.length <= MAX_POINT_COUNT_IN_ROUTE
    ? points.map(({destination}) => destination).join(' — ')
    : `${points[0].destination}  — ... — ${points[points.length - 1].destination}`;

  const routePeriod = getRoutePeriod(points[0].dateStart, points[points.length - 1].dateEnd);

  return `<div class="trip-info__main">
      <h1 class="trip-info__title">${route}</h1>

      <p class="trip-info__dates">${routePeriod}</p>
    </div>`;
};

export default class Route extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createRouteTemplate(this._points);
  }
}

