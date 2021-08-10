import {createTripInfoTemplate} from './view/trip-info';
import {createMenuTemplate} from './view/menu';
import {createFilterTemplate} from './view/filter';
import {createSortTemplate} from './view/sort';
import {createPointListTemplate} from './view/point-list';
import {createRouteTemplate} from './view/route';
import {createCostTemplate} from './view/cost';
import {createPointTemplate} from './view/point';
import {createPointFormTemplate} from './view/point-form';
import {generatePoint} from './mock/point';

const POINT_COUNT = 20;
const POINTS = new Array(POINT_COUNT).fill(null).map(() => generatePoint());

const mainElement = document.querySelector('.trip-main');
const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const render = (container, content, place) => {
  container.insertAdjacentHTML(place, content);
};

render(mainElement, createTripInfoTemplate(), 'afterbegin');
render(navigationElement, createMenuTemplate(), 'beforeend');
render(filtersElement, createFilterTemplate(), 'beforeend');
render(tripEventsElement, createSortTemplate(), 'beforeend');
render(tripEventsElement, createPointListTemplate(), 'beforeend');

const tripInfoElement = mainElement.querySelector('.trip-info');
const pointListElement = tripEventsElement.querySelector('.trip-events__list');

render(tripInfoElement, createRouteTemplate(POINTS), 'beforeend');
render(tripInfoElement, createCostTemplate(POINTS), 'beforeend');
render(pointListElement, createPointFormTemplate(POINTS[0]), 'beforeend');

for (let i = 1; i < POINT_COUNT; i++) {
  render(pointListElement, createPointTemplate(POINTS[i]), 'beforeend');
}
