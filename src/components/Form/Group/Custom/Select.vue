<template>
  <select
      :disabled="options.disabled"
      :required="options.required"
      @change="change"
  >
    <option
        v-if="hint"
        value=""
    >
      Choisir une option
    </option>
    <option
        v-for="option in map"
        :key="option.text"
        :value="option.value"
        :selected="option.value === value"
    >
      {{ option.text }}
    </option>
  </select>
</template>

<script>
export default {
    props: {
        value: { type: [String, Number, Boolean], default: () => '' },
        field: { type: Object, default: () => {} }
    },
    computed: {
        options () { return this.field.options },
        map () { return this.options.map },
        hint () { return this.value === '' || this.value === undefined },
    },
    methods: {
        change (e) { this.$emit('change', e) }
    }
}
</script>

<style lang="sass" scoped>
select
  cursor: pointer
  background-color: #E6E6E6
  border: solid 1px black
  border-radius: 4px
  padding: 4px 0
  text-align: center
  &[disabled]
    cursor: not-allowed


</style>