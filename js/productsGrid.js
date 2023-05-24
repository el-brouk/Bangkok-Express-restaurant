import createElement from '../../assets/lib/create-element.js';
import ProductCard from './productCard.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = this.render();
  }

  #productGridTemplate(products) {
    let outer = createElement(`
      <div class="products-grid">
      <div class="products-grid__inner">
      <!--ВОТ ТУТ БУДУТ КАРТОЧКИ ТОВАРОВ-->
      </div>
      </div>`);
    
    for (let product of products) {
      let inner = new ProductCard(product);
      outer.querySelector('.products-grid__inner').append(inner.elem);
    }
    return outer;  
  }

  updateFilter(filters) {
    let filtered = this.products;

    for (let key in this.filters) {
      if (!(key in filters)) {
        filters[key] = this.filters[key];
      }
    }

    if (filters.noNuts) {
      filtered = filtered.filter(item => 
       ((item.nuts == false) || ('nuts' in item) == false));
      // (item.nuts != ));
    } 
    if (filters.vegeterianOnly) {
      filtered = filtered.filter(item => 
        (item.vegeterian == true));
    }
    if (filters.maxSpiciness < 4) {
      filtered = filtered.filter(item => 
        (item.spiciness <= filters.maxSpiciness));
    }
    if (filters.category) {
      filtered = filtered.filter(item => 
        (item.category == filters.category));
    }
    
    this.elem = this.#productGridTemplate(filtered); 
    this.filters = filters;
    document.querySelector('.products-grid').replaceWith(this.elem);
    
    return (this.elem);
  }

  render() {
    const elem = this.#productGridTemplate(this.products);

    return elem;
  }
}
