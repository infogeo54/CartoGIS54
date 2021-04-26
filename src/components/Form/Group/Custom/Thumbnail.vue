<template>
  <div @change="change">
      <!-- <img :src="field.url" /> -->
      <img :src="value">
  </div>
</template>

<script>

export default {
    props: {
        category: { type: String, default: '' },
        field: { type: Object, default: () => {} },
        value: { type: [String, Number, Boolean, Date], default: () => null },
        
    },
    methods: {
        change (e) { this.$emit('change', e) },
    },
    mounted() {

    }
}
</script>

<style lang="sass" scoped>
div
  text-align: center

  img
      max-width: 100%
      height: auto

</style>
