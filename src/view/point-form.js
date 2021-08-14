import {POINT_TYPE, DESTINATIONS} from '../const';
import {DESTINATIONS_INFO} from '../mock/destination';
import {createElement, formatDate} from '../utils';
import {OFFERS_BY_TYPE} from '../mock/offer';

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
  const currentOfferCodes = currentOffers.map(({code}) => code);

  return OFFERS_BY_TYPE[type].length
    ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      ${OFFERS_BY_TYPE[type].map(({code, description, price}) => `<div class="event__available-offers">
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${code}-1"
                 type="checkbox" name="event-offer-${code}" ${currentOfferCodes.includes(code) ? 'checked' : ''}>
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

const createPointFormTemplate = (point) => {
  const {type, destination, dateStart, dateEnd, price, offers} = point;

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
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateStart ? formatDate(dateEnd) : ''}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
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

export default class PointForm {
  constructor(point = BLANK_POINT) {
    this._point = point;
    this._element = null;
  }

  _getTemplate() {
    return createPointFormTemplate(this._point);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

