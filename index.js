document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function () {
    return {
      init() {
        axios
          .get('https://pizza-api.projectcodex.net/api/pizzas')
          .then((result) => {
            this.pizzas = result.data.pizzas;
          })
          .then(() => {
            return this.createCart();
          })
          .then((result) => {
            this.cartId = result.data.cart_code;
          })
          .catch((error) => {
            alert(error);
          });
      },
      featuredPizzas() {
        return axios.get('https://pizza-api.projectcodex.net/api/pizzas/featured');
      },
      postfeaturedPizzas() {
        return axios.post('https://pizza-api.projectcodex.net/api/pizzas/featured');
      },
      createCart() {
        return axios.get('https://pizza-api.projectcodex.net/api/pizza-cart/create?username=' + this.username);
      },
      showCart() {
        const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;

        axios
          .get(url)
          .then((result) => {
            this.cart = result.data;
          })
          .catch((error) => {
            alert(error);
          });
      },
      pizzaImage(pizza) {
        return `./images/p2.jpg`;
      },
      message: '',
      username: '',
      pizzas: [],
      featuredpizzas: [],
      cartId: '',
      cart: { total: 0 },
      paymentMessage: '',
      payNow: false,
      change:0.00,
      paymentAmount: 0,
      add(pizza) {
        const params = {
          cart_code: this.cartId,
          pizza_id: pizza.id,
        };

        axios
          .post('https://pizza-api.projectcodex.net/api/pizza-cart/add', params)
          .then(() => {
            this.message = "You added an item";
            this.showCart();
          })
          .then(() => {
            return this.featuredPizzas();
          })
          .then(() => {
            return this.postfeaturedPizzas();
          })
          .catch((error) => {
            alert(error);
          });
      },
      remove(pizza) {
        const params = {
          cart_code: this.cartId,
          pizza_id: pizza.id,
        };

        axios
          .post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', params)
          .then(() => {
            this.message = "You removed an item";
            this.showCart();
          })
          .catch((error) => {
            alert(error);
          });
      },
      pay(pizza) {
        const params = {
          cart_code: this.cartId,
        };

        axios
          .post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', params)
          .then(() => {
            if (!this.paymentAmount) {
              this.paymentMessage = 'Please enter an amount based on your purchase';
              setTimeout(() => {
                this.paymentMessage = '';
              }, 3000);
              
            } else if (this.paymentAmount >= this.cart.total) {
              change = this.paymentAmount - this.cart.total;
              this.paymentMessage = 'Payment Successfully! Enjoy your day';
              this.message = this.username + ", made a successful purchase for his/her order!";
              this.change = change;
              setTimeout(() => {
                this.cart.total = 0;
                window.location.reload();
              }, 5000);
            } else if (this.paymentAmount < this.cart.total) {
              this.paymentMessage = 'Please add a new card that has sufficient funds else you will die of hunger!';
            }
          })
          .catch((error) => {
            alert(error);
          });
      },
    };
  });
});
