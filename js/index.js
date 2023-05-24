import Carousel from './carousel.js';
import slides from './slides.js';

import RibbonMenu from './ribbonMenu.js';
import categories from './categories.js';

import StepSlider from './stepSlider.js';
import ProductsGrid from './productsGrid.js';

import CartIcon from './cartIcon.js';
import Cart from './cart.js';

export default class Main {

  constructor() {
  }

  renderBase = () => {
   //carousel 6.3
    this.carousel = new Carousel(slides);
    let spotCarousel = document.querySelector('[data-carousel-holder]');
    spotCarousel.append(this.carousel.elem);

    //ribbon 7.1
    this.ribbon = new RibbonMenu(categories);
    let spotRibbon = document.querySelector('[data-ribbon-holder]');
    spotRibbon.append(this.ribbon.elem);

    //slider 7.4
    this.slider = new StepSlider({steps: 5, value: 3});
    let spotSlider = document.querySelector('[data-slider-holder]');
    spotSlider.append(this.slider.elem);

    //cartIcon 8.1
    this.cartIcon = new CartIcon();
    let spotIcon = document.querySelector('[data-cart-icon-holder]');
    spotIcon.append(this.cartIcon.elem);

    //cart 8.4
    this.cart = new Cart(this.cartIcon);
  };

  //productsGrid 8.2
  renderProducts(products) {  
    this.grid = new ProductsGrid(products);
    let spotGrid = document.querySelector('[data-products-grid-holder]');
    spotGrid.innerHTML = '';
    spotGrid.append(this.grid.elem);
    this.products = products;

    this.grid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.slider.value,
      category: this.ribbon.value
    });
  }

  productAdd = (event) => {
    let productId = event.detail;
    let product = this.products.find(item => 
      (item.id == productId ));
    this.cart.addProduct(product);
  };

  updateSpiciness = (event) => {
    let value = event.detail;
    this.grid.updateFilter({
      maxSpiciness: value 
    });
  };

  selectRibbon = (event) => {
    let categoryId = event.detail;
    this.grid.updateFilter({
      category: categoryId 
    });
  };

  nutsControl = (event) => {
      this.grid.updateFilter({ noNuts: event.target.checked });
  };

  vegeterianControl = (event) => {
    this.grid.updateFilter({ vegeterianOnly: event.target.checked });
  };


  async render() {
  
    this.renderBase();

    let response = await fetch('products.json');
    if (response.ok) { 
      let products = await response.json();
      
      this.renderProducts(products); 

      document.body.addEventListener('product-add', this.productAdd);
      document.body.querySelector('.filters__slider').addEventListener('slider-change', this.updateSpiciness);
      document.body.querySelector('.ribbon').addEventListener('ribbon-select', this.selectRibbon);
   
      let noNutsControl = document.querySelector('#nuts-checkbox');
      noNutsControl.addEventListener('change',this.nutsControl);

      let vegetarianOnlyControl = document.querySelector('#vegeterian-checkbox');
      vegetarianOnlyControl.addEventListener('change', this.vegeterianControl);

    } else {
      console.log("Ошибка HTTP: " + response.status);
    }
  }

}


