import TripInfoView from '../view/trip-info';
import SortView from '../view/sort';
import PointListView from '../view/point-list';
import RouteView from '../view/route';
import CostView from '../view/cost';
import PointPresenter, {State as PointFormViewState} from './point';
import PointNewFormPresenter from './point-new-form';
import NoPointView from '../view/no-point';
import {render, RenderPosition, remove} from '../utils/render';
import {sortPointByDay, sortPointByPrice, sortPointByTime} from '../utils/common';
import {SortType, UpdateType, UserAction, FilterType, MenuItem} from '../const';
import {filter} from '../utils/filter';
import StatisticView from '../view/statistic';
import LoadingView from '../view/loading';

export default class Trip {
  constructor(tripContainer, tripListContainer, pointsModel, filterModel, menuModel, statisticContainer, newEventButton, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._menuModel = menuModel;
    this._newEventButton = newEventButton;
    this._statisticContainer = statisticContainer;
    this._isLoading = true;
    this._api = api;

    this._mainElement = tripContainer;
    this._tripListElement = tripListContainer;

    this._pointPresenter = new Map();

    this._filterType = FilterType.EVERYTHING;
    this._currentSortType = SortType.BY_DAY;

    this._loadingComponent = new LoadingView();

    this._sortComponent = null;
    this._noPointsComponent = null;
    this._tripInfoComponent = null;
    this._pointListComponent = null;
    this._statisticComponent = null;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._addObservers();
  }

  init() {
    this._renderTrip();
  }

  createPoint() {
    this._filterModel.setFilter(UpdateType.LIST, FilterType.EVERYTHING);

    if (this._menuModel.getMenuItem() === MenuItem.STATS) {
      this._menuModel.setMenuItem(UpdateType.REMOVE_STATS, MenuItem.TABLE);
    }

    this._currentSortType = SortType.BY_DAY;
    this._pointNewFormPresenter.init();
  }

  reloadList() {
    this._addObservers();
    this._renderTrip({resetSortType: true, onlyListUpdate: true});
  }

  destroyList() {
    this._removeObservers();
    this._clearTrip({resetSortType: true, onlyListUpdate: true});
  }

  _getPoints(isSortAndFilter = true) {
    this._filterType = (isSortAndFilter) ? this._filterModel.getFilter() : FilterType.EVERYTHING;
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[this._filterType](points);

    if (isSortAndFilter) {
      switch (this._currentSortType) {
        default:
        case SortType.BY_DAY:
          return filteredPoints.sort(sortPointByDay);
        case SortType.BY_TIME:
          return filteredPoints.sort(sortPointByTime);
        case SortType.BY_PRICE:
          return filteredPoints.sort(sortPointByPrice);
      }
    } else {
      return filteredPoints.sort(sortPointByDay);
    }
  }

  _renderInfo() {
    this._tripInfoComponent = new TripInfoView();

    render(this._mainElement, this._tripInfoComponent, RenderPosition.AFTER_BEGIN);
  }

  _renderList() {
    this._pointListComponent = new PointListView();

    render(this._tripListElement, this._pointListComponent, RenderPosition.BEFORE_END);
  }

  _addObservers() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._menuModel.addObserver(this._handleModelEvent);
  }

  _renderTrip({onlyListUpdate = false} = {}) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderList();
    this._pointNewFormPresenter = new PointNewFormPresenter(
      this._pointListComponent,
      this._handleViewAction,
      this._newEventButton,
      this._pointsModel.getDestinations(),
      this._pointsModel.getOffers(),
    );

    if (!this._getPoints().length) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints();

    if (!onlyListUpdate) {
      this._renderInfo();
      this._renderTripInfo();
    }
  }

  _renderNoPoints() {
    this._noPointsComponent = new NoPointView(this._filterType);
    render(this._tripListElement, this._noPointsComponent, RenderPosition.BEFORE_END);
  }

  _renderPoints() {
    this._getPoints().forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, this._pointsModel.getDestinations(), this._pointsModel.getOffers());
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderTripInfo() {
    const points = this._getPoints(false);
    const routeComponent = new RouteView(points);
    const costComponent = new CostView(points, this._pointsModel.getOffers());

    render(this._tripInfoComponent, routeComponent, RenderPosition.BEFORE_END);
    render(this._tripInfoComponent, costComponent, RenderPosition.BEFORE_END);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripListElement, this._sortComponent, RenderPosition.AFTER_BEGIN);
  }

  _renderLoading() {
    render(this._tripListElement, this._loadingComponent, RenderPosition.BEFORE_END);
  }

  _clearPoints() {
    this._pointPresenter.forEach((pointPresenter) => pointPresenter.destroy());
    this._pointPresenter.clear();
  }

  _removeObservers() {
    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _clearTrip({resetSortType = false, onlyListUpdate = false} = {}) {
    if (this._pointNewFormPresenter) {
      this._pointNewFormPresenter.destroy();
    }

    remove(this._noPointsComponent);

    this._clearPoints();

    remove(this._loadingComponent);
    remove(this._pointListComponent);
    remove(this._sortComponent);
    remove(this._pointListComponent);

    if (!onlyListUpdate) {
      remove(this._tripInfoComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.BY_DAY;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointFormViewState.SAVING);
        this._api.updatePoint(this._pointsModel.adaptToServer(update))
          .then((response) => {
            this._pointsModel.updatePoint(updateType, this._pointsModel.adaptToClient(response));
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointFormViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewFormPresenter.setSaving();
        this._api.addPoint(this._pointsModel.adaptToServer(update))
          .then((response) => {
            this._pointsModel.addPoint(updateType, this._pointsModel.adaptToClient(response));
          })
          .catch(() => {
            this._pointNewFormPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointFormViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointFormViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.POINT:
        this._pointPresenter.get(data.id).init(data, this._pointsModel.getDestinations(), this._pointsModel.getOffers());
        break;
      case UpdateType.LIST:
        this._clearTrip({resetSortType: true, onlyListUpdate: true});
        this._renderTrip({resetSortType: true, onlyListUpdate: true});
        break;
      case UpdateType.ALL:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.REMOVE_STATS:
        remove(this._statisticComponent);
        this.reloadList();
        break;
      case UpdateType.REMOVE_TABLE:
        this.destroyList();
        this._statisticComponent = new StatisticView(this._pointsModel.getPoints());
        render(this._statisticContainer, this._statisticComponent, RenderPosition.BEFORE_END);
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        this._clearTrip();
        this._renderTrip();
        this._newEventButton.enable();
        break;
    }
  }

  _handleModeChange() {
    this._pointNewFormPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }
}
