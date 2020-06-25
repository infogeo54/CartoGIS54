<template>
  <div class="form-group">
    <label>{{ title }}</label>
    <textarea
        v-if="isTextArea"
        :value="value"
        @change="changed">
    </textarea>
    <BooleanSelect
        v-else-if="isBooleanSelect"
        :value="value"
        :required="isRequired"
        @change="changed" />
    <ClassicSelect
        v-else-if="isClassicSelect"
        :value="value"
        :options="classicSelectOptions"
        :required="isRequired"
        @change="changed"
    />
    <input v-else
           :type="type"
           :disabled="isDisabled"
           :required="isRequired"
           :value="value"
           @change="changed">
  </div>
</template>

<script>
import { app as appConfig } from '@/config'
import BooleanSelect from './BooleanSelect'
import ClassicSelect from './ClassicSelect'

export default {
    name: "FormGroup",
    components: { BooleanSelect, ClassicSelect },
    props: {
        property: {
            type: Object,
            default: null
        }
    },
    computed: {
        isTextArea () { return appConfig.form.groups.textAreaFields.includes(this.property.name) },
        isClassicSelect () { return appConfig.form.groups.selectFields.find(el => el.field === this.property.name) },
        classicSelectOptions () { return this.isClassicSelect.options },
        isBooleanSelect () { return this.property.type === 'boolean' },
        isDate () { return this.property.type === 'date' },
        isNumber () { return this.property.type === 'number' },
        type: function () {
            if (this.isDate) return 'date'
            if (this.isNumber) return 'number'
            return 'text'
        },
        isDisabled () {  return appConfig.form.groups.disabledFields.includes(this.property.name) },
        isRequired () { return appConfig.form.groups.requiredFields.includes(this.property.name) },
        title: function () {
            if (this.property.name !== 'geometry') {
                const words = this.property.name.split('_').join(' ')
                return words[0].toUpperCase() + words.slice(1)
            }
            return 'Coordonnées'
        },
        value: function () {
            if (this.property.name !== 'geometry') return this.property.value
            return this.property.value.coordinates.join(', ')
        }
    },
    methods: {
        changed (e) {
            let value = e.target.value
            if (value === 'false') value = false
            else if (value === 'true') value = true
            this.$emit('changed', { name: this.property.name, value })
        }
    }
}
</script>

<style lang="sass" scoped>
  .form-group
    display: flex
    flex-direction: column
    text-align: center
    margin: 6px 0
    input, textarea
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
    textarea
      min-height: 80px
      resize: vertical
</style>