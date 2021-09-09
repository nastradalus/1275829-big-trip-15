import {FilterType} from '../const';
import {isFuturePoint} from './common';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.dateStart)),
  [FilterType.PAST]: (points) => points.filter((point) => !isFuturePoint(point.dateEnd)),
};
