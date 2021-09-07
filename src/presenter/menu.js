import {MenuItem} from '../const';
import {remove, render, RenderPosition, replace} from '../utils/render';
import MenuView from '../view/menu';

export default class Menu {
  constructor(menuContainer) {
    this._menuContainer = menuContainer;
    this._menuComponent = null;
    this._activeItem = null;

    this._handleMenuClick = this._handleMenuClick.bind(this);
  }

  init(menuItem) {
    const prevMenuComponent = this._menuComponent;

    this._activeItem = menuItem;
    this._menuComponent = new MenuView(this._activeItem);

    this._menuComponent.setMenuClickHandler(this._handleMenuClick);

    if (prevMenuComponent === null) {
      render(this._menuContainer, this._menuComponent, RenderPosition.BEFORE_END);
      return;
    }

    replace(this._menuComponent, prevMenuComponent);
    remove(prevMenuComponent);
  }

  _handleMenuClick(menuItem) {
    console.log(menuItem);
    this.init(menuItem);
    switch (menuItem) {
      case MenuItem.TABLE:
        // Показать доску
        // Скрыть статистику
        break;
      case MenuItem.STATS:
        // Скрыть доску
        // Показать статистику
        break;
    }
  }
}
