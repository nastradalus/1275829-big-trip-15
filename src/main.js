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
import {render, RenderPosition, replace} from './utils/render';

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill(null).map(() => generatePoint());

const mainElement = document.querySelector('.trip-main');
const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const renderPoint = (pointListElement, point) => {
  const pointComponent = new PointView(point);
  const pointFormComponent = new PointFormView(point);

  render(pointListElement, pointComponent, RenderPosition.BEFORE_END);

  const replacePointToForm = () => {
    replace(pointFormComponent, pointComponent);
  };

  const replaceFormToPoint = () => {
    replace(pointComponent, pointFormComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.setClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointFormComponent.setSubmitHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointFormComponent.setClickHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });
};

const renderTripInfo = (tripInfoElement, tripPoints) => {
  const routeComponent = new RouteView(tripPoints);
  const costComponent = new CostView(tripPoints);

  render(tripInfoElement, routeComponent, RenderPosition.BEFORE_END);
  render(tripInfoElement, costComponent, RenderPosition.BEFORE_END);
};

const renderTrip = (tripMainElement, tripListElement, tripPoints) => {
  if (tripPoints.length) {
    const tripInfoComponent = new TripInfoView();
    const sortComponent = new SortView();
    const pointListComponent = new PointListView();

    render(tripMainElement, tripInfoComponent, RenderPosition.AFTER_BEGIN);
    render(tripListElement, sortComponent, RenderPosition.BEFORE_END);
    render(tripListElement, pointListComponent, RenderPosition.BEFORE_END);

    renderTripInfo(tripInfoComponent, tripPoints);

    tripPoints.forEach((tripPoint) => {
      renderPoint(pointListComponent, tripPoint);
    });
  } else {
    render(tripEventsElement, new NoPointView(), RenderPosition.BEFORE_END);
  }
};

render(filtersElement, new FilterView(), RenderPosition.BEFORE_END);
render(navigationElement, new MenuView(), RenderPosition.BEFORE_END);

renderTrip(mainElement, tripEventsElement, points);
