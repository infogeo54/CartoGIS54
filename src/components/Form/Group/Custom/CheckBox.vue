<template>
  <div class="checkBoxContainer">
    <div v-for="(o, index) in map" :key="index">
      <input 
          :type="type"
          @change="change"
          :value="o.value"
          :name="options.name"
          :id="options.name + '_' + o.value"
          :checked="o.value==value"
      />
      <label :id="options.name + '_' + o.value">
        {{ o.text }}
      </label>
    </div>


  </div>

</template>

<script>
export default {
    props: {
        value: { type: [String, Number, Boolean, Object], default: () => '' },
        field: { type: Object, default: () => {} },
        type: {type: String }
    },
    computed: {
        options () { return this.field.options },
        map () { return this.options.map },
    },
    methods: {
        change (e) { this.$emit('change', e) }
    },
    // mounted() {
    //   console.log(this.type);
    // }
}
</script>

<style lang="sass" scoped>
.checkBoxContainer
  display: grid
  grid-template-columns: 1fr 1fr
  grid-template-rows: auto
  gap: .5rem .5rem  

  div 
    display: flex
    align-items: baseline

    input
      margin-right: .3rem

</style>