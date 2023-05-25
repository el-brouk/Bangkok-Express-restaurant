import createElement from '../assets/lib/create-element.js';
import escapeHtml from '../assets/lib/escape-html.js';

import Modal from './modal.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.addEventListeners();
  }

  addProduct(product) {  //добавление товара в корзину
    if (!product) return;
    let cartItem;
    let index = this.cartItems.findIndex(item => item.product.name == product.name);
    
    if(index > -1) {
      this.cartItems[index].count +=1;
      cartItem = this.cartItems[index];
    } else {
      cartItem = {'product':product, count:1};
      this.cartItems.push(cartItem);
      }
    
    this.onProductUpdate(cartItem);
    return this.cartItems;
  }

  updateProductCount(productId, amount) { //изменение количества товара в корзине
    let toDelete;
    
    let index = this.cartItems.findIndex(item => item.product.id == productId);
    if (index > -1) {
    this.cartItems[index].count += amount;
    toDelete = this.cartItems[index];
    }

    if (this.cartItems[index].count == 0) {
      toDelete = this.cartItems[index];
      this.cartItems.splice(index, 1);
    } 
   
    this.onProductUpdate(toDelete);
    
    return this.cartItems;
  }

  isEmpty() { //проверка пустоты корзины
    return (this.cartItems.length === 0);
  }

  getTotalCount() {  //общее количество товаров в корзине
    let quantity = this.cartItems.reduce((sum, current) => sum + current.count, 0)
    return quantity;
  }

  getTotalPrice() {  //стоимость всех товаров в корзине
    let total = this.cartItems.reduce((sum, current) => sum + (current.count * current.product.price), 0);
    return total;
  }

  renderProduct(product, count) { //верстка товара
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="../assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="../assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="../assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() { //верстка формы данных пользователя
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() { //открытие модального окна
    this.modal = new Modal();
    this.modal.setTitle("Your order");
    let body = createElement('<div></div>')
    for (let item of this.cartItems) {
      let elem = this.renderProduct(item.product, item.count);
      body.append(elem);
    }
    body.append(this.renderOrderForm());
    this.modal.setBody(body);
    this.modal.open();

    let updateProduct = (event) => {
      let target = event.target.closest('.cart-product');
      if (!target) return;
      let id = target.dataset.productId;
      if (event.target.closest('.cart-counter__button_minus')) {
        this.updateProductCount(id, -1);
      } else {
        this.updateProductCount(id, 1);
      }
    }
    this.modal.body.addEventListener('click', updateProduct);
    document.querySelector('.cart-form').addEventListener('submit',this.onSubmit);
   
    return this.modal;
    
  }

  onProductUpdate(itemToDelete) { //обновление верстки при изменении количества товара
    this.cartIcon.update(this);
    if (!(document.body.classList.contains('is-modal-open'))) return;
    
    let modalBody = this.modal.elem;
    if (this.isEmpty()) {
      this.modal.close();
      return;
    }
    
    let productId = itemToDelete.product.id;
    if (itemToDelete.count == 0) {
        modalBody.querySelector(`[data-product-id="${productId}"]`).innerHTML = '';
    } else { 
      let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      
      productCount.innerHTML = itemToDelete.count;
      productPrice.innerHTML = `€${(itemToDelete.product.price * itemToDelete.count).toFixed(2)}`;
    }

    let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

    infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

    }

  onSubmit = (event) => {  //отправка данных пользователя для размещения заказа
  
    event.preventDefault();

    document.querySelector('[type="submit"]').classList.add('.is-loading');

    let formData = new FormData(document.querySelector('.cart-form'));
    let responsePromise = fetch('https://httpbin.org/post', {
        method: 'POST',
        body: formData
      });
  
    responsePromise
      .then((response) => {
      
        console.log('Get Response', response);

        if (response.status == 200) {
          this.modal.setTitle("Success!"); //Заменить заголовок модального окна 
          this.cartItems = [];  //удаление товаров из корзины
          this.cartIcon.update(this);
           
          //Заменить содержимое тела модального окна на верстку:
          let newBody = createElement(`<div class="modal__body-inner">
              <p>
              Order successful! Your order is being cooked :) <br>
              We’ll notify you about delivery time shortly.<br>
              <img src="../assets/images/delivery.gif">
              </p>
              </div>
            `);
          this.modal.setBody(newBody);
        }
          
   /*   response.json()
        .then((json) => console.log(json));*/
    })
} 

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

