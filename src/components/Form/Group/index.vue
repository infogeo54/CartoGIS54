<template>
  <Custom
      v-if="isCustom"
      :property="property"
      @changed="changed"
      class="form-group"
  />
  <Default
      v-else
      :property="property"
      class="form-group"
      @changed="changed"
  />
</template>

<script>
import { form as config } from '@/config/app.config.json'
import _ from 'lodash'
import Default from './Default'
import Custom from './Custom'

export default {
    components: { Default, Custom },
    props: {
        property: { type: Object, default: null }
    },
    computed: {
        isConfigFileConfigured () { return (!!config && !_.isEmpty(config)) },
        isCustom () {
            if (!this.isConfigFileConfigured) { return false }
            let matchingField = null
            const categories = Object.keys(config)
            categories.forEach(c => {
                const fields = config[c]
                fields.forEach(f => {
                    if (f.name === this.property.name) { matchingField = f}
                })
            })
            return !!matchingField
        },
    },
    methods: {
        changed (e) {
            let value = e.target.value
            this.$emit('changed', { name: this.property.name, value })
        }
    }
}
</script>

<style lang="sass">
.form-group
  display: flex
  flex-direction: column
  text-align: center
  margin: 6px 0
  & > *
    width: 90%
    max-width: 300px
    text-align: center
    margin: auto
  & > input
    width: 90%
    max-width: 300px
    background-color: #E6E6E6
    border: solid 1px black
    border-radius: 4px
    padding: 4px 0
    text-align: center
    &[disabled]
      cursor: not-allowed
  textarea
    background-color: #E6E6E6
    border: solid 1px black
    border-radius: 4px
    min-height: 80px
    resize: vertical
</style>