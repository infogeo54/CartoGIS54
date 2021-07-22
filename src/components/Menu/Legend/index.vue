<template>
  <div class="legend-modal">
    <div class="legend-divider"></div>
    <div id="legend">
      <div class="legend-header">
        <div @click="close">
          <i class="fas fa-times-circle"></i>
        </div>
      </div>
      <div class="legend-title component-title">
        <h3>Mon objet <br/> "{{ title }}"</h3>
      </div>
      <div class="legends-swiper-container">
        <Swiper ref="legendSwiper" :options="options">
          <SwiperSlide v-for="(style, index) in styles" :key="index">
            <Item
              :feature-style="style"
              @itemClicked="itemClicked"
            />
          </SwiperSlide>
          <div class="swiper-scrollbar" slot="scrollbar"></div>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<script>
import Item from './Item'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
    name: "Legend",
    props: {
        layer: {
            type: Object,
            default: null
        }
    },
    components: {
      Item,
      Swiper, SwiperSlide
    },
    data(){
      return {
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
    computed: {
        title () {
            return this.layer.properties.title
        },
        styles () {
            return this.layer.styles
        }
    },
    methods: {
        itemClicked (featureType) {
            this.$emit('legendItemClicked', featureType)
        },
        close () {
            this.$emit('legendCloseClicked')
        }
    },
}
</script>

<style lang="sass" scoped>
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


.legend-modal

  &>.legend-divider
    background-color: #0e0e0e
    height: 1px
    width: 66%
    margin: 1rem auto 0 auto

#legend
  color: #0e0e0e
  width: 95vw
  margin: 0 auto
  display: flex
  flex-direction: column

  .legend-header
    h3
      margin-top: 0
    div
      width: fit-content
      margin: 5px 5px auto auto
      color: #303030
      &:hover
        color: #0e0e0e
        cursor: pointer
        
  .legends-swiper-container
    position: relative
    // padding-bottom: 2rem
    // overflow-y: auto
    // .legend-container
      // display: grid
      // grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr))
      // row-gap: 2rem

@media screen and (min-width: 768px)
  .swiper-container
    height: calc(100vh - var(--header-size) - 19rem)

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

  .legend-modal
    display: flex
    width: 14rem

    &>.legend-divider
      display: none

    &>#legend
      border-left: solid 1px #0e0e0e
      width: 100%
      margin: 0

      .legends-swiper-container
        // height: 100%
        // overflow-y: auto

</style>
