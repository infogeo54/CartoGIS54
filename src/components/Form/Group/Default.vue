<template>
  <div>
    <label>{{ title }}</label>
    <input
        type="text"
        :value="value"
        @change="changed"
    >
  </div>
</template>

<script>
export default {
    props: {
        property: { type: Object, default: null }
    },
    computed: {
        title () { return this.property.name[0].toUpperCase() + this.property.name.slice(1) },
        value () {
            if (this.property.name !== 'geometry') return this.property.value
            return this.property.value.coordinates.join(', ')
        }
    },
    methods: {
        changed (e) {
            this.$emit('changed', e)
        }
    },
}
</script>

<style lang="sass" scoped>
label
    margin-bottom: .2rem
input
    border: none
</style>