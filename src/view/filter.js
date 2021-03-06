import AbstractView from './abstract';

const createFilterItemTemplate = (filter, currentFilterType, filtersAvailability) => {
  const {type, name, isAvailable} = filter;

  return `<div class="trip-filters__filter">
      <input id="filter-${type}"
             class="trip-filters__filter-input visually-hidden"
             type="radio"
             name="trip-filter"
             value="${type}"
             ${(!isAvailable && type !== currentFilterType) || !filtersAvailability ? 'disabled' : ''}
             ${type === currentFilterType ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
    </div>`;
};

const createFilterTemplate = (filterItems, currentFilterType, filtersAvailability) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType, filtersAvailability)).join('');

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType, filtersAvailability) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._filtersAvailabilty = filtersAvailability;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter, this._filtersAvailabilty);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement()
      .querySelectorAll('.trip-filters__filter-input')
      .forEach((field) => field.addEventListener('change', this._filterTypeChangeHandler));
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
