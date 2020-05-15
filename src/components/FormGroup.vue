<template>
    <div class="form-group">
        <label :for="id">{{ title }}</label>
        <input :id="id"
               :type="type"
               :disabled="disabled"
               :value="value"
               @change="changed">
    </div>
</template>

<script>
    export default {
        name: "FormGroup",
        props: ['property', 'value'],
        computed: {
            type: function () {
                const regex = new RegExp(/^.*date.*$/)
                return this.property.match(regex) ? 'date' : 'text'
            },
            title: function () {
                const words = this.property.split('_').join(' ')
                return words[0].toUpperCase() + words.slice(1)
            },
            id: function () {
                return `ipt-${this.property}`
            },
            disabled: function () {
                switch (this.property) {
                    case 'type':
                    case 'geometry':
                        return true
                    default:
                        return false
                }
            },
            // We don't want to create an ID input
            fillable: function () {
                return !this.property.match(/^.*id.*$/)
            }
        },
        methods: {
            changed:function (e) {
                const value = e.target.value
                this.$emit('changed', {name: this.property, value: value})
            }
        }
    }
</script>

<style scoped>

</style>