import { defineStore } from "pinia";
import { ref } from "vue";

import { useProductsStore } from "./products";
import { useMapsStore } from "./maps";
import { api } from "src/boot/axios";

import { useAuthStore } from "./auth";
import { useNotifyStore } from "./notifications";

export const useOrdersStore = defineStore("orders", {
  state: () => ({
    orders: [],
    invalidOrders: [],
    ordersAddress: [],
    meta: {
      pageNo: ref(-1),
      pageSize: ref(0),
      totalProducts: ref(0),
      totalPage: ref(0),
      lastPage: ref(false),
    },
    productList: new Map(),
    total: ref(0),
    orderTable: [],
    addressOptions: [],
    finalOrder: {},
    totalPrice: 0,
    rows: ref([]),
    filter: ref(""),
    loading: ref(false),
    pagination: ref({
      sortBy: "id",
      descending: false,
      page: 0,
      rowsPerPage: 5,
      rowsNumber: 10,
    }),
    productsOrders: [],
    factureRows: [],
  }),

  getters: {
    getOrderById(state) {
      return (orderId) => state.orders.find((order) => order.id == orderId);
    },
    getInvalidOrderById(state) {
      return (orderId) =>
        state.invalidOrders.find((order) => order.id == orderId);
    },
    getProductOrderById(state) {
      return (productId) =>
        state.productsOrders.find((product) => product.id == productId);
    },
    isSelected(state) {
      return (productId) => state.productList.has(productId);
    },
    numberProduct(state) {
      return (productId) => state.productList.get(productId);
    },
    getOrderTable(state) {
      return state.orderTable;
    },
    getAddressOptions(state) {
      return state.addressOptions;
    },
    canBeSent(state) {
      return state.orderTable.length > 0;
    },
    getOrderAddressById(state) {
      return (addressId) =>
        state.ordersAddress.find((address) => address.id == addressId);
    },
    exitOrder(state) {
      return (id) => state.orders.find((order) => order.id == id) != null;
    },
  },

  actions: {
    async getAllOrders(pageNum, pageSize, sortBy, sortDir, filter) {
      if (
        pageNum != undefined &&
        pageSize != undefined &&
        sortBy != undefined &&
        sortDir != undefined
      ) {
        try {
          const config = {
            headers: null,
            params: {
              pageNum: pageNum,
              pageSize: pageSize,
              sortBy: sortBy,
              sortDir: sortDir == true ? `asc` : `desc`,
              filter: filter,
            },
          };
          const auth = useAuthStore();
          const data = await (
            await api.get(`/my-orders/${auth.me.id}`, config)
          ).data;
          this.orders = data.content;
          console.log(this.orders);
          this.setAddressOrders();
          this.setProductsOrders();
          this.meta.pageNo = data.pageNo;
          this.meta.pageSize = data.pageSize;
          this.meta.totalProducts = data.totalProducts;
          this.meta.totalPage = data.totalPage;
          this.meta.lastPage = data.lastPage;
        } catch (error) {
          console.log(error);
        }
      }
    },
    setAddressOrders() {
      const notify = useNotifyStore();
      this.orders.forEach((order) => {
        this.ordersAddress.push(order.address);
        if (order.state == 0 && this.getInvalidOrderById(order.id) == null) {
          console.log("LLega aquiiiiiiiiiiiiiii");
          this.setInvalidOrder(order);
          notify.incrementNotificationCount();
          notify.notifySystem(order);
        }
      });
    },
    setProductsOrders() {
      this.orders.forEach((order) => {
        this.getProductsByOrder(order.id);
      });
    },
    async getProductsByOrder(orderId) {
      try {
        const data = await (await api.get(`/products/orders/${orderId}`)).data;
        console.log(data);
        this.productsOrders.push(...data);
      } catch (error) {
        console.log(error);
      }
    },
    prepareFactureOrder(orderId) {
      const order = this.getOrderById(orderId);
      const rows = [];
      console.log(this.productsOrders);
      this.factureRows = [];
      Object.keys(order.products).forEach((key) => {
        const product = this.getProductOrderById(key);
        console.log(product);
        const value = {
          product: product.name,
          price: product.price,
          amount: order.products[key],
          total: product.price * order.products[key],
        };
        this.factureRows.push(value);
      });
      console.log(rows);
    },
    async onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      // console.log(page, rowsPerPage, sortBy, descending);

      this.loading = true;

      // get all rows if "All" (0) is selected
      const fetchCount =
        rowsPerPage === 0 ? this.pagination.value.rowsNumber : rowsPerPage;

      // calculate starting row of data
      const startRow = page - 1; //* rowsPerPage;

      // fetch data from "server"
      await this.getAllOrders(
        startRow,
        fetchCount,
        sortBy,
        descending,
        filter
      ).then(() => {
        this.loading = false;
      });

      const returnedData = this.orders;

      // update rowsCount with appropriate value
      this.pagination.rowsNumber = this.meta.totalProducts;

      // console.log(pagination.value.rowsNumber);

      // clear out existing data and add new
      this.rows.splice(0, this.rows.length, ...returnedData);

      // don't forget to update local pagination object
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.pagination.sortBy = sortBy;
      this.pagination.descending = descending;

      // ...and turn of loading indicator
      // emulate server
      // setTimeout(() => {}, 1500);
    },
    setOrder(order) {
      if (this.rows.length > 0) {
        this.rows.splice(0, 0, order);
        if (this.rows.length > this.pagination.rowsPerPage) {
          this.rows.splice(-1);
        }
      } else {
        this.rows.push(order);
      }
      this.pagination.rowsNumber++;
      this.orders.push(order);
      this.ordersAddress.push(order.address);
    },
    setInvalidOrder(order) {
      this.invalidOrders.push(order);
      console.log(this.invalidOrders);
    },
    async updateState(orderId, state) {
      try {
        await api.post(`/my-orders/${orderId}/${state}`);
        const order = this.getOrderById(orderId);
        console.log(this.orders);
        order.state = state;
        if (state == 1 || state == 2) {
          this.deleteInvalidOrder(orderId);
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * Este método me permite dar por validadas las ordenes que tengan
     * una cierta dirección
     * @param {Number} addressId
     */
    setOrderValidByAdddress(addressId) {
      this.orders.forEach((order) => {
        if (order.address.id == addressId && order.state == 0) {
          order.state = 1;
          this.deleteInvalidOrder(order.id);
        }
      });
    },
    deleteInvalidOrder(orderId) {
      const notification = useNotifyStore();
      const invalidOrder = this.getInvalidOrderById(orderId);
      const index = this.invalidOrders.indexOf(invalidOrder);
      this.invalidOrders.splice(index, 1);
      notification.decrementNotificationCount();
    },
    addProduct(productId) {
      this.productList.set(productId, 1);
      this.total++;
    },
    deleteProduct(productId) {
      let value = this.productList.get(productId);
      this.productList.delete(productId);
      this.total -= value;
    },
    increment(productId) {
      let value = this.productList.get(productId);
      if (value < 20) {
        this.productList.set(productId, ++value);
        this.total++;
      }
    },
    decrement(productId) {
      let value = this.productList.get(productId);
      if (value > 1) {
        this.productList.set(productId, --value);
        this.total--;
      }
    },
    updateAmount(productId, amount, initialAmount) {
      let newValue = initialAmount - amount;
      this.productList.set(productId, amount);
      this.updatePrice(productId, amount);
      this.total -= newValue;
    },
    updatePrice(productId, amount) {
      let initial = this.orderTable.find(
        (product) => product.id == productId
      ).initialPrice;
      this.orderTable.find((product) => product.id == productId).price =
        initial * amount;
    },
    generateOrder() {
      this.orderTable = [];
      const prod = useProductsStore();
      this.productList.forEach((value, key) => {
        let name = prod.getName(key);
        let price = prod.getPrice(key);
        this.orderTable.push({
          id: key,
          name: name,
          amount: value,
          initialPrice: price,
          price: price * value,
        });
      });
      this.calcTotalPrice();
    },
    generateAddressOptions() {
      this.addressOptions = [];
      const maps = useMapsStore();
      const addresses = maps.addresses;
      addresses.forEach((address) => {
        this.addressOptions.push({ label: address.alias, value: address.id });
      });
    },
    sendOrder(data) {
      this.prepareFinalOrder(data);
      const user = useAuthStore();
      api.post(`/my-orders/${user.me.id}`, this.finalOrder).then(() => {
        this.clearOrder();
      });
    },
    prepareFinalOrder(data) {
      const maps = useMapsStore();
      let addresses = [];
      let phone = "";
      data.forEach((item) => {
        if (item.name == "selected_address") {
          addresses.push(item.value);
        } else if (item.name == "selected_phone") {
          phone = item.value;
        }
      });
      /**
       * Esto es porque el back no me recibe un Map nativo de JS
       * y hay que convertirlo a un Object clave-valor
       */
      const convMap = {};
      this.productList.forEach((val, key) => {
        convMap[key] = val;
      });
      this.finalOrder = {
        addresses: addresses,
        products: convMap,
        secondPhone: phone,
        totalPrice: this.totalPrice,
      };
    },
    clearOrder() {
      this.productList.clear();
      this.total = 0;
      this.orderTable = [];
      this.addressOptions = [];
      this.finalOrder = {};
    },
    calcTotalPrice() {
      this.totalPrice = 0;
      this.orderTable.forEach((value) => {
        this.totalPrice += value.price;
      });
    },
  },
});
