<template>
    <Custom
        v-if="isCustom"
        :property="property"
        @changed="changed"
        class="form-group"
        :style="{ order: order }"
        :themeAnalysisAttr="themeAnalysisAttr"
    />
    <Default
        v-else
        :property="property"
        @changed="changed"
        class="form-group"
        :style="{ order: order }"
    />

</template>

<script>
import { form as config } from '@/app.config.json'
import _ from 'lodash'
import Default from './Default'
import Custom from './Custom'

export default {
    components: { Default, Custom },
    data() {
        return {
            order: 10
        }
    },
    props: {
        property: { type: Object, default: null },
        themeAnalysisAttr: { type: String, default: 'type'},
    },
    computed: {
        isConfigFileConfigured () { return (!!config && !_.isEmpty(config)) },
        isCustom () {
            if (this.property.name == this.themeAnalysisAttr) return true
            if (!this.isConfigFileConfigured) return false
            let matchingField = null
            const categories = Object.keys(config)
            categories.forEach(c => {
                const fields = config[c]
                fields.forEach(f => {
                    if (f.name === this.property.name) { 
                        matchingField = f
                        this.orderField(matchingField);
                    }
                })
            })



            return !!matchingField
        },
    },
    methods: {
        changed (e) {
            let value = e.target.value
            this.$emit('changed', { name: this.property.name, value })
        },
        orderField (f){
            if (f.options && (f.options.order || f.options.order == 0)) {
                this.order = f.options.order
            }
        },
    },
    mounted(){
        // console.log(this.property);
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
    width: 92%
    max-width: 20rem
    text-align: center
    margin: auto
    border: none
  & > input
    // width: 90%
    // max-width: 300px
    background-color: var(--color-grey)
    border-radius: 4px
    padding: 4px 0
    text-align: center
    &[disabled]
      cursor: not-allowed
  textarea
    background-color: var(--color-grey)
    border-radius: 4px
    min-height: 80px
    resize: vertical
    text-align: justify
    padding: .5rem
</style>