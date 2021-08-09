import {POINT_TYPE, DESTINATIONS} from '../const';
import {generateDatePeriod, getRandomArrayElement, getRandomArrayElements, getRandomInteger} from '../utils';
import {OFFERS_BY_TYPE} from './offer';

const generateType = () => getRandomArrayElement(POINT_TYPE);
const generateDestination = () => getRandomArrayElement(DESTINATIONS);

export const generatePoint = () => {
  const type = generateType();
  const destination = generateDestination();
  const {dateStart, dateEnd} = generateDatePeriod();

  return {
    type,
    destination,
    dateStart,
    dateEnd,
    price: getRandomInteger(300, 1500),
    offers: getRandomArrayElements(OFFERS_BY_TYPE[type]),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
