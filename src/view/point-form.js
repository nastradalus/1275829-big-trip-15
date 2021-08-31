import {POINT_TYPE, DESTINATIONS, DateFormat} from '../const';
import {DESTINATIONS_INFO} from '../mock/destination';
import {formatDate} from '../utils/common';
import {OFFERS_BY_TYPE} from '../mock/offer';
import SmartView from './smart';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const DATEPICKER_24HOURS_PARAMETER = 'time_24hr';
const MIN_PRICE = 0;

const BLANK_POINT = {
  type: POINT_TYPE[0],
  destination: DESTINATIONS[0],
  dateStart: null,
  dateEnd: null,
  price: '',
  offers: [],
};

const createTypeTemplate = () =>
  POINT_TYPE.map((point) => `<div class="event__type-item">
    <input id="event-type-${point.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${point}">
    <label class="event__type-label  event__type-label--${point.toLowerCase()}" for="event-type-${point.toLowerCase()}-1">${point}</label>
  </div>`).join('');

const createDestinationTemplate = () =>
  DESTINATIONS.map((destination) => `<option value="${destination}"></option>`).join('');

const createOffersTemplate = (currentOffers, type) => {
  const typeOffers = OFFERS_BY_TYPE[type] ? OFFERS_BY_TYPE[type] : [];

  return typeOffers.length
    ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      ${typeOffers.map(({code, description, price}) => `<div class="event__available-offers">
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${code}-1" data-value="${code}"
                 type="checkbox" name="event-offer-${code}" ${currentOffers.includes(code) ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${code}-1">
            <span class="event__offer-title">${description}</span>
            +€&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`).join('')}
     </section>`
    : '';
};

const createDescriptionTemplate = (destination) => {
  const destinationInfo = DESTINATIONS_INFO[destination];

  return destinationInfo
    ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationInfo.description}</p>
          ${destinationInfo.photos ? `<div class="event__photos-container">
            <div class="event__photos-tape">
              ${destinationInfo.photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join('')}
            </div>
          </div>` : ''}
        </section>
      </section>`
    : '';
};

const checkDestination = (destination) => DESTINATIONS.includes(destination);

const correctPrice = (price) => price.replace(/^[0]*/, '');

const createPointFormTemplate = (data) => {
  const {type, destination, dateStart, dateEnd, price, offers} = data;
  const isSubmitDisabled = (!checkDestination(destination) || !dateStart || !dateEnd);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createTypeTemplate()}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createDestinationTemplate()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart ? formatDate(dateStart) : ''}">
          —
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd ? formatDate(dateEnd) : ''}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${createOffersTemplate(offers, type)}

        ${createDescriptionTemplate(destination)}
      </section>
    </form>
  </li>`;
};

export default class PointForm extends SmartView {
  constructor(point = BLANK_POINT) {
    super();

    this._data = PointForm.parsePointToData(point);
    this._startDatepicker = null;
    this._endDatepicker = null;

    this._clickHandler = this._clickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateStartInputHandler = this._dateStartInputHandler.bind(this);
    this._dateEndInputHandler = this._dateEndInputHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._dateStartChangeHandler = this._dateStartChangeHandler.bind(this);
    this._dateEndChangeHandler = this._dateEndChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);

    this._setInnerHandlers();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(this._data);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(PointForm.parseDataToPoint(this._data));
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('input[name=\'event-price\']')
      .addEventListener('change', this._priceChangeHandler);
    this.getElement()
      .querySelector('input[name=\'event-start-time\']')
      .addEventListener('input', this._dateStartInputHandler);
    this.getElement()
      .querySelector('input[name=\'event-end-time\']')
      .addEventListener('input', this._dateEndInputHandler);
    this.getElement()
      .querySelector('input[name=\'event-destination\']')
      .addEventListener('input', this._destinationInputHandler);
    this.getElement()
      .querySelectorAll('input[name*=\'event-offer\']')
      .forEach((field) => field.addEventListener('change', this._offersChangeHandler));
    this.getElement()
      .querySelectorAll('input[name=\'event-type\']')
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
      this.getElement().querySelector('input[name=\'event-start-time\']'),
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
      this.getElement().querySelector('input[name=\'event-end-time\']'),
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
      dateStart: userDate,
    });
  }

  _dateEndChangeHandler([userDate]) {
    this.updateData({
      dateEnd: userDate,
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
    const checkedCodes = [...this.getElement()
      .querySelectorAll('input[name*=\'event-offer\']:checked')]
      .map((field) => field.dataset.value);

    this.updateData({
      offers: checkedCodes,
    });
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();

    if (!checkDestination(evt.target.value)) {
      evt.target.setCustomValidity('The destination value can only be a value from the list.');
      evt.target.reportValidity();
    } else {
      evt.target.setCustomValidity('');
      evt.target.reportValidity();

      this.updateData({
        destination: evt.target.value,
      });
    }
  }

  getTemplate() {
    return createPointFormTemplate(this._data);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._clickHandler);
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  reset(point) {
    this.updateData(
      PointForm.parsePointToData(point),
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClickHandler(this._callback.click);
    this.setSubmitHandler(this._callback.submit);
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    return data;
  }
}

