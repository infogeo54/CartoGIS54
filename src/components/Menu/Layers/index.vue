<template>
  <div id="layers-container">
    <div class="layers-title component-title">
      <h2>1</h2>
      <h3>Mes couches</h3>
    </div>
    <swiper class="swiper" ref="layersSwiper" :options="swiperOption">
      <Item
          v-for="(layer, index) in layers"
          :key="index"
          :layer="layer"
          :class="layer === selectedLayer ? 'active' : ''"
          @itemClicked="itemClicked"
        />
      <div class="swiper-scrollbar" slot="scrollbar"></div>

      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
        

    </div>
</template>

<script>
import Item from './Item'
import { Swiper as SwiperClass, Navigation, Scrollbar, Keyboard } from 'swiper/js/swiper.esm'

import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'

import 'swiper/css/swiper.css'

SwiperClass.use([ Navigation, Scrollbar, Keyboard ])

const { Swiper } = getAwesomeSwiper(SwiperClass)

export default {
  props: ['layers', 'selectedLayer'],
    components: { Swiper, Item },
    data() {
      return {
        swiperOption: {
          direction: 'horizontal',
          slidesPerView: '1',
          spaceBetween: 15,
          grabCursor: true,
          mousewheel: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
            dragSize: 50,
          },
          keyboard: {
            enabled: true
          },
          breakpoints: {
            320: {
              direction: 'horizontal',
              slidesPerView: 2,
            },            
            576: {
              direction: 'horizontal',
              slidesPerView: 3
            },
            768: {
              direction: 'vertical',
              slidesPerView: 'auto',
            }
          }
        }
      }
    },

    computed: {
      swiper(){
        return this.$$refs.layersSwiper.$swiper
      }
    },

    methods: {
      itemClicked (layerName) {
          this.$emit('layerItemClicked', layerName)
      }
    },
}
</script>

<style lang="sass" scoped>

  #layers-container
    padding-top: 1.5rem
    position: relative
    height: auto
    max-width: 95vw
    box-sizing: border-box
    margin: 0 auto

  .swiper-scrollbar
    height: .5rem
    width: 80%
    margin: 0 10%

  .swiper-button-next,
  .swiper-button-prev
    top: 35%

  .swiper-button-next
    right: 0px

  .swiper-button-prev
    left:  0px

  .swiper-container
    padding-bottom: 1.5rem
    box-sizing: border-box


  @media screen and (min-width: 768px)

    #layers-container
      display: flex
      flex-direction: column

    .swiper-button-next,
    .swiper-button-prev,
    .swiper-scrollbar
      display: none

    .swiper-container
      padding-bottom: 0
      overflow-y: auto



</style>