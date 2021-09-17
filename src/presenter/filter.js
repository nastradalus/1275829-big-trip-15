import FilterView from '../view/filter.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {FilterType, UpdateType} from '../const.js';
import {isFuturePoint} from '../utils/common';

const FilterName = {
  [FilterType.EVERYTHING]: 'Everything',
  [FilterType.FUTURE]: 'Future',
  [FilterType.PAST]: 'Past',
};

export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters(this._pointsModel.getPoints());
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFORE_END);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.LIST, filterType);
  }

  _getFilters(points) {
    return [
      {
        type: FilterType.EVERYTHING,
        name: FilterName[FilterType.EVERYTHING],
        isAvailable: points.length,
      },
      {
        type: FilterType.FUTURE,
        name: FilterName[FilterType.FUTURE],
        isAvailable: points.filter(({dateStart}) => isFuturePoint(dateStart)).length,
      },
      {
        type: FilterType.PAST,
        name: FilterName[FilterType.PAST],
        isAvailable: points.filter(({dateEnd}) => !isFuturePoint(dateEnd)).length,
      },
    ];
  }
}
