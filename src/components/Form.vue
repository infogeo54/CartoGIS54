<template>
    <div id="form">
        <FormGroup v-for="(value, property) in properties"
                   :key="property"
                   :property="property"
                   :value="value"
                   @changed="onChange"></FormGroup>
        <button @click="onClick">Enregistrer</button>
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
            }),
            properties: function () {
                return this.feature.properties
            }
        },
        methods: {
            ...mapMutations('feature', ['setSelected']),
            onChange: function () {
                this.setSelected(this.feature)
            },
            onClick: function () {

            }
        },
        components: {
            FormGroup
        }

    }
</script>

<style scoped>

</style>