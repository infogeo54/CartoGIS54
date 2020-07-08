<template>
  <div v-if="category && !hidden">
    <label>{{ title }}</label>
    <textarea
        v-if="category === 'textArea'"
        :disabled="options.disabled"
        :value="value"
        @change="changed"
    >
    </textarea>
    <Select
        v-else-if="category === 'selectBox'"
        :value="value"
        :field="field"
        @change="changed"
    />
    <Input
        v-else
        :category="category"
        :value="value"
        :field="field"
        @change="changed"
    />
  </div>
</template>

<script>
    import { form as config } from '@/config/app.config.json'
    import Select from './Select'
    import Input from './Input'

    export default {
        components: { Select, Input },
        props: {
            property: { type: Object, default: null }
        },
        computed: {
            category () {
                let res
                for (let category in config) {
                    const field = config[category].find(f => f.name === this.property.name)
                    if (field) { res = category }
                }
                return res
            },
            field () { return config[this.category].find(field => field.name === this.property.name) || null },
            options () { return this.field ? this.field.options : {} },
            hidden () { return this.options.hidden || false },
            title () { return this.field.alias ? this.field.alias : this.field.name.toUpperCase() },
            value: function () {
                if (this.property.name !== 'geometry') return this.property.value || this.field.default
                return this.property.value.coordinates.join(', ')
            }
        },
        methods: {
            changed (e) {
                this.$emit('changed', e)
            }
        }
    }
</script>