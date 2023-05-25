import createElement from '../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
    return this.elem;
  }

  update(cart) {  //обновление иконки
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() { //позиционирование на экране
    if (!this.elem.offsetHeight || !this.elem.offsetWidth) return;

    if (!this.initialTopCoord) {
      this.initialTopCoord = this.elem.getBoundingClientRect().top + window.scrollY;
    }

    if (window.pageYOffset > this.initialTopCoord) {
      // плавающая корзина
      let posFromContainer = document.querySelector('.container').getBoundingClientRect().right + 20;
      let posFromEdge = document.documentElement.clientWidth - this.elem.offsetWidth - 10;
      let newXPos = Math.min(posFromEdge, posFromContainer);
      
      Object.assign(this.elem.style, {
          position: 'fixed',
          top: '50px',
          left: `${newXPos}px`,
          zIndex: 1e3,
        });

    } else {
      // корзина сверху
      Object.assign(this.elem.style, {
        position: '',
        top: '',
        left: '',
        zIndex: ''
      });
    }
    //мобильные
    let isMobile = document.documentElement.clientWidth <= 767;
    if (isMobile) {
      Object.assign(this.elem.style, {
          position: '',
          top: '',
          left: '',
          zIndex: ''
        });
    }
  }
}
