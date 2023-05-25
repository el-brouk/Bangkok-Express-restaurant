import createElement from '../assets/lib/create-element.js';

export default class RibbonMenu {
  categories = [];

  constructor(categories) {
    this.categories = categories;
    this.elem = this.#render();
  }

  #menuTemplate() {
    let outer = createElement(`
    <div class="ribbon">
    <!--Кнопка прокрутки влево-->
    <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
    <img src="../assets/images/icons/angle-icon.svg" alt="icon">
    </button>
    <!--Ссылки на категории-->
    <nav class="ribbon__inner"></nav>
    <!--Кнопка прокрутки вправо-->
    <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
    <img src="../assets/images/icons/angle-icon.svg" alt="icon">
    </button>
    </div>`);

    for (let item of this.categories) {
      let inner = createElement(`
      <a href="#" class="ribbon__item" data-id=${item.id}>${item.name}</a>
      `);
      outer.querySelector('.ribbon__inner').append(inner);
    }
    outer.querySelector('.ribbon__item').classList.add('ribbon__item_active');
    outer.querySelector('.ribbon__inner').addEventListener('click', this.onButtonClick);
    
    outer.querySelector('.ribbon__arrow_left').addEventListener('click', this.#moveMenu);
    outer.querySelector('.ribbon__arrow_right').addEventListener('click', this.#moveMenu);

    return outer;
  }

  #moveMenu = (event) => {
    let right = this.elem.querySelector('.ribbon__arrow_right');
      let left = this.elem.querySelector('.ribbon__arrow_left');
      let target = event.target.closest('button'); // где был клик?
      if (!(target == left || target == right)) return; // не на стрелке? тогда не интересует
      let width = 350;
    
      //сдвиг меню
      let ribbonInner = this.elem.querySelector('.ribbon__inner');
      if (target == left) {
        ribbonInner.scrollBy(-width, 0);
      } else {
        ribbonInner.scrollBy(width, 0);
      }
    
      ribbonInner.addEventListener('scroll', this.checkArrow);
  }

  checkArrow = () => { //проверка стрелок
    let ribbonInner = this.elem.querySelector('.ribbon__inner');
    let left = this.elem.querySelector('.ribbon__arrow_left');
    let right = this.elem.querySelector('.ribbon__arrow_right');

    if (ribbonInner.scrollLeft == 0) { //левая стрелка
      left.classList.remove('ribbon__arrow_visible');
    } else {
      left.classList.add('ribbon__arrow_visible');
    }
    
    let scrollWidth = ribbonInner.scrollWidth;
    let scrollLeft = ribbonInner.scrollLeft;
    let clientWidth = ribbonInner.clientWidth;

    let scrollRight = scrollWidth - scrollLeft - clientWidth;
    
    if (scrollRight <= 1) { //правая стелка
      right.classList.remove('ribbon__arrow_visible');
    } else {
      right.classList.add('ribbon__arrow_visible');
    }
  }

  onButtonClick = (event) => {
    event.preventDefault();
    
    let target = event.target;
    //удаление активных классов
    let elements = this.elem.querySelectorAll('.ribbon__item');
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove('ribbon__item_active');
    }
    //выделение выбранной категории
    target.classList.add('ribbon__item_active');

    //генерация пользовательского события
   let buttonEvent = new CustomEvent('ribbon-select', {
       bubbles: true,
       detail: target.dataset.id
   });
   this.elem.dispatchEvent(buttonEvent);
   }


  #render() {
    const elem = this.#menuTemplate(); 
    return elem;
  }
}
