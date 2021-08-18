import AbstractView from '../view/abstract';

export const RenderPosition = {
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
};

export const render = (container, element, place) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  switch (place) {
    case RenderPosition.AFTER_BEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFORE_END:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const replace = (newElement, oldElement) => {
  if (newElement instanceof AbstractView) {
    newElement = newElement.getElement();
  }

  if (oldElement instanceof AbstractView) {
    oldElement = oldElement.getElement();
  }

  const parent = oldElement ? oldElement.parentElement : null;

  if (parent === null || oldElement === null || newElement === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newElement, oldElement);
};
