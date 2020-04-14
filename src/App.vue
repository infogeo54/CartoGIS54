<template>
  <div id="app">
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    name: 'App',
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters({
        capabilities: 'capabilities',
        layers: 'layers'
      })
    },
    methods: {
      ...mapActions(['getLayers'])
    },
    mounted() {
      this.getLayers()
    }
  }
</script>

<style>

</style>
