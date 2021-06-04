<template>
  <form id="form" @submit.prevent="onSaveClick">
    <div class="form-title component-title">
      <h2>3</h2>
      <h3>La fiche</h3>
    </div>
        <div class="groups">
            <Group v-for="property in properties"
                  :key="property"
                  :property="{name: property, ...feature.properties[property]}"
                  @changed="onChange"
            />
        </div>

        <div class="buttons">
          <input type="submit" name="save" value="Enregistrer">
          <input type="button" name="delete" @click="onDeleteClick" value="Supprimer" :disabled="!feature.id">
          <input type="button" name="cancel" @click="onCancelClick" value="Annuler">
        </div>
  </form>
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

        /**
         * Saves changes in the Store
         * @param attribute
         */
        onChange: function (attribute) {
            this.updateAttribute(attribute)
        },
        /**
         * Call store's save action
         */
        onSaveClick: async function () {
            await this['feature/save']()
            // console.log('gml:prop');
            if (this.feature.properties.geometry.type != 'gml:PointPropertyType') this.feature.representation.hideMeasurements(); 
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
        /*
          onCancelClick: async function () {
          let res = await this['feature/cancel']()
          console.log(res);
          if(res) this.$destroy()
        },
        */
        /**
         * Call the appropriated action then destroy the component
         * @param e : Event - An event created by clicking on a form's button
         */
        // action: async function (e) {
        //   console.log(e.explicitOriginalTarget);
        //     switch (e.explicitOriginalTarget.name) {
        //         case 'save':
        //             await this.onSaveClick()
        //             break
        //         case 'delete':
        //             if (confirm('Êtes-vous sûr.e de vouloir supprimer cette entité ?')) await this.onDeleteClick()
        //             break
        //     }
        //     this.$destroy()
        // }
    }
}
</script>

<style lang="sass" scoped>
  #form
    grid-column: 1/2
    grid-row: 1/3
    z-index: 1000
    display: flex
    flex-direction: column
    color: #0e0e0e
    background-color: white
    box-sizing: border-box
    min-width: 20rem
    position: relative
    .groups
      display: flex
      flex-direction: column
      & > *
        margin: 1rem 0
    .buttons
      display: flex
      flex-wrap: wrap
      justify-content: space-evenly
      padding-bottom: 1rem
      input
        padding: 1.2rem .5rem
        color: #EFEFEF
        &:hover, 
        &:focus,
        &:active
          box-shadow: 0px 2px 5px 1px #000000
          -webkit-box-shadow: 0px 2px 5px 1px #000000
        &:hover
          cursor: pointer
          &[disabled]
            cursor: not-allowed
        &[name="save"]
          background-color: green
        &[name="delete"]
          background-color: red
        &[name="cancel"]
          color: initial

  @media screen and (min-width: 768px) 
    #form
      overflow-y: auto
</style>
