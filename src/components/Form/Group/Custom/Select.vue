<template>
  <select
      :disabled="options.disabled"
      :value="value"
      @change="change"
  >
    <option
        v-for="(value, text) in options"
        :key="text"
    >
      {{ text }}
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
        options () { return this.field.options.map },
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