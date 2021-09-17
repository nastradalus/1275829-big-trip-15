export const POINT_TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const DateFormat = {
  ONLY_DATE: 'YYYY-MM-DD',
  ONLY_TIME: 'HH:mm',
  ONLY_DAY: 'D',
  FULL: 'DD/MM/YY HH:mm',
  FLATPICKR: 'd/m/y H:i',
  SHORT: 'MMM D',
  DATETIME: 'YYYY-MM-DDTHH:mm',
  SERVER_DATE: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
};

export const SortType = {
  BY_DAY: 'sort-day',
  BY_TIME: 'sort-time',
  BY_PRICE: 'sort-price',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  POINT: 'POINT',
  LIST: 'LIST',
  ALL: 'ALL',
  REMOVE_STATS: 'REMOVE_STATS',
  REMOVE_TABLE: 'REMOVE_TABLE',
  NEW_EVENT: 'NEW_EVENT',
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const MenuItem = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};

export const StatisticType = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME: 'TIME',
};
