<template>
  <div class="form-group">
    <label>{{ title }}</label>
    <select v-if="type === 'select'"
            :required="required"
            @change="changed">
      <option value="FALSE">Non</option>
      <option value="TRUE">Oui</option>
    </select>
    <textarea v-else-if="type === 'textarea'"
              :value="value"
              @change="changed">
        </textarea>
    <input v-else
           :type="type"
           :disabled="disabled"
           :required="required"
           :value="value"
           @change="changed">
  </div>
</template>

<script>
    export default {
        name: "FormGroup",
        props: {
            property: {
                type: Object,
                default: null
            }
        },
        computed: {
            type: function () {
                switch (this.property.type) {
                    case 'date':
                        return 'date'
                    case 'boolean':
                        return 'select'
                    default:
                        if (this.property.name === 'observations') return 'textarea'
                        return 'text'
                }
            },
            disabled: function () {
                switch (this.property.name) {
                    case 'type':
                    case 'geometry':
                        return true
                    default:
                        return false
                }
            },
            required: function () {
                switch (this.property.name) {
                    case 'nom':
                    case 'projet':
                    case 'geometry':
                    case 'disponible':
                    case 'vacances':
                        return true
                    default:
                        return false
                }
            },
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
            changed:function (e) {
                const value = e.target.value
                this.$emit('changed', {name: this.property.name, value: value})
            }
        }
    }
</script>

<style lang="sass" scoped>
  .form-group
    input, textarea, select
      background-color: #E6E6E6
      border: solid 1px black
      border-radius: 2px
</style>