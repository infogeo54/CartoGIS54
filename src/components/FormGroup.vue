<template>
    <div class="form-group">
        <label :for="id">{{ title }}</label>
        <input :id="id" :type="type" v-model="value" @change="changed">
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
            }
        },
        methods: {
            changed:function () {
                this.$emit('changed')
            }
        }
    }
</script>

<style scoped>

</style>