<template>
    <div v-if="type=='range'">
        <input
            :type="type"
            :disabled="options.disabled"
            :required="options.required"
            :value="value"
            :min="options.Min"
            :max="options.Max"
            :step="options.Step"
            @change="change"
            list="listRange"
        >
        <datalist id="listRange" :style="'--list-length: ' + datalist.length">
            <template v-for="o in datalist" ><!--
                --><option  :key="o" >{{ o }}</option>
            </template><!--
                -->

        </datalist>
    </div>
    <input
        v-else
        :type="type"
        :disabled="options.disabled"
        :required="options.required"
        :value="value"
        :min="options.Min"
        :max="options.Max"
        :class="{ 'form-title': order0 }"
        :step="options.Step"
        @change="change"
    >
  
</template>

<script>
export default {
    props: {
        category: { type: String, default: '' },
        field: { type: Object, default: () => {} },
        value: { type: [String, Number, Boolean, Date, Object], default: () => null },
    },
    computed: {
        options () { return this.field.options },
        type () {
            switch (this.category) {
                case 'inputDate':
                    return 'date'
                case 'inputRangeSlider':
                    return 'range'
                case 'inputRangeSpinBox':
                    return 'number'                
                default:
                    return 'text'
            }
        },
        datalist() {
            let d = [];
            if (this.type == 'range') {
                for (let i = this.options.Min; i <= this.options.Max; i += this.options.Step) {
                    d.push(i);                
                }
            }
            return d;
        },
        cssDataLength() {
            return {
                '--list-length': this.datalist.length
            }
        },
        order0: function(){
            return (this.field.options.order == 0)
        }

    },
    methods: {
        change (e) { this.$emit('change', e) }
    },


}
</script>

<style lang="sass" scoped>
.form-title[type=text]
    font-size: 1.3rem
    font-weight: bold

input
  cursor: pointer
  background-color: var(--color-grey)
  border-radius: 4px
  padding: 4px 0
  text-align: center
  &[disabled]
    cursor: not-allowed

input[type=range]
    width: 100%
    max-width: 100%
    margin-left: 0

    & + datalist 
        display: flex
        justify-content: space-around

        & > option 
            width: calc( 100% / var(--list-length)  )


    
</style>
