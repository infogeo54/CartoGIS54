<template>
  <div class="form-container">
    <form id="form" @submit.prevent="onSaveClick">
      <div class="groups">
          <Group v-for="property in properties"
                :key="property"
                :property="{name: property, ...feature.properties[property]}"
                :themeAnalysisAttr="themeAnalysisAttr"
                @changed="onChange"
          />
      </div>
      <div class="buttons">
        <input type="submit" name="save" value="Enregistrer" class="save-button">
        <input type="button" name="cancel" @click="onCancelClick" value="Annuler" class="cancel-button">
        <input type="button" name="delete" @click="onDeleteClick" value="Supprimer" :disabled="!feature.id" class="delete-button">
      </div>
    </form>
  </div>
</template>

<script>
import Group from './Group'
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    name: "Form",
    components: { Group },
    computed: {
        ...mapGetters({
            feature: 'feature/selected',
        }),
        properties: function () {
            return Object.keys(this.feature.properties).sort((a, b) => this.sortProperties(a, b))
        },
        themeAnalysisAttr: function() { return this.feature.themeAnalysisAttr } 
    },
    /**
     * Call store's reset action before destroying the component
     */
    beforeDestroy() {
        this.reset()
    },
    methods: {
        ...mapMutations('feature', ['updateAttribute', 'setEditable', 'toggleEdit']),
        ...mapActions([
            'reset',
            'feature/save',
            'feature/delete',
            'feature/cancel'
        ]),

    
        sortProperties: function (a, b){
          return a < b ? -1 : a > b ? 1 : 0;
        },

        onChange: function (attribute) {
            this.updateAttribute(attribute)
        },
        /**
         * Call store's save action
         */
        onSaveClick: async function () {
            await this['feature/save']()
            if (this.feature.type != 'point') this.feature.representation.hideMeasurements(); 
            this.setEditable(false)
            this.toggleEdit()
            this.$destroy()
        },
        /**
         * Call store's delete action
         */
        onDeleteClick: async function () {
            if (confirm('Êtes-vous sûr.e de vouloir supprimer cette entité ?')) {
              const deleteSuccess = await this['feature/delete']();
            if (deleteSuccess) this.$destroy();
            }
        },
        /**
         * Call store's cancel action
         */
        onCancelClick: function () {
            this['feature/cancel']()
            this.$destroy()
        },
    },
}
</script>

<style lang="sass" scoped>
.form-container
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5), 0 0 0 rgba(0, 0, 0, 0.1)
  min-width: 20rem
  position: relative
  z-index: 2000
  #form
    z-index: 1000
    display: flex
    flex-direction: column
    color: #0e0e0e
    background-color: white
    box-sizing: border-box
    position: relative
    padding-bottom: 7rem
    .groups
      display: flex
      flex-direction: column
      & > *
        margin: 1rem 0
    .buttons
      background-color: white

      position: fixed
      bottom: 0
      display: flex
      flex-wrap: wrap
      width: 100%
      justify-content: space-evenly
      padding: 1rem 0
      input
        padding: 1rem .5rem
        &:hover, 
        &:focus,
        &:active
          box-shadow: 0px 2px 5px 1px #000000
          -webkit-box-shadow: 0px 2px 5px 1px #000000
        &:hover
          cursor: pointer
          &[disabled]
            cursor: not-allowed




@media screen and (min-width: 768px)
  .form-container
    overflow-y: auto


    .buttons
      max-width: calc(19rem + 2px)
      justify-content: space-between

</style>
