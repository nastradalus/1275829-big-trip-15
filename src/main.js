import MenuView from './view/menu';
import FilterView from './view/filter';
import TripPresenter from './presenter/trip';
import {generatePoint} from './mock/point';
import {render, RenderPosition} from './utils/render';

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill(null).map(() => generatePoint());

const mainElement = document.querySelector('.trip-main');
const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter(mainElement, tripEventsElement);

render(filtersElement, new FilterView(), RenderPosition.BEFORE_END);
render(navigationElement, new MenuView(), RenderPosition.BEFORE_END);

tripPresenter.init(points);
