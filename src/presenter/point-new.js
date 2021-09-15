import PointFormView from '../view/point-form.js';
import {nanoid} from 'nanoid';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class PointNew {
  constructor(pointListContainer, changeData, newEventButton, destinations, offers) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._newEventButton = newEventButton;
    this._destinations = destinations;
    this._offers = offers;

    this._pointFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._pointFormComponent !== null) {
      return;
    }

    this._newEventButton.disable();
    this._pointFormComponent = new PointFormView(undefined, this._destinations, this._offers, true);
    this._pointFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._pointFormComponent, RenderPosition.AFTER_BEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointFormComponent === null) {
      return;
    }

    remove(this._pointFormComponent);
    this._pointFormComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(task) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.ALL,
      // Пока у нас нет сервера, который бы после сохранения
      // выдывал честный id задачи, нам нужно позаботиться об этом самим
      Object.assign({id: nanoid()}, task),
    );
    this._newEventButton.enable();
    this.destroy();
  }

  _handleDeleteClick() {
    this._newEventButton.enable();
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._newEventButton.enable();
      this.destroy();
    }
  }
}
