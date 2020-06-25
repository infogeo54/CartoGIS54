<template>
  <select :required="required" @change="change">
    <option v-for="option in options"
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
        value: { type: Boolean, default: () => false },
        required: { type: Boolean, default: () => false }
    },
    data () {
        return {
            options: [
                { text: 'Non', value: false},
                { text: 'Oui', value: true}
            ]
        }
    },
    methods: {
        change (e) {
            this.$emit('change', e)
        }
    }
}
</script>

<style lang="sass" scoped>
  select
    cursor: pointer
    background-color: #E6E6E6
    border: solid 1px black
    border-radius: 4px
    width: 90%
    max-width: 300px
    margin: auto
    padding: 4px 0
    text-align: center
    &[disabled]
      cursor: not-allowed
</style>