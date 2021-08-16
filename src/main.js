import TripInfoView from './view/trip-info';
import MenuView from './view/menu';
import FilterView from './view/filter';
import SortView from './view/sort';
import PointListView from './view/point-list';
import RouteView from './view/route';
import CostView from './view/cost';
import PointView from './view/point';
import PointFormView from './view/point-form';
import NoPointView from './view/no-point';
import {generatePoint} from './mock/point';
import {render, RenderPosition} from './utils';

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill(null).map(() => generatePoint());

const mainElement = document.querySelector('.trip-main');
const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const renderPoint = (pointListElement, point) => {
  const pointComponent = new PointView(point);
  const pointFormComponent = new PointFormView(point);

  render(pointListElement, pointComponent.getElement(), RenderPosition.BEFORE_END);

  const replacePointToForm = () => {
    pointListElement.replaceChild(pointFormComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    pointListElement.replaceChild(pointComponent.getElement(), pointFormComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointFormComponent.getElement().querySelector('form').addEventListener('submit', () => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointFormComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });
};

const renderTripInfo = (tripInfoElement, tripPoints) => {
  const routeComponent = new RouteView(tripPoints);
  const costComponent = new CostView(tripPoints);

  render(tripInfoElement, routeComponent.getElement(), RenderPosition.BEFORE_END);
  render(tripInfoElement, costComponent.getElement(), RenderPosition.BEFORE_END);
};

const renderTrip = (tripElement, tripListElement, tripPoints) => {
  if (tripPoints.length) {
    const tripInfoComponent = new TripInfoView();
    const sortComponent = new SortView();
    const pointListComponent = new PointListView();

    render(tripElement, tripInfoComponent.getElement(), RenderPosition.AFTER_BEGIN);
    render(tripListElement, sortComponent.getElement(), RenderPosition.BEFORE_END);
    render(tripListElement, pointListComponent.getElement(), RenderPosition.BEFORE_END);

    const tripInfoElement = tripElement.querySelector('.trip-info');
    const pointListElement = tripListElement.querySelector('.trip-events__list');

    renderTripInfo(tripInfoElement, tripPoints);

    tripPoints.forEach((tripPoint) => {
      renderPoint(pointListElement, tripPoint);
    });
  } else {
    render(tripEventsElement, new NoPointView().getElement(), RenderPosition.BEFORE_END);
  }
};

render(filtersElement, new FilterView().getElement(), RenderPosition.BEFORE_END);
render(navigationElement, new MenuView().getElement(), RenderPosition.BEFORE_END);

renderTrip(mainElement, tripEventsElement, points);
