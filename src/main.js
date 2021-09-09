import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import MenuPresenter from './presenter/menu';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import MenuModel from './model/menu';
import {generatePoint} from './mock/point';

const POINT_COUNT = 10;
const points = new Array(POINT_COUNT).fill(null).map(() => generatePoint());

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();
const menuModel = new MenuModel();

const mainElement = document.querySelector('.trip-main');
const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const newEventButtonElement = document.querySelector('.trip-main__event-add-btn');
const statisticContainer = document.querySelector('.page-main .page-body__container');

const newEventButtonAction = {
  enable: () => {
    newEventButtonElement.disabled = false;
  },
  disable: () => {
    newEventButtonElement.disabled = true;
  },
};

const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(mainElement, tripEventsElement, pointsModel, filterModel, menuModel, statisticContainer, newEventButtonAction);
const menuPresenter = new MenuPresenter(navigationElement, menuModel);

menuPresenter.init();
filterPresenter.init();
tripPresenter.init();

newEventButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
