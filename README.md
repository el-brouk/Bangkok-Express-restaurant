Bangkok-Express online-restaurant single-page site

The site consists of several components, each one is made as a JS class. Basic components are shown on the page immediately, while products are obtained from the server (using a Fetch request, in json format) and displayed on the page asynchronously (using async-await promises). Products on the page are filtered based on user-selected values, and communication between components occurs through user events.
The components are:
1. The "carousel" component. It receives an array of slides and creates the markup for the slides with the ability to switch slides using left-right arrows, hiding the switch buttons when reaching the edge slide, and generating a user event (adding a product to the cart) when clicking on "+".
2. The "ribbon menu" component, which receives an array of menu categories and creates the markup for a "ribbon" of links to the categories, with the ability to scroll (scrollBy) left and right when clicking on the forward/backward buttons (by a specified width), hiding the switch buttons when reaching the edge of the menu items (calculating the width of the remaining invisible area). When clicking on a menu item, a user event is generated (sorting the menu by the selected category).
3. The "slider" component for selecting the maximum spiciness of dishes. It receives an object with the number of steps and initial spiciness value, and creates the markup, moves the slider, and dynamically changes the value when clicked or dragged (Drag-and-Drop), generating a user event (sorting the menu by selected spiciness).
4. The "cart icon" component, which becomes visible when user adds at least one product to his cart and dissapears when there are no items left in the cart. It receives the total number of items and total price from the cart object. When scrolling the page, the shopping cart icon remains visible, it's positioning changes to position: fixed, and the icon moves along with the page.
5. The "product grid" component receives an array of product objects, creates the product card layout based on the "product card" component, filters products according to user-selected criteria, and displays only the filtered products.
6. The "product card" component, which receives a product object, renders a product element and generates a user event (adding a product to the cart) when clicking on "+".
7. The "cart" component, which stores products that user added to his cart. It has the option to add or remove products, and to send the order to the server using the Fetch Post method. The cart is an array of product objects. When the user clicks on the cart icon, a modal window based on the "modal window" component opens, displaying all products in the cart and a form for entering user data when placing an order.
8. The "modal window" component, which opens on top of the page and displays all products in the cart and a form for entering user data when placing an order.
