import {formatDate, getTimeDuration} from '../utils';
import {DateFormat} from '../const';

const FAVORITE_CLASS = 'event__favorite-btn--active';

const createOffersTemplate = (offers) =>
  offers.length
    ? `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offers.map(({description, price}) => `<li class="event__offer">
           <span class="event__offer-title">${description}</span>
            +€&nbsp;
           <span class="event__offer-price">${price}</span>
         </li>`).join('')}
      </ul>`
    : '';

export const createPointTemplate = (point) => {
  const {dateStart, dateEnd, type, destination, price, offers, isFavorite} = point;
  const duration = getTimeDuration(dateStart, dateEnd);
  const offersTemplate = createOffersTemplate(offers);
  const favoriteClassName = isFavorite ? FAVORITE_CLASS : '';

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${formatDate(dateStart, DateFormat.ONLY_DATE)}">${formatDate(dateStart, DateFormat.SHORT)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatDate(dateStart, DateFormat.DATETIME)}">${formatDate(dateStart, DateFormat.ONLY_TIME)}</time>
          —
          <time class="event__end-time" datetime="${formatDate(dateEnd, DateFormat.DATETIME)}">${formatDate(dateEnd, DateFormat.ONLY_TIME)}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        €&nbsp;<span class="event__price-value">${price}</span>
      </p>
      ${offersTemplate}
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
