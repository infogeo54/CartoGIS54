<template>
    <div>
        <!-- <img src="https://place-hold.it/250x150" @click="downloadFile()"/> -->
    
        <a :href="value" download>
            {{ value }}
        </a>
    </div>
    <!-- <div v-else @change="change">
        <input type="file" :accept="typeAccepted">
    </div> -->
</template>

<script>
// import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
    props: {
        category: { type: String, default: '' },
        field: { type: Object, default: () => {} },
        value: { type: [String, Number, Boolean, Date], default: () => null },
        
    },
    computed: {
        typeAccepted: function(){
            return "image/*, .docx, .doc, .pdf"
        },
        ...mapGetters({
            feature: 'feature/selected',
        })
    },
    methods: {
        change (e) { this.$emit('change', e) },
    },
    mounted() {
        // console.log(this.value);

    }
}
</script>

<style lang="sass" scoped>
div
  text-align: center

  img
      max-width: 100%
      height: auto

</style>
