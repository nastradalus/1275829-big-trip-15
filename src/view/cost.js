const OBJECT_VALUE_INDEX = 1;

export const createCostTemplate = (points = []) => {
  const price = points.reduce((previousValue, currentPoint, index) =>
    (index === OBJECT_VALUE_INDEX)
      ? previousValue.price + currentPoint.price
      : previousValue + currentPoint.price);

  return `<p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>`;
};
