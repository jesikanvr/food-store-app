<template>
  <div>
    <q-carousel
      arrows
      animated
      v-model="slide"
      height="400px"
      infinite
      :autoplay="autoplay"
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
    >
      <q-carousel-slide
        :name="1"
        img-src="https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      >
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">Comida deliciosa</div>
          <div class="text-subtitle1">para todos los gustos</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide
        :name="2"
        img-src="https://images.pexels.com/photos/842142/pexels-photo-842142.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      >
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">La mejor comida</div>
          <div class="text-subtitle1">elaborada por los mejores chefs</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide
        :name="3"
        img-src="https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      >
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">Sabores cubanos</div>
          <div class="text-subtitle1">que conquistan paladares</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide
        :name="4"
        img-src=" https://images.pexels.com/photos/3756498/pexels-photo-3756498.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      >
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">Nuestros combos</div>
          <div class="text-subtitle1">la mejor opción para la familia</div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      slide: ref(1),
      autoplay: ref(true),
    };
  },
};
</script>

<style lang="scss" scoped>
.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
