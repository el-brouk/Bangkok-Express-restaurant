import createElement from '../assets/lib/create-element.js';

export default class Modal {
  title = '';
  body = '';

  constructor(title, body) {
    this.title = title;
    this.body = body;
    this.elem = this.#render();
  }

  #modalTemplate() {
    let modal = createElement(`
    <div class="modal">
    <!--Прозрачная подложка перекрывающая интерфейс-->
    <div class="modal__overlay"></div>

    <div class="modal__inner">
      <div class="modal__header">
        <!--Кнопка закрытия модального окна-->
        <button type="button" class="modal__close">
          <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
        </button>

        <h3 class="modal__title">
        </h3>
      </div>

      <div class="modal__body">
      </div>
    </div>

  </div>`);
  return modal; 
  }

  open() {
    document.body.append(this.elem);
    document.body.classList.add('is-modal-open');
  }
  
  setTitle(value) {
    this.title = value;
    this.elem.querySelector('.modal__title').textContent = this.title;
  }

  setBody(value) {
    this.body = value;
    this.elem.querySelector('.modal__body').innerHTML = '';
    this.elem.querySelector('.modal__body').append(this.body);
  }

  close = () => {   
      this.elem.remove();
      document.body.classList.remove('is-modal-open');
      document.removeEventListener('keydown', this.#onEscapeClick);
  }

  #onCloseClick = (event) => {
    let target = event.target.closest('.modal__close');
    if (!target) return;
    this.close();
    }  
  
  #onEscapeClick = (event) => {
    if ((event.type == 'keydown') && (event.code != 'Escape')) return;
    this.close();
  }

  #render() {
    let elem = this.#modalTemplate();
    elem.addEventListener('click', this.#onCloseClick);
    document.addEventListener('keydown', this.#onEscapeClick);
    return elem;
  }
}
