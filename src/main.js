import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import MenuPresenter from './presenter/menu';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import MenuModel from './model/menu';
import DestinationsModel from './model/destinations';
import OffersModel from './model/offers';
import Api from './api';
import {UpdateType} from './const';

const AUTHORIZATION = 'Basic 1275829-big-trip-15';
const SERVER = 'https://15.ecmascript.pages.academy/big-trip';

const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel();
const api = new Api(SERVER, AUTHORIZATION);

const filterModel = new FilterModel();
const menuModel = new MenuModel();

const mainElement = document.querySelector('.trip-main');
const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const newEventButtonElement = document.querySelector('.trip-main__event-add-btn');
const statisticContainerElement = document.querySelector('.page-main .page-body__container');

const newEventButtonAction = {
  enable: () => {
    newEventButtonElement.disabled = false;
  },
  disable: () => {
    newEventButtonElement.disabled = true;
  },
};

newEventButtonAction.disable();

const menuPresenter = new MenuPresenter(navigationElement, menuModel, filterModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(mainElement, tripEventsElement, pointsModel, filterModel, menuModel, statisticContainerElement, newEventButtonAction, api);

newEventButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

menuPresenter.init();
filterPresenter.init();
tripPresenter.init();

Promise.all([
  api.getDestinations(),
  api.getOffers(),
  api.getPoints(),
])
  .then(([destinations, offers, points]) => {
    destinationsModel.destinations = destinations;
    offersModel.offers = offers;

    pointsModel.setDestinations(destinationsModel);
    pointsModel.setOffers(offersModel);
    pointsModel.setPoints(UpdateType.INIT, points.map((point) => pointsModel.adaptToClient(point)));
  });
