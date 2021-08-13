<template>
  <div id="layers-container">
    <div class="layers-title component-title">
      <h3>Ma couche</h3>
    </div>
    <div class="layers-swiper-container" :style="cursor">
      <Swiper ref="layerSwiper" :options="options">
          <SwiperSlide v-for="(layer, index) in layers" :key="index" >
            <Item
                :layer="layer"
                :class="layer === selectedLayer ? 'active' : ''"
                @itemClicked="itemClicked"
              />
          </SwiperSlide>
          <div class="swiper-scrollbar" slot="scrollbar"></div>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
      </Swiper>
    </div>
  </div>
</template>

<script>

import Item from './Item';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { mapGetters } from 'vuex'


export default {
  props: ['layers', 'selectedLayer'],
    components: { 
      Item,
      Swiper, SwiperSlide,
    },
    data() {
      return {
        // Doc : https://swiperjs.com/swiper-api
        options: {
          disableLayers: false,
          direction: 'horizontal',
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 5,
          mousewheel: true,
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
              slidesPerGroup: 1,
            },            
            576: {
              direction: 'horizontal',
              slidesPerView: 3,
              slidesPerGroup: 1,
            },
            768: {
              direction: 'vertical',
              slidesPerView: 'auto',
              slidesPerGroup: 3,
            }
          }
        }
      }
    },
    computed : {
      ...mapGetters({
        isFormVisible: "form/formVisible",
        isDrawing: "isDrawing",
      }),
      cursor(){
        return (this.isFormVisible || this.isDrawing)? 'cursor: not-allowed': 'cursor: auto'
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
    max-width: 95vw
    box-sizing: border-box
    margin: 0 auto

  .swiper-scrollbar
    width: 80%
    height: .4rem
    margin: 0 10%

  .swiper-button-next,
  .swiper-button-prev
    background-color: rgba(220,220,220,.9)
    color: rgba(100,100,100, .9)
    border-radius: 100%
    top: 47%
    text-align: center
    height: 2.5rem
    width: 2.5rem

  .swiper-button-next::after,
  .swiper-button-prev::after
    font-size: 1.5rem
    font-weight: bold

  .swiper-button-next:hover,.swiper-button-next:active,.swiper-button-next:focus,
  .swiper-button-prev:hover,.swiper-button-prev:active,.swiper-button-prev:focus
    background-color: rgba(180,180,180,.9)
    color: rgba(50,50,50, .9)

  .swiper-button-next
    right: 0px

  .swiper-button-prev
    left:  0px

  .swiper-button-disabled
    display: none

  .layers-swiper-container
    position: relative


  @media screen and (min-width: 768px)

    #layers-container
      display: flex
      flex-direction: column
      justify-content: space-between
      width: 15rem

    .swiper-container
      height: calc(100vh - var(--header-size) - 17rem)

    .swiper-wrapper,
    .swiper-slide
      height: auto

    .swiper-scrollbar
      display: none

    .swiper-button-next,
    .swiper-button-prev,
      left: 50%
      transform: rotate(90deg)
      transform-origin: left center

    .swiper-button-prev
      top: 1rem

    .swiper-button-next
      top: auto
      bottom: 1.5rem


</style>