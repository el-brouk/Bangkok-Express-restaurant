import createElement from '../assets/lib/create-element.js';

export default class Carousel {
  slides = [];
  
  constructor(slides) {
    this.slides = slides;
    this.elem = this.render();
    this.position = 0;
  }

  #carouselTemplate() {
    let outer = createElement(`
    <div class="carousel">
    <!--Кнопки переключения-->
    <div class="carousel__arrow carousel__arrow_right">
      <img src="../assets/images/icons/angle-icon.svg" alt="icon">
    </div>
    <div class="carousel__arrow carousel__arrow_left">
      <img src="../assets/images/icons/angle-left-icon.svg" alt="icon">
    </div>

    <div class="carousel__inner">
    </div>
    </div>`);

    for (let slide of this.slides) {
      let inner = createElement(`
      <div class="carousel__slide" data-id=${slide.id}>
      <img src="../assets/images/carousel/${slide.image}" class="carousel__img" alt="slide">
      <div class="carousel__caption">
      <span class="carousel__price">€${slide.price.toFixed(2)}</span>
      <div class="carousel__title">${slide.name}</div>
      <button type="button" class="carousel__button">
        <img src="../assets/images/icons/plus-icon.svg" alt="icon">
      </button>
      </div>
      </div>
      `);
    outer.querySelector('.carousel__inner').append(inner);
    }
  
    return outer;
  }  
  
    #onArrowClick = (event) => {
      let right = this.elem.querySelector('.carousel__arrow_right');
      let left = this.elem.querySelector('.carousel__arrow_left');
      let target = event.target.closest('div'); // где был клик?
      if (!(target == left || target == right)) return; // не на стрелке? тогда не интересует
      let width = this.elem.querySelector('.carousel__slide').offsetWidth;
      let maxWidth = width * (this.slides.length-1);
      
      this.position = changePos(this.position, target); // обнуляется!
      

      function changePos(position, target) { //проверка и изменение позиции
        if (target == right && position > -(maxWidth)) {
          position = position - width;
        } 
    
        if (target == left && position < 0) {
          position = position + width;
        } 
        return position;
      }
    
      let moveSlide = (newPos) => { //сдвиг слайда
        let view = this.elem.querySelector('.carousel__inner');
        let move = newPos + 'px';
        view.style.transform = `translateX( ${move})`; 
      };
    
      function hideArrow(pos) { //скрыть стрелки
        if (pos == 0) {
          left.style.display = 'none';
        } else {
          left.style.display = '';
        }
        if (pos == -(maxWidth)) {
          right.style.display = 'none';
        } else {
          right.style.display = '';
        }
      }

      moveSlide(this.position);
      hideArrow(this.position);
    }
  
  #chooseClick = (event) => {
    if (event.target.closest('.carousel__button')) {
      this.onButtonClick(event);
    } else this.#onArrowClick(event);
  }  
  
  onButtonClick = (event) => {
   let target = event.target.closest('.carousel__button');
    
   let buttonEvent = new CustomEvent("product-add", {
       bubbles: true,
       detail: target.parentNode.parentNode.dataset.id
   });
   this.elem.dispatchEvent(buttonEvent);
   }

  render() {
   const elem = this.#carouselTemplate(); 
    
   elem.querySelector('.carousel__arrow_left').style.display = 'none';
  
   elem.addEventListener('click', this.#chooseClick);
   return elem;
  }

}
