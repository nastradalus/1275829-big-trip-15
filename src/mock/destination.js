import {DESCRIPTIONS, DESTINATIONS} from '../const';
import {getRandomArrayElements, getRandomInteger} from '../utils';

const generatePhotos = () => new Array(getRandomInteger(0, 15)).fill(null).map(() => `http://picsum.photos/248/152?r=${getRandomInteger(0, 255)}`);

const generateDestinations = () => {
  const destinationsInfo = {};

  DESTINATIONS.forEach((destination) => {
    if (getRandomInteger(0, 1)) {
      destinationsInfo[destination] = {
        description: getRandomArrayElements(DESCRIPTIONS, 5, 1).join(' '),
        photos: generatePhotos(),
      };
    }
  });

  return destinationsInfo;
};

export const DESTINATIONS_INFO = generateDestinations();
