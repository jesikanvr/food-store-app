<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-card class="q-pa-md no-shadow" bordered>
      <q-form
        @submit="onSubmit(editAddrress)"
        @reset="onReset(editAddrress)"
        class="q-gutter-md"
      >
        <q-input
          v-model="editAddrress.alias"
          label="Alias"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || `Por favor escriba algo`,
          ]"
        />
        <q-select
          class="q-mb-xl"
          v-model="model"
          use-input
          hide-selected
          fill-input
          label="Dirección"
          hint="Por favor, intente seleccionar una dirección de la lista, siempre que sea próxima a la dirección que desea añadir. Si desea añadir su dirección actual use el botón de Geolocalización."
          input-debounce="0"
          :options="optionsAddress"
          @filter="filterFn"
          @input-value="setModel"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.formatted }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:after>
            <q-btn
              round
              size="15px"
              dense
              flat
              icon="gps_fixed"
              @click="geolocate(editAddrress)"
            >
              <q-tooltip delay="1000">Geolocalización</q-tooltip>
            </q-btn>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          v-model="editAddrress.municipalities"
          :options="municipalitiesNames"
          label="Municipio"
        />

        <q-input
          v-model="editAddrress.apto"
          label="Apartamento"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || `Por favor escriba algo`,
          ]"
        />

        <div>
          <q-btn label="Guardar" type="submit" color="primary" />
          <q-btn
            label="Reiniciar"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { useMapsStore } from "src/stores/maps";
import { ref } from "vue";
import { storeToRefs } from "pinia";

export default {
  props: {
    address: {
      type: Object,
      required: false,
      default() {
        return {
          id: ref(null),
          alias: ref(null),
          formatted: ref(null),
          municipalities: ref(null),
          apto: ref(null),
          latitude: ref(null),
          longitude: ref(null),
        };
      },
    },
  },
  data(props) {
    let editAddrress = Object.assign({}, props.address);
    return {
      editAddrress,
    };
  },
  setup(props, ctx) {
    const maps = useMapsStore();
    const { updateAddress, locator, forwardGeocoding } = maps;
    const {
      municipalitiesNames,
      options,
      getAddressByFormatted,
      optionsAddress,
    } = storeToRefs(maps);
    const model = ref(null);
    const optionsa = ref(options.value);
    return {
      geolocate(address) {
        locator(address);
      },
      forwardGeocoding,
      async onSubmit(address) {
        await updateAddress(address).then(() => {
          ctx.emit("save");
        });
      },
      onReset(address) {
        address.alias = null;
        address.formatted = null;
        address.apto = null;
      },
      municipalitiesNames,
      model,
      optionsAddress,
      getAddressByFormatted,
      filterFn(val, update, abort) {
        update(() => {
          const needle = val.toLocaleLowerCase();
          optionsa.value = options.value.filter(
            (v) => v.toLocaleLowerCase().indexOf(needle) > -1
          );
        });
      },
    };
  },
  methods: {
    setModel(val) {
      if (val != null) {
        this.forwardGeocoding(val);
        this.model = val;
        this.editAddrress.formatted = val;
        if (val.formatted) {
          console.log(val);
          this.editAddrress.formatted = val.formatted;
          this.editAddrress.latitude = val.geometry.lat;
          this.editAddrress.longitude = val.geometry.lng;
        }
      }
    },
  },
};
</script>
