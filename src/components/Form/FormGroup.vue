<template>
    <div class="form-group">
        <label>{{ title }}</label>
        <select v-if="type === 'select'"
                @change="changed">
            <option value="FALSE">Non</option>
            <option value="TRUE">Oui</option>
        </select>
        <input v-else
               :type="type"
               :disabled="disabled"
               :value="value"
               @change="changed">
    </div>
</template>

<script>
    export default {
        name: "FormGroup",
        props: ['property'],
        computed: {
            type: function () {
                switch (this.property.type) {
                    case 'date':
                        return 'date'
                    case 'boolean':
                        return 'select'
                    default:
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

<style scoped>

</style>