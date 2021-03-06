import dayjs from 'dayjs';
import {DateFormat, POINT_TYPE, StatisticType} from '../const';

const HOURS_ROUND = 60;
const DAYS_ROUND = 24;
const MONTH_ROUND = 30;
const NUMBER_LIMIT_WITHOUT_ZERO = 10;
const TYPE_COUNT_INCREMENT = 1;
const MAP_VALUE_INDEX = 1;

export const formatDate = (date, format = DateFormat.FULL) => dayjs(date).format(format);

export const fillByZero = (number) => (number < NUMBER_LIMIT_WITHOUT_ZERO ? `0${number}` : number);

export const getTimeDuration = (start, end) => {
  const timeDifferences = [];
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const durationMinute = endDate.diff(startDate, 'minute') % HOURS_ROUND;
  const durationHour = endDate.diff(startDate, 'hour') % DAYS_ROUND;
  const durationDays = endDate.diff(startDate, 'day') % MONTH_ROUND;

  if (durationDays) {
    timeDifferences.push(`${durationDays}D`);
  }

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

export const sortPointByDay = (point1, point2) => dayjs(point1.dateStart).diff(dayjs(point2.dateStart));

export const sortPointByTime = (point1, point2) => {
  const pointDuration1 = dayjs(point1.dateEnd).diff(dayjs(point1.dateStart));
  const pointDuration2 = dayjs(point2.dateEnd).diff(dayjs(point2.dateStart));

  return pointDuration2 - pointDuration1;
};

export const formatDateToISO = (date) => dayjs(date).toISOString();

export const getDefaultDate = () => (formatDateToISO(dayjs()));

export const sortPointByPrice = (point1, point2) => point2.price - point1.price;

export const isFuturePoint = (date) => (dayjs(date).diff(dayjs()) >= 0);

export const formatStatisticValue = (type, value) => {
  switch (type) {
    case StatisticType.MONEY:
      return `€ ${value}`;
    case StatisticType.TYPE:
      return `${value}x`;
    case StatisticType.TIME:
      return getTimeDuration(0, value);
  }
};

export const sortMap = (map) => (
  new Map([...map.entries()].sort((value1, value2) => value2[MAP_VALUE_INDEX] - value1[MAP_VALUE_INDEX]))
);

export const getStatistic = (points) => {
  const Statistic = {
    [StatisticType.MONEY]: new Map(),
    [StatisticType.TYPE]: new Map(),
    [StatisticType.TIME]: new Map(),
  };

  POINT_TYPE.forEach((type) => {
    Statistic[StatisticType.MONEY].set(type, 0);
    Statistic[StatisticType.TYPE].set(type, 0);
    Statistic[StatisticType.TIME].set(type, 0);
  });

  points.forEach(({price, type, dateStart, dateEnd}) => {
    const moneyStats = Statistic[StatisticType.MONEY];
    const typeStats = Statistic[StatisticType.TYPE];
    const timeStats = Statistic[StatisticType.TIME];

    moneyStats.set(type, +moneyStats.get(type) + price);
    typeStats.set(type, +typeStats.get(type) + TYPE_COUNT_INCREMENT);
    timeStats.set(type, +timeStats.get(type) + (dayjs(dateEnd) - dayjs(dateStart)));
  });

  return {
    [StatisticType.MONEY]: sortMap(Statistic[StatisticType.MONEY]),
    [StatisticType.TYPE]: sortMap(Statistic[StatisticType.TYPE]),
    [StatisticType.TIME]: sortMap(Statistic[StatisticType.TIME]),
  };
};
