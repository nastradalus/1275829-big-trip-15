import {OFFERS, POINT_TYPE} from '../const';
import {getRandomArrayElements} from '../utils/common';

const generateTypeOffers = () => {
  const offersByType = {};

  POINT_TYPE.forEach((type) => {
    offersByType[type] = getRandomArrayElements(OFFERS);
  });

  return offersByType;
};

export const OFFERS_BY_TYPE = generateTypeOffers();
