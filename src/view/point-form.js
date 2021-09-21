import {POINT_TYPE, DateFormat} from '../const';
import {formatDate, formatDateToISO, getDefaultDate} from '../utils/common';
import SmartView from './smart';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import he from 'he';

const DATEPICKER_24HOURS_PARAMETER = 'time_24hr';
const MIN_PRICE = 0;
const PRICE_ERROR_MESSAGE = 'The destination value can only be a value from the list.';

const BLANK_POINT = {
  type: POINT_TYPE[0],
  destination: '',
  dateStart: null,
  dateEnd: null,
  price: '',
  offers: [],
  isFavorite: false,
};

const ButtonText = {
  SAVE: 'Save',
  SAVING: 'Saving...',
  DELETE: 'Delete',
  DELETING: 'Deleting...',
  CANCEL: 'Cancel',
};

const createTypeTemplate = () =>
  POINT_TYPE.map((point) => `<div class="event__type-item">
    <input id="event-type-${point.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${point}">
    <label class="event__type-label  event__type-label--${point.toLowerCase()}" for="event-type-${point.toLowerCase()}-1">${point}</label>
  </div>`).join('');

const createDestinationTemplate = (allDestinations) =>
  Object.keys(allDestinations).map((destination) => `<option value="${destination}"></option>`).join('');

const createOffersTemplate = (currentOffers, type, allOffers) => {
  const typeOffers = allOffers[type] ? allOffers[type] : [];

  return typeOffers.length
    ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      ${typeOffers.map(({code, title, price}) => `<div class="event__available-offers">
        <div class="event__offer-selector">
          <input class="event__offer-checkbox visually-hidden" id="event-offer-${code}" data-value="${code}"
                 type="checkbox" name="event-offer-${code}" ${currentOffers.includes(code) ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${code}">
            <span class="event__offer-title">${title}</span>
            +€&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`).join('')}
     </section>`
    : '';
};

const createDescriptionTemplate = (destination, allDestinations) => {
  const destinationInfo = allDestinations[destination];

  return destinationInfo
    ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationInfo.description}</p>
          ${destinationInfo.pictures ? `<div class="event__photos-container">
            <div class="event__photos-tape">
              ${destinationInfo.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
            </div>
          </div>` : ''}
        </section>
      </section>`
    : '';
};

const checkDestination = (destination, allDestinations) => Object.keys(allDestinations).includes(destination);

const correctPrice = (price) => +price.replace(/^[0]*/, '');

const createPointFormTemplate = (data, allDestinations, allOffers, isNewForm) => {
  const {type, destination, dateStart, dateEnd, price, offers} = data;
  const isSubmitDisabled = (!checkDestination(destination, allDestinations) || !dateStart || !dateEnd || !price || data.isDisabled);
  const resetButtonText = (isNewForm) ? ButtonText.CANCEL : ButtonText.DELETE;
  const arrowTemplate = (!isNewForm)
    ? `<button class="event__rollup-btn" type="button">
         <span class="visually-hidden">Open event</span>
       </button>`
    : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createTypeTemplate()}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination)}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createDestinationTemplate(allDestinations)}
          </datalist>
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time event__input--date-start" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart ? formatDate(dateStart) : ''}">
          —
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time event__input--date-end" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd ? formatDate(dateEnd) : ''}">
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${he.encode(price.toString())}">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>${data.isSaving ? ButtonText.SAVING : ButtonText.SAVE}</button>
        <button class="event__reset-btn btn" type="reset" ${data.isDisabled ? 'disabled' : ''}>${(data.isDeleting) ? ButtonText.DELETING : resetButtonText}</button>
        ${arrowTemplate}
      </header>
      <section class="event__details">
        ${createOffersTemplate(offers, type, allOffers)}

        ${createDescriptionTemplate(destination, allDestinations)}
      </section>
    </form>
  </li>`;
};

export default class PointForm extends SmartView {
  constructor(point, destinations, offers, isNewForm = false) {
    super();

    this._destinations = destinations;
    this._offers = offers;
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._isNewForm = isNewForm;

    if (point === undefined) {
      point = this._getDefaultPoint();
    }

    this._data = PointForm.parsePointToData(point);

    this._rowClickHandler = this._rowClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateStartInputHandler = this._dateStartInputHandler.bind(this);
    this._dateEndInputHandler = this._dateEndInputHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._dateStartChangeHandler = this._dateStartChangeHandler.bind(this);
    this._dateEndChangeHandler = this._dateEndChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPointFormTemplate(this._data, this._destinations, this._offers, this._isNewForm);
  }

  setRowClickHandler(callback) {
    this._callback.click = callback;
    if (!this._isNewForm) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rowClickHandler);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  reset(point) {
    this.updateData(
      PointForm.parsePointToData(point),
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setRowClickHandler(this._callback.click);
    this.setFormSubmitHandler(this._callback.submit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  removeElement() {
    super.removeElement();

    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
  }

  _getDefaultPoint() {
    return Object.assign(
      {},
      BLANK_POINT,
      {
        destination: Object.keys(this._destinations)[0],
        dateStart: getDefaultDate(),
        dateEnd: getDefaultDate(),
      },
    );
  }

  _rowClickHandler(evt) {
    evt.preventDefault();
    this._callback.click(this._data);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(PointForm.parseDataToPoint(this._data));
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._priceChangeHandler);
    this.getElement()
      .querySelector('.event__input--date-start')
      .addEventListener('input', this._dateStartInputHandler);
    this.getElement()
      .querySelector('.event__input--date-end')
      .addEventListener('input', this._dateEndInputHandler);
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('input', this._destinationInputHandler);
    this.getElement()
      .querySelectorAll('.event__offer-checkbox')
      .forEach((field) => field.addEventListener('change', this._offersChangeHandler));
    this.getElement()
      .querySelectorAll('.event__type-input')
      .forEach((field) => field.addEventListener('change', this._typeChangeHandler));
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(
      this.getElement().querySelector('.event__input--date-start'),
      {
        dateFormat: DateFormat.FLATPICKR,
        defaultDate: this._data.dateStart,
        enableTime: true,
        [DATEPICKER_24HOURS_PARAMETER]: true,
        onClose: this._dateStartChangeHandler,
      },
    );
  }

  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._endDatepicker = flatpickr(
      this.getElement().querySelector('.event__input--date-end'),
      {
        dateFormat: DateFormat.FLATPICKR,
        defaultDate: this._data.dateEnd,
        enableTime: true,
        [DATEPICKER_24HOURS_PARAMETER]: true,
        minDate: this._startDatepicker.selectedDates[0],
        onClose: this._dateEndChangeHandler,
      },
    );
  }

  _dateStartChangeHandler([userDate]) {
    this.updateData({
      dateStart: formatDateToISO(userDate),
    });
  }

  _dateEndChangeHandler([userDate]) {
    this.updateData({
      dateEnd: formatDateToISO(userDate),
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value !== '' ? correctPrice(evt.target.value) : MIN_PRICE,
    });
  }

  _dateStartInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      dateStart: evt.target.value,
    }, true);
  }

  _dateEndInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      dateEnd: evt.target.value,
    }, true);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();
    const checkedCodes = [...this.getElement().querySelectorAll('.event__offer-checkbox:checked')]
      .map((field) => +field.dataset.value);

    this.updateData({
      offers: checkedCodes,
    });
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();

    if (!checkDestination(evt.target.value, this._destinations)) {
      evt.target.setCustomValidity(PRICE_ERROR_MESSAGE);
      evt.target.reportValidity();
    } else {
      evt.target.setCustomValidity('');
      evt.target.reportValidity();

      this.updateData({
        destination: evt.target.value,
      });
    }
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointForm.parseDataToPoint(this._data));
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}

