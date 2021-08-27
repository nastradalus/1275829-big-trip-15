import TripInfoView from '../view/trip-info';
import SortView from '../view/sort';
import PointListView from '../view/point-list';
import RouteView from '../view/route';
import CostView from '../view/cost';
import PointPresenter from './point';
import NoPointView from '../view/no-point';
import {render, RenderPosition} from '../utils/render';
import {sortPointByDay, sortPointByPrice, sortPointByTime, updateItem} from '../utils/common';
import {SortType} from '../const';

export default class Trip {
  constructor(tripContainer, tripListContainer) {
    this._mainElement = tripContainer;
    this._tripListElement = tripListContainer;

    this._pointPresenter = new Map();
    this._currentSortType = SortType.BY_DAY;

    this._tripInfoComponent = new TripInfoView();
    this._sortComponent = new SortView();
    this._pointListComponent = new PointListView();
    this._noPointsComponent = new NoPointView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripPoints) {
    this._points = tripPoints;

    if (this._points.length) {
      this._renderTrip();
      this._renderTripInfo();
      this._sortPoints(this._currentSortType);
      this._renderPoints();
    } else {
      this._renderNoPoints();
    }
  }

  _renderTrip() {
    render(this._mainElement, this._tripInfoComponent, RenderPosition.AFTER_BEGIN);
    render(this._tripListElement, this._sortComponent, RenderPosition.BEFORE_END);
    render(this._tripListElement, this._pointListComponent, RenderPosition.BEFORE_END);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoPoints() {
    render(this._tripListElement, this._noPointsComponent, RenderPosition.BEFORE_END);
  }

  _renderPoints() {
    this._points.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderTripInfo() {
    const routeComponent = new RouteView(this._points);
    const costComponent = new CostView(this._points);

    render(this._tripInfoComponent, routeComponent, RenderPosition.BEFORE_END);
    render(this._tripInfoComponent, costComponent, RenderPosition.BEFORE_END);
  }

  _clearPoints() {
    this._pointPresenter.forEach((pointPresenter) => pointPresenter.destroy());
    this._pointPresenter.clear();
  }

  _sortPoints(sortType) {
    switch (sortType) {
      default:
      case SortType.BY_DAY:
        this._points.sort(sortPointByDay);
        break;
      case SortType.BY_TIME:
        this._points.sort(sortPointByTime);
        break;
      case SortType.BY_PRICE:
        this._points.sort(sortPointByPrice);
        break;
    }

    this._currentSortType = sortType;
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPoints();
    this._renderPoints();
  }
}
