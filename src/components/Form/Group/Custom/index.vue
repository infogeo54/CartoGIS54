<template>
  <div
    v-if="category && category!='hidden'"
    :class="options.required && !options.disabled ? 'required' : ''"
  >
    <label>
      {{ title }}
    </label>
    <textarea
        v-if="category === 'textArea'"
        :disabled="options.disabled"
        :required="options.required"
        :value="value"
        @change="changed"
    >
    </textarea>
    <Select
        v-else-if="category === 'selectBox' "
        :value="value"
        :field="field"
        @change="changed"
    />
    <CheckBox
        v-else-if="category === 'checkBox' "
        :value="value"
        :field="field"
        :type="'checkbox'"
        @change="changed"
    />
    <CheckBox
        v-else-if="category === 'radio' "
        :value="value"
        :field="field"
        :type="'radio'"
        @change="changed"
    />
    <NotEnterable 
        v-else-if="category === 'notEnterable'"
        :value="value"
        :field="field"
        @change="changed"
    />
    <Thumbnail 
        v-else-if="category === 'thumbnail'"
        :value="value"
        :field="field"
        @change="changed"
    />
    <File 
        v-else-if="category === 'fileInput'"
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
    import { form as config } from '@/app.config.json'
    import Select from './Select'
    import Input from './Input'
    import NotEnterable from './NotEnterable'
    import Thumbnail from './Thumbnail'
    import CheckBox from './CheckBox.vue'
    import File from './File.vue'

    export default {
        components: { Select, Input, NotEnterable, Thumbnail, CheckBox, File },
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
            title () { return this.field.alias ? this.field.alias : this.field.name.toUpperCase()[0] + this.field.name.slice(1) },
            value: function () {
                if (this.property.name !== 'geometry') { return this.property.value }
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

<style lang="sass">
label
    margin-bottom: .2rem
    
.required
  & > label:after
    content: ' *'
    color: red
</style>