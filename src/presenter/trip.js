import TripInfoView from '../view/trip-info';
import SortView from '../view/sort';
import PointListView from '../view/point-list';
import RouteView from '../view/route';
import CostView from '../view/cost';
import PointPresenter from './point';
import PointNewPresenter from './point-new';
import NoPointView from '../view/no-point';
import {render, RenderPosition, remove} from '../utils/render';
import {sortPointByDay, sortPointByPrice, sortPointByTime} from '../utils/common';
import {SortType, UpdateType, UserAction, FilterType, MenuItem} from '../const';
import {filter} from '../utils/filter';
import StatisticView from '../view/statistic';

export default class Trip {
  constructor(tripContainer, tripListContainer, pointsModel, filterModel, menuModel, statisticContainer, newEventButton) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._menuModel = menuModel;
    this._newEventButton = newEventButton;
    this._statisticContainer = statisticContainer;

    this._mainElement = tripContainer;
    this._tripListElement = tripListContainer;

    this._pointPresenter = new Map();

    this._filterType = FilterType.EVERYTHING;
    this._currentSortType = SortType.BY_DAY;

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
    this._pointNewPresenter.init();
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
    this._renderList();
    this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction, this._newEventButton);

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
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderTripInfo() {
    const points = this._getPoints(false);
    const routeComponent = new RouteView(points);
    const costComponent = new CostView(points);

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

  _clearPoints() {
    this._pointPresenter.forEach((pointPresenter) => pointPresenter.destroy());
    this._pointPresenter.clear();
  }

  _removeObservers() {
    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _clearTrip({resetSortType = false, onlyListUpdate = false} = {}) {
    if (this._pointNewPresenter) {
      this._pointNewPresenter.destroy();
      this._newEventButton.enable();
    }

    remove(this._noPointsComponent);

    this._clearPoints();

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
    console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    switch (updateType) {
      case UpdateType.POINT:
        this._pointPresenter.get(data.id).init(data);
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
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
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
