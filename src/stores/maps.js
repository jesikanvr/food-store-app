import { defineStore } from "pinia";
import { api } from "src/boot/axios";

import { Notify } from "quasar";

import { useAuthStore } from "./auth";
import { useOrdersStore } from "./orders";

export const useMapsStore = defineStore("maps", {
  state: () => ({
    addresses: [],
    optionsAddress: [],
    options: [],
    municipalities: [],
    municipalitiesNames: [],
  }),

  getters: {
    getAddressById(state) {
      return (addressId) =>
        state.addresses.find((address) => address.id == addressId);
    },
    getAddressByFormatted(state) {
      return (formatted) =>
        state.optionsAddress.find((option) => {
          option.formatted == formatted;
        });
    },
    getSelectedsAddress(state) {
      return state.selectedsAddress;
    },
    existAddress(state) {
      return (addresId) =>
        state.addresses.find((address) => address.id == addresId) != null;
    },
    getMunicipalitiesByName(state) {
      return (name) => state.municipalities.find((munic) => munic.name == name);
    },
  },

  actions: {
    locator(address) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            address.latitude = position.coords.latitude;
            address.longitude = position.coords.longitude;
            this.getAddressFrom(address);
          },
          (error) => {
            Notify.create({
              message: "" + error,
              color: "warning",
            });
          }
        );
      } else {
        console.log("El navegador no soporta la geolocalización");
      }
    },
    async getAddressFrom(address) {
      await api
        .get(
          `https://api.opencagedata.com/geocode/v1/json?q=${address.latitude}+${address.longitude}&key=b22fc82a13744ba4a362ab666ee194f9`
        )
        .then((response) => {
          address.formatted = response.data.results[0].formatted;
          this.optionsAddress.push(response.data.results[0]);
        })
        .catch((error) => {
          Notify.create({
            message: "" + error,
            color: "warning",
          });
        });
    },
    async forwardGeocoding(address) {
      await api
        .get(
          `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=b22fc82a13744ba4a362ab666ee194f9&countrycode=cu`
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.results.length > 0) {
            this.optionsAddress = response.data.results;
            this.prepareOptions();
          }
        });
    },
    prepareOptions() {
      this.options = [];
      this.optionsAddress.forEach((address) => {
        this.options.push(address.formatted);
      });
    },
    getAllAddress() {
      const user = useAuthStore();
      api
        .get(`/users/${user.me.id}/address`)
        .then((response) => {
          this.addresses = response.data;
          console.log(this.addresses);
        })
        .catch((error) => {
          Notify.create({
            message: "" + error,
            color: "warning",
          });
        });
      this.getMunicipalities();
    },
    deleteAddress(addressId) {
      const user = useAuthStore();
      api
        .delete(`/users/${user.me.id}/address/${addressId}`)
        .then(() => {
          this.getAllAddress();
          Notify.create({
            message: "Dirección eliminada",
            color: "info",
          });
        })
        .catch((error) => {
          Notify.create({
            message: "Error al eliminar dirección",
            color: "warning",
          });
        });
    },
    async setAddress(address) {
      console.log(address);
      if (address != null) {
        try {
          const user = useAuthStore();
          const municipalitie = address.municipalities;
          address.municipalities = this.getMunicipalitiesByName(municipalitie);
          const newAddress = await (
            await api.post(`/users/${user.me.id}/address`, address)
          ).data;
          this.addresses.push(newAddress);
          Notify.create({
            color: "info",
            message: "Dirección añadida",
          });
        } catch (error) {
          Notify.create({
            color: "warning",
            message: "No se ha podido crear la dirección",
          });
        }
      } else {
        console.log("La dirección es nula");
      }
    },
    async updateAddress(editedAddress) {
      if (editedAddress.id != undefined) {
        try {
          const user = useAuthStore();
          const updateAddress = await (
            await api.put(
              `/users/${user.me.id}/address/${editedAddress.id}`,
              editedAddress
            )
          ).data;
          let localEdited = this.getAddressById(editedAddress.id);
          localEdited = updateAddress;
          Notify.create({
            color: "info",
            message: "Dirección editada",
          });
        } catch (error) {
          Notify.create({
            color: "warning",
            message: "No se ha podido editar la dirección",
          });
        }
      } else {
        this.setAddress(editedAddress);
      }
    },
    async setIsvalid(addressId) {
      const orders = useOrdersStore();
      try {
        await api.post(`/users/address/${addressId}`).then(() => {
          orders.setOrderValidByAdddress(addressId);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getMunicipalities() {
      try {
        this.municipalities = await (await api.get("/municipalities")).data;
        this.municipalities.forEach((munic) => {
          this.municipalitiesNames.push(munic.name);
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
