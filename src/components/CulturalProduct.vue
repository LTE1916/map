<template>
  <div id="product">
    <!-- 左侧菜单部分 -->
    <div class="sidebar">
      <h2>文创购买</h2>
      <ul>
        <li v-for="product in products" :key="product.id" @click="selectProduct(product)">
          {{ product.name }}
        </li>
      </ul>
      <div class="payment-bar">
        <button @click="viewCart">购物车</button>
        <button @click="checkout">付款</button>
      </div>

      <!-- 购物车弹窗部分 -->
      <teleport to="body">
        <el-dialog v-model="cartDialogVisible" title="购物车">
          <div v-if="cart.length > 0">
            <div v-for="(item, index) in cart" :key="index">
              {{ item.name }}：{{ item.quantity }} 个，单价 {{ item.price }} 元
            </div>
            <div style="margin-top: 10px; font-weight: bold;">
              总价格：{{ calculateTotalPrice() }} 元
            </div>
          </div>
          <p v-else>购物车为空</p>
        </el-dialog>
      </teleport>
    </div>

    <!-- 右侧内容部分 -->
    <div class="main-content">
      <div v-if="selectedProduct">
        <h2>{{ selectedProduct.type }}</h2>
        <div class="menu">
          <div v-for="item in selectedProduct.menu" :key="item.id" class="menu-item">
            <img :src="item.photoUrl" alt="文创照片">
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p>{{ item.price }} 元</p>
              <div class="quantity-control">
                <button class="quantity-btn" @click="decreaseQuantity(item)">-</button>
                <span class="quantity-number">{{ getCartItemQuantity(item) }}</span>
                <button class="quantity-btn" @click="increaseQuantity(item)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="select-message">请选择一个文创种类</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      selectedProduct: null,
      cart: [],
      cartDialogVisible: false,
    };
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$request.get('/product')
          .then((res) => {
            if (res.code === "200" && res.data) {
              this.products = this.transformData(res.data);
              console.log("产品数据已加载:", this.products);
            } else {
              console.error("加载产品数据时出错:", res);
            }
          })
          .catch((error) => {
            console.error("发起请求时出错:", error);
          });
    },
    transformData(data) {
      const transformedData = {};

      data.forEach(item => {
        if (!transformedData[item.type]) {
          transformedData[item.type] = [];
        }
        transformedData[item.type].push({
          id: item.id,
          name: item.name,
          price: item.price,
          photoUrl: item.photoUrl,
        });
      });

      return Object.keys(transformedData).map(type => ({
        id: type,
        name: type,
        menu: transformedData[type],
      }));
    },
    selectProduct(product) {
      this.selectedProduct = product;
    },
    decreaseQuantity(item) {
      const cartItem = this.getCartItem(item);
      if (cartItem && cartItem.quantity > 0) {
        cartItem.quantity--;
      }
    },

    increaseQuantity(item) {
      const cartItem = this.getCartItem(item);
      if (cartItem) {
        cartItem.quantity++;
      } else {
        this.addToCart(item);
      }
    },

    addToCart(item) {
      const existingCartItem = this.getCartItem(item);

      if (existingCartItem) {
        existingCartItem.quantity++;
      } else {
        this.cart.push({
          id: item.id,
          quantity: 1,
          name: item.name,
          price: item.price,
        });
      }
    },
    viewCart() {
      this.cartDialogVisible = true;
      console.log("查看购物车");
    },
    checkout() {
      console.log("付款");
    },
    getCartItem(item) {
      return this.cart.find(cartItem => cartItem.id === item.id);
    },
    getCartItemQuantity(item) {
      const cartItem = this.getCartItem(item);
      return cartItem ? cartItem.quantity : 0;
    },
    calculateTotalPrice() {
      return this.cart.reduce((total, cartItem) => {
        return total + cartItem.quantity * cartItem.price;
      }, 0);
    },
  },
};
</script>

<style>
#product {
  display: flex;
  background: linear-gradient(to right, var(--el-color-primary-light-8), #BC8F8F);
}

.sidebar {
  width: 25%;
  background-color: rgba(240, 240, 240, 0.8); /* 设置透明度的背景颜色 */
  padding: 20px;
  height: 95vh;
  display: flex;
  flex-direction: column;
}

.sidebar h2 {
  margin-bottom: 20px;
  font-size: 3em;
  color: #333;
  text-align: center; /* 居中对齐 */
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  flex-grow: 1;
}

.sidebar li {
  cursor: pointer;
  margin-bottom: 10px; /* 调整按钮之间的垂直间距 */
  padding: 10px 15px; /* 调整按钮内部上下左右的内边距 */
  background-color: #ddd;
  border-radius: 5px;
  transition: background-color 0.3s;
  font-size: 1.2em; /* 调整按钮内文字的大小 */
  text-align: center; /* 让按钮内文字水平居中 */
}


.sidebar li:hover {
  background-color: #ccc;
}

.main-content {
  width: 75%;
  height: 100%;
  box-sizing: border-box; /* 如果有 padding 的话，保证宽高包含 padding */
  padding: 20px; /* 调整根据你的需要的 padding 大小 */
}


.menu {
  display: flex;
  flex-wrap: wrap;
  margin-right: -10px;
}

.menu-item {
  width: 30%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-right: 20px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.menu-item:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.menu-item img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.item-details {
  padding: 10px;
  box-sizing: border-box; /* 如果有 padding 的话，保证宽高包含 padding */
  width: 100%; /* 与图片宽度一致 */
  align-items: center; /* 让子元素在交叉轴上居中 */
  text-align: center; /* 如果内容需要水平居中 */
}

button {
  cursor: pointer;
  background-color: var(--el-color-primary-light-8);
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: var(--el-color-primary-light-8);
}

.select-message {
  font-size: 1.2em;
  color: #333333;
}

.quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn {
  cursor: pointer;
  background-color: #BC8F8F;
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.quantity-btn:hover {
  background-color: #BC8F8F;
}

.quantity-number {
  margin: 0 10px; /* 调整按钮和数字之间的距离 */
  font-size: 1.2em;
}
.payment-bar {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.payment-bar button {
  cursor: pointer;
  background-color: #BC8F8F;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s;
  font-size: 1.2em;
}

.payment-bar button:hover {
  background-color: #BC8F8F;
}
</style>
