<template>
  <div class="legend-modal">
    <div class="legend-divider"></div>
    <div id="legend" class="legend-modal-content">
      <div class="legend-header">
        <div @click="close">
          <i class="fas fa-times-circle"></i>
        </div>
      </div>
      <div class="legend-title component-title">
        <h2>2</h2>
        <h3>{{ title }}</h3>
      </div>
      <div class="legend-body">
        <div class="legend-container">
            <Item
              v-for="(style, index) in styles" :key="index"
              :feature-style="style"
              @itemClicked="itemClicked"
            />
        </div>
        <!-- <swiper ref="legendSwiper" :options="options"> -->
          <!-- <swiper-slide v-for="(style, index) in styles" :key="index"> -->
          <!-- </swiper-slide> -->
        <!-- </swiper> -->
      </div>
    </div>
  </div>
</template>

<script>
import Item from './Item'
// import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
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
      // Swiper, SwiperSlide
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
    }
}
</script>

<style lang="sass" scoped>

.legend-modal



  &>.legend-divider
    background-color: #0e0e0e
    height: 1px
    width: 66%
    margin: 1rem auto 0 auto

#legend
  color: #0e0e0e
  width: 100%
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
  .legend-body
    padding-bottom: 2rem
    height: 100%
    overflow-y: auto
    .legend-container
      display: grid
      grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr))
      row-gap: 2rem

@media screen and (min-width: 768px)
  .legend-modal
    height: auto
    display: flex
    width: 14rem

    &>.legend-divider
      display: none

    &>#legend
      border-left: solid 1px #0e0e0e

      .legend-body
        height: 100%
        overflow-y: auto

        .legend-container
          display: block
</style>
