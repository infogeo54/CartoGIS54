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
// import { mapGetters } from 'vuex'

export default {
    props: {
        value: { type: [String, Number, Boolean], default: () => '' },
        field: { type: Object, default: () => {} }
    },
    computed: {
        options () { return this.field.options },
        map () { return this.options.map },
        hint () { return this.value === '' || this.value === undefined || this.value === null },
        // ...mapGetters({
        //     feature: 'feature/selected',
        // })
    },
    methods: {
        change (e) { this.$emit('change', e) }
    },
    mounted() {
      // console.log(this.value);
    }
}
</script>

<style lang="sass" scoped>
select
  cursor: pointer
  background-color: #E6E6E6
  border-radius: 4px
  padding: 4px 0
  text-align: center
  &[disabled]
    cursor: not-allowed


</style>