<template>
  <div id="layers-container">
    <div class="layers-title component-title">
      <h2>1</h2>
      <h3>Mes couches</h3>
    </div>
    <div class="layers-swiper-container">
      <swiper ref="layerSwiper" :options="options">
          <swiper-slide v-for="(layer, index) in layers" :key="index" >
            <Item
                :layer="layer"
                :class="layer === selectedLayer ? 'active' : ''"
                @itemClicked="itemClicked"
              />
          </swiper-slide>
          <div class="swiper-scrollbar" slot="scrollbar"></div>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
  </div>
</template>

<script>

import Item from './Item';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'


export default {
  props: ['layers', 'selectedLayer'],
    components: { 
      Item,
      Swiper, SwiperSlide,
    },
    data() {
      return {
        options: {
          direction: 'horizontal',
          slidesPerView: '1',
          spaceBetween: 15,
          // grabCursor: true,
          mousewheel: true,
          keyboard: {
            enabled: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
            snapOnRelease: true,
            dragSize: 'auto',
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
    methods: {
      itemClicked (layerName) {
          this.$emit('layerItemClicked', layerName)
      },
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
    
  .layers-swiper-container
    height: 100%
    overflow-y: auto

  .swiper-scrollbar
    width: 80%
    height: .4rem
    margin: 0 10%

  .swiper-button-next,
  .swiper-button-prev
    top: 47%
    color: rgba(0,0,0,0.5)

  .swiper-button-next::after,
  .swiper-button-prev::after
    font-size: 1.5rem
    font-weight: bold


  .swiper-button-next:hover,
  .swiper-button-next:active,
  .swiper-button-next:focus,
  .swiper-button-prev:hover,
  .swiper-button-prev:active,
  .swiper-button-prev:focus
    color: rgba(0,0,0,0.8)
    

  .swiper-button-next
    right: 0px

  .swiper-button-prev
    left:  0px



  @media screen and (min-width: 768px)

    #layers-container
      display: flex
      flex-direction: column
      width: 15rem

    .swiper-button-next,
    .swiper-button-prev,
    .swiper-scrollbar
      display: none

</style>