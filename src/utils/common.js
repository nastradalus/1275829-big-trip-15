import dayjs from 'dayjs';
import {DateFormat} from '../const';

const HOURS_ROUND = 60;
const DAYS_ROUND = 24;
const NUMBER_LIMIT_WITHOUT_ZERO = 10;

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

export const getRandomArrayElements = (array, maxCount = array.length - 1, minCount = 0) => {
  const count = getRandomInteger(Math.min(minCount, array.length - 1), Math.min(maxCount, array.length - 1));
  const shuffledArray = array.sort(() => 0.5 - Math.random());

  return shuffledArray.slice(0, count);
};

export const generateDatePeriod = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const maxTimeGap = 3 * 60;
  const timeGap = getRandomInteger(-maxTimeGap, maxTimeGap);
  const maxNextDateTimeGap = 1.5 * 60;
  const nextDateTimeGap = getRandomInteger(30, maxNextDateTimeGap);

  const dateStart = dayjs().add(daysGap, 'day').add(timeGap, 'minute').toDate();
  const dateEnd = dayjs(dateStart).add(nextDateTimeGap, 'minute').toDate();

  return {
    dateStart,
    dateEnd,
  };
};

export const formatDate = (date, format = DateFormat.FULL) => dayjs(date).format(format);

export const fillByZero = (number) => (number < NUMBER_LIMIT_WITHOUT_ZERO ? `0${number}` : number);

export const getTimeDuration = (start, end) => {
  const timeDifferences = [];
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const durationMinute = endDate.diff(startDate, 'minute') % HOURS_ROUND;
  const durationHour = endDate.diff(startDate, 'hour') % DAYS_ROUND;

  if (durationHour) {
    timeDifferences.push(`${fillByZero(durationHour)}H`);
  }

  if (durationMinute) {
    timeDifferences.push(`${fillByZero(durationMinute)}M`);
  }

  return timeDifferences.join(' ');
};

export const getRoutePeriod = (start, end) => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  return `${startDate.format(DateFormat.SHORT)}&nbsp;—&nbsp;${(startDate.get('month') !== endDate.get('month'))
    ? endDate.format(DateFormat.SHORT)
    : endDate.format(DateFormat.ONLY_DAY)}`;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const sortPointByDay = (point1, point2) => dayjs(point2.dateStart).diff(dayjs(point1.dateStart));

export const sortPointByTime = (point1, point2) => {
  const pointDuration1 = dayjs(point1.dateEnd).diff(dayjs(point1.dateStart));
  const pointDuration2 = dayjs(point2.dateEnd).diff(dayjs(point2.dateStart));

  return pointDuration2 - pointDuration1;
};

export const sortPointByPrice = (point1, point2) => point2.price - point1.price;
