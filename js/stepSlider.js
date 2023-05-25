import createElement from '../assets/lib/create-element.js';

export default class StepSlider {
  
  constructor({ steps, value = 2 }) {
    this.steps = steps;
    this.value = value;
    this.elem = this.#render();
  }

  #sliderTemplate() {
    let percentage = this.value / (this.steps-1) * 100;
   
    let outer = createElement(`
    <!--Корневой элемент слайдера-->
  <div class="slider">

    <!--Ползунок слайдера с активным значением-->
    <div class="slider__thumb" style="left: ${percentage}%;">
      <span class="slider__value">${this.value}</span>
    </div>

    <!--Заполненная часть слайдера-->
    <div class="slider__progress" style="width: ${percentage}%;"></div>

    <!--Шаги слайдера-->
    <div class="slider__steps">
    </div>
  </div>`);

    for (let i = 0; i < this.steps; i++) {
      let inner = createElement(`<span></span>`);
      if (i == this.value) {
        inner.classList.add('slider__step-active');
      }
      outer.querySelector('.slider__steps').append(inner);
    }
    
   return outer;
  }

  #moveSlider = (event) => {
    
    let sliderPos = this.elem.getBoundingClientRect();
    let target = event.clientX;
    let currentPos = target - sliderPos.x;
    let oneStep = sliderPos.width / (this.steps-1);
    this.value = Math.round(currentPos / oneStep);
     //получение процентов:
    let percentage = this.value / (this.steps-1) * 100;

    let temp = this.elem.querySelector('.slider__steps'); //удаление предыдущих активных классов
    for (let i = 0; i < this.steps; i++) {
      if (temp.childNodes[i+1].classList.contains('slider__step-active')) {
        temp.childNodes[i+1].classList.remove('slider__step-active');
      }
    }
    this.#changeValues(percentage);
  }
  
#changeValues(percentage) {
    //изменения значений
    this.elem.querySelector('.slider__value').textContent= this.value;
    this.elem.querySelector('.slider__steps').childNodes[this.value+1].classList.add('slider__step-active');
    this.elem.querySelector('.slider__thumb').style = `left: ${percentage}%`; 
    this.elem.querySelector('.slider__progress').style = `width: ${percentage}%`;

    let sliderChange = new CustomEvent('slider-change', { // имя события должно быть именно 'slider-change'
      detail: this.value, // значение 0, 1, 2, 3, 4
      bubbles: true // событие всплывает - это понадобится в дальнейшем
    });
    this.elem.dispatchEvent(sliderChange);
}
  
  
  
  #onPointer = (event) => {
    let thumb = this.elem.querySelector('.slider__thumb'); 
    thumb.ondragstart = () => false; //выключить встроенный браузерный Drag-and-Drop
    thumb.style = 'touch-action: none';
    
    
    //подготовить к перемещению
      thumb.style.position = 'absolute';
      thumb.style.zIndex = 1000;
      
      let sliderPos = this.elem.getBoundingClientRect();
      let progress = this.elem.querySelector('.slider__progress');
      this.elem.classList.add('slider_dragging');
      

      let moveAt = (clientX) => { //двигать 
      
        let temp = this.elem.querySelector('.slider__steps'); //удаление предыдущих активных классов
        for (let i = 0; i < this.steps; i++) {
          if (temp.childNodes[i+1].classList.contains('slider__step-active')) {
            temp.childNodes[i+1].classList.remove('slider__step-active');
          }
        }

        let percentage = (clientX - sliderPos.x) / sliderPos.width * 100;
        if (percentage > 100) percentage = 100
        if (percentage < 0) percentage = 0
        
        thumb.style.left = `${percentage}%`;
        progress.style.width = `${percentage}%`;

        this.value = Math.round(percentage / 100 * (this.steps-1));
        this.elem.querySelector('.slider__value').textContent= this.value;
        this.elem.querySelector('.slider__steps').childNodes[this.value+1].classList.add('slider__step-active');
    };

    moveAt(event.clientX);

    document.addEventListener('pointermove', onMove); //слушать событие

    function onMove(event) { 
      moveAt(event.clientX);
    }

    stop = () => {  
      document.removeEventListener('pointermove', onMove);
      thumb.onpointerup = null;
      this.onPointerUp();
    }; 

    thumb.addEventListener('pointerup', stop); //слушать завершение события
    
  }; 

  
  onPointerUp = () => { //окончание движения
   
    this.elem.classList.remove('slider_dragging');

    let sliderChange = new CustomEvent('slider-change', { 
      detail: this.value, 
      bubbles: true 
    });
    this.elem.dispatchEvent(sliderChange);
  };

  #render() {
    let elem = this.#sliderTemplate();
    elem.addEventListener('pointerdown', this.#onPointer);
    elem.addEventListener('click', this.#moveSlider);
    return elem;
  }
}
