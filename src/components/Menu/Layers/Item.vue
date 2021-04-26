<template>
<swiper-slide>
  <div @click="clicked">{{ title }}</div>
</swiper-slide>
</template>

<script>
import { Swiper as SwiperClass } from 'swiper/js/swiper.esm'

import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'

const { SwiperSlide } = getAwesomeSwiper(SwiperClass)


export default {
    props: ['layer'],
    components: { SwiperSlide },
    computed: {
        name () {
            return this.layer.properties.name
        },
        title () {
            return this.layer.properties.title
        }
    },
    methods: {
        clicked () {
            this.$emit('itemClicked', this.name)
        }
    }
}
</script>

<style lang="sass" scoped>
  .swiper-slide
    justify-content: center
    background: #e4e4e4
    display: flex
    align-items: center
    height: auto
    min-height: 3rem
    &>div  
      font-size: 1.2rem
      box-sizing: border-box
      &:hover
        text-decoration: underline
        cursor: pointer
      &.active
        text-decoration: underline

</style>