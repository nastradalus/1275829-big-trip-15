import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import MenuPresenter from './presenter/menu';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import {generatePoint} from './mock/point';
import {MenuItem} from './const.js';

const POINT_COUNT = 1;
const points = new Array(POINT_COUNT).fill(null).map(() => generatePoint());

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const mainElement = document.querySelector('.trip-main');
const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const newEventButtonElement = document.querySelector('.trip-main__event-add-btn');

const newEventButtonAction = {
  enable: () => {
    newEventButtonElement.disabled = false;
  },
  disable: () => {
    newEventButtonElement.disabled = true;
  },
};

const menuPresenter = new MenuPresenter(navigationElement);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(mainElement, tripEventsElement, pointsModel, filterModel, newEventButtonAction);

menuPresenter.init(MenuItem.TABLE);
filterPresenter.init();
tripPresenter.init();

newEventButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  // newEventButtonElement.disabled = true;
  tripPresenter.createPoint();
});
