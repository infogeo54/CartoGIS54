<template>
  <input
      :type="type"
      :value="value"
      :min="options.Min"
      :max="options.Max"
      :step="options.Step"
      @change="change"
  >
</template>

<script>
export default {
    props: {
        category: { type: String, default: '' },
        field: { type: Object, default: () => {} },
        value: { type: [String, Number, Boolean, Date], default: () => null },
    },
    computed: {
        options () { return this.field.options },
        type () {
            switch (this.category) {
                case 'inputDate':
                    return 'date'
                case 'inputNumber':
                case 'inputRange':
                    return 'number'
                default:
                    return 'text'
            }
        }
    },
    methods: {
        change (e) { this.$emit('change', e) }
    }
}
</script>

<style lang="sass" scoped>
input
  cursor: pointer
  background-color: #E6E6E6
  border: solid 1px black
  border-radius: 4px
  padding: 4px 0
  text-align: center
  &[disabled]
    cursor: not-allowed
</style>