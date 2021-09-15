export default class Offers {
  constructor() {
    this._offers = {};
  }

  set offers(offersByType) {
    offersByType.forEach(({type, offers}) => {
      this._offers[type] = offers.map(
        ({title, price}, index) => (
          {
            code: index,
            title,
            price,
          }
        ));
    });
  }

  get offers() {
    return this._offers;
  }
}
