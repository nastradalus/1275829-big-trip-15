import PointView from '../view/point';
import PointFormView from '../view/point-form';
import {remove, render, RenderPosition, replace} from '../utils/render';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(pointListComponent, changeData, changeMode) {
    this._pointListComponent = pointListComponent;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point, destinations, offers) {
    this._point = point;
    this._destinations = destinations;
    this._offers = offers;

    const prevPointComponent = this._pointComponent;
    const prevPointFormComponent = this._pointFormComponent;

    this._pointComponent = new PointView(this._point, this._offers);
    this._pointFormComponent = new PointFormView(this._point, this._destinations, this._offers);

    this._pointComponent.setClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointFormComponent.setClickHandler(this._handleFormSubmit);
    this._pointFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevPointFormComponent === null) {
      render(this._pointListComponent, this._pointComponent, RenderPosition.BEFORE_END);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointFormComponent, prevPointFormComponent);
    }

    remove(prevPointComponent);
    remove(prevPointFormComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointFormComponent);
  }

  _replacePointToForm() {
    replace(this._pointFormComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointFormComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._pointFormComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleFormSubmit(update) {
    const isMajorUpdate = (update.dateStart !== this._point.dateStart)
      || (update.dateEnd !== this._point.dateEnd)
      || (update.price !== this._point.price)
      || (update.destination !== this._point.destination);

    this._changeData(
      UserAction.UPDATE_POINT,
      isMajorUpdate ? UpdateType.ALL : UpdateType.POINT,
      update,
    );
    this._replaceFormToPoint();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.POINT,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _handleDeleteClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.ALL,
      point,
    );
  }
}
