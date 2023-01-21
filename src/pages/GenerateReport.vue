<template>
  <q-page padding>
    <!-- content -->
    <q-scroll-area style="height: 500px">
      <div class="row justify-center">
        <q-card
          class="q-pb-md"
          flat
          bordered
          style="min-width: 400px"
          align="center"
        >
          <q-card-section>
            <div class="text-h5">Generar reporte</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                filled
                v-model="nameReport"
                label="Nombre"
                :rules="[
                  (val) => (val && val.length > 0) || `Por favor escriba algo`,
                ]"
              />
              <q-input
                filled
                v-model="end"
                mask="date"
                :rules="[
                  'date',
                  (val) => (val && val.length > 0) || `Por favor escriba algo`,
                ]"
                hint="Fecha de fin"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="end" minimal :options="optionsFn">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <select-prodcuts-vue
                :rows="noDeleted"
                :selected="selected"
                @add="selectedProdut"
              />
              <q-select v-model="type" :options="admitReports" label="Tipo" />
              <div class="q-gutter-md">
                <q-btn type="submit" color="primary" label="Guardar" />
                <q-btn type="reset" label="Reiniciar" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { useReportsStore } from "src/stores/reports";
import { storeToRefs } from "pinia";

import SelectProdcutsVue from "src/components/tables/SelectProdcuts.vue";
import { useProductsStore } from "src/stores/products";
import { Notify } from "quasar";
import { useRouter } from "vue-router";

export default {
  // name: 'PageName',
  components: {
    SelectProdcutsVue,
  },
  setup() {
    const router = useRouter();
    const reports = useReportsStore();
    const products = useProductsStore();
    const { min_date, admitReports } = storeToRefs(reports);
    const { getMinDateReport, saveReport } = reports;
    const { noDeleted } = storeToRefs(products);
    const { getNotDeleted } = products;
    const date = new Date();
    const now = `${date.getFullYear()}/${
      date.getMonth() + 1 < 10 ? `` + date.getMonth() + 1 : date.getMonth() + 1
    }/${date.getDate() < 10 ? `0` + date.getDate() : date.getDate()}`;

    const nameReport = ref("");
    const end = ref(now);
    const type = ref("Semanal");
    const selected = ref([]);

    onMounted(async () => {
      await getMinDateReport();
      await getNotDeleted();
    });
    return {
      nameReport,
      end,
      type,
      selected,

      admitReports,
      noDeleted,
      optionsFn(date) {
        console.log(min_date.value, now);
        return date >= min_date.value && date <= now;
      },
      selectedProdut(products) {
        if (products != null) {
          selected.value = products;
          console.log(selected.value);
        }
      },
      async onSubmit() {
        if (selected.value.length > 0) {
          await saveReport(
            nameReport.value,
            type.value,
            end.value,
            selected.value
          ).then(() => {
            router.back();
          });
        } else {
          Notify.create({
            color: "warning",
            message: "Por favor, seleccione algún producto",
          });
        }
      },
    };
  },
};
</script>
