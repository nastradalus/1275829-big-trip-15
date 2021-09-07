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
import {SortType, UpdateType, UserAction, FilterType} from '../const';
import {filter} from '../utils/filter';

export default class Trip {
  constructor(tripContainer, tripListContainer, pointsModel, filterModel, newEventButton) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._newEventButton = newEventButton;

    this._mainElement = tripContainer;
    this._tripListElement = tripListContainer;

    this._pointPresenter = new Map();

    this._filterType = FilterType.EVERYTHING;
    this._currentSortType = SortType.BY_DAY;

    this._sortComponent = null;
    this._noPointsComponent = null;
    this._tripInfoComponent = null;
    this._pointListComponent = null;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTrip();
  }

  createPoint() {
    this._currentSortType = SortType.BY_DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
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

  _clearTrip({resetSortType = false, onlyListUpdate = false} = {}) {
    if (this._pointNewPresenter) {
      this._pointNewPresenter.destroy();
      this._newEventButton.enable();
    }

    if (this._noPointsComponent) {
      remove(this._noPointsComponent);
    }

    this._clearPoints();

    if (this._pointListComponent) {
      remove(this._pointListComponent);
    }

    if (this._sortComponent) {
      remove(this._sortComponent);
    }

    if (this._pointListComponent) {
      remove(this._pointListComponent);
    }

    if (!onlyListUpdate) {
      if (this._tripInfoComponent) {
        remove(this._tripInfoComponent);
      }
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
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearTrip({resetSortType: true, onlyListUpdate: true});
        this._renderTrip({resetSortType: true, onlyListUpdate: true});
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearTrip();
        this._renderTrip();
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
