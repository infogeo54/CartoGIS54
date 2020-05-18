<template>
    <div class="form-group">
        <label>
            {{ title }}
            <input :id="id"
                   :type="type"
                   :disabled="disabled"
                   :value="value"
                   @change="changed">
        </label>
    </div>
</template>

<script>
    export default {
        name: "FormGroup",
        props: ['property'],
        computed: {
            title: function () {
                const words = this.property.name.split('_').join(' ')
                return words[0].toUpperCase() + words.slice(1)
            },
            id: function () {
                return `ipt-${this.property.name}`
            },
            type: function () {
                switch (this.property.type) {
                    case 'date':
                        return 'date'
                }
                return 'text'
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
            value: function () {
                return this.property.value
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