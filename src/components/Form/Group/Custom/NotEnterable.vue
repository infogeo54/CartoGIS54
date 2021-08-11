<template>
  <div @change="change" :class="{ 'form-title': order0 }">
      {{ computedValue.value }}
      <span v-if="computedValue.unit !== null">
          &nbsp;
        {{ computedValue.unit }}

      </span>
  </div>
</template>

<script>
export default {
    props: {
        category: { type: String, default: '' },
        field: { type: Object, default: () => {} },
        value: { type: [String, Number, Boolean, Date, Object], default: () => null },
        
    },
    computed: {
        computedValue: function(){
            const a = {
                value: this.value,
                unit: null
            };
            if (this.value == null && this.field.default !== null) a.value = this.field.default;

            if (this.field.unit) {
                switch (this.field.unit) {
                    case 'metre':
                        if (a.value > 1000 ) {
                            a.value = Math.round((this.value/1000) * 100)/100;
                            a.unit = "km"
                        }else a.unit = "m";
                        break;

                    case 'squareMetre':
                        if (a.value > 10**6 ) {
                            a.value = Math.round((this.value/10**6) * 10)/10;
                            a.unit = "km²"
                        }
                        else  if (a.value > 10**4) {
                            a.value = Math.round((this.value/10**4) * 10)/10;
                            a.unit = "ha"
                        }
                        else a.unit = "m²";
                        break;
                
                    default:
                        break;
                }
            }
            return a;
        },
        order0: function(){
            return (this.field.options.order == 0)
        }
    },
    methods: {
        change (e) { this.$emit('change', e) },
    },

}
</script>

<style lang="sass" scoped>
.form-title
    font-size: 1.3rem
    font-weight: bold

div
  cursor: pointer
  padding: 4px 0
  text-align: center

</style>
