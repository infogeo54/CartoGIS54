<template>
    <div id="form">
        <FormGroup v-for="(value, property) in feature.properties"
                   :key="property"
                   :property="property"
                   :value="value"
                   @changed="onChange"></FormGroup>
    </div>
</template>

<script>
    import FormGroup from './FormGroup'
    import {mapGetters, mapMutations} from 'vuex'
    export default {
        name: "Form",
        computed: {
            ...mapGetters({
                feature: 'feature/selected'
            })
        },
        methods: {
            ...mapMutations('feature', ['setSelected']),
            onChange: function () {
                this.setSelected(this.feature)
            }
        },
        components: {
            FormGroup
        }

    }
</script>

<style scoped>

</style>