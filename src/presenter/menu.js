import {MenuItem, UpdateType} from '../const';
import {remove, render, RenderPosition, replace} from '../utils/render';
import MenuView from '../view/menu';

export default class Menu {
  constructor(menuContainer, menuModel) {
    this._menuContainer = menuContainer;
    this._menuModel = menuModel;

    this._menuComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleMenuClick = this._handleMenuClick.bind(this);

    this._menuModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevMenuComponent = this._menuComponent;

    this._menuComponent = new MenuView(this._menuModel.getMenuItem());
    this._menuComponent.setMenuClickHandler(this._handleMenuClick);

    if (prevMenuComponent === null) {
      render(this._menuContainer, this._menuComponent, RenderPosition.BEFORE_END);
      return;
    }

    replace(this._menuComponent, prevMenuComponent);
    remove(prevMenuComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleMenuClick(menuItem) {
    if (this._menuModel.getMenuItem() === menuItem) {
      return;
    }

    switch (menuItem) {
      case MenuItem.TABLE:
        this._menuModel.setMenuItem(UpdateType.REMOVE_STATS, menuItem);
        break;
      case MenuItem.STATS:
        this._menuModel.setMenuItem(UpdateType.REMOVE_TABLE, menuItem);
        break;
    }
  }
}
