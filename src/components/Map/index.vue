<template>
    <div id="map-container">
        <div class="ux-right-buttons">
            <button v-if="feature" @click="cancel" id="btn-cancel">Annuler</button>
            <button id="btn-validate" v-if="isValidate" @click="validateButtonClicked">
                Voir la fiche
            </button>
            <button id="btn-edit" v-if="isEditable" @click="editableButtonClicked" >
                <template v-if="editable">Enlever la modification</template>
                <template v-else>Modifier l'objet</template>
            </button>
            <button id="btn-measurements" v-if="isMeasurable" @click="measurementsButtonClicked" >
                <template v-if="isMeasuring">Retirer les mesures</template>
                <template v-else>Afficher les mesures</template>
            </button>
        </div>
        <div class="ux-left-buttons">

            <HelpButton
                v-for="button in buttons"
                :key="button.name"
                :button="button"
                @clicked="buttonClicked"
            />
            <div v-if="isQuickMeasuring" class="quick-measure">
                <button @click="quickMeasuringCancel" class="quick-draw-cancel">Annuler</button>
            </div>
            <div v-else class="quick-measure">
                <button v-if="!showDrawIcon" class="quick-measure-label" @mouseover="showDrawIcon=true" @click="showDrawIcon=true">Mesure rapide</button>

                <div v-if="showDrawIcon" @mouseout="showDrawIcon=false">
                    <button @click="drawPolygon"><img class="draw-icon" src="/img/icon_polygon.png"></button>
                    <button @click="drawPolyline"><img class="draw-icon" src="/img/icon_polyline.png"></button>
                </div>

            </div>

        </div>
        <Map />
    </div>
</template>

<script>
import Map from "./Map";
import HelpButton from "./Button";
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { bus } from '@/main.js'

export default {
    name: "MapContainer",
    components: { Map, HelpButton },
    props: {
      buttons: { type: Array, default: () => [] }
    },
    data() {
        return {
            isMeasuring: false,
            showDrawIcon: false,
            isQuickMeasuring: false,
        }
    },
    computed: {
        ...mapGetters({
            feature: 'feature/selected',
            ogCoordinates: 'feature/ogCoordinates',
            editable: 'feature/editable',
            formVisible: 'form/formVisible',
            layers: 'layer/list',
            selectedLayer: 'layer/selected',
            quickMeasure: 'quickMeasure/quickMeasure',
            map: 'map',
            isDrawing: 'isDrawing',          
        }),
        isValidate(){
            if (this.feature && !this.formVisible){

                if (this.feature.properties.geometry.type=="gml:MultiPolygonPropertyType") {
                    if (this.feature.coordinates.length < 3) return false;
                }
                if (this.feature.properties.geometry.type=="gml:MultiLineStringPropertyType") {
                    if (this.feature.coordinates.length < 2) return false;
                }
                return !!this.feature.representation

            } 
            return false
        },
        isEditable(){
            
            if (this.feature) {
                if (window.innerWidth < 768 && this.formVisible) return false;
                return !!this.feature.representation
            }
            return false

        },
        isMeasurable(){
            if (this.feature){
                if(this.feature.representation && this.feature.representation._latlngs) return !!this.feature.representation
                else if (this.feature.properties.geometry.type != 'gml:PointPropertyType') return true 
                
            }
            return false
        },

    },

    methods: {
        ...mapMutations([
            'layer/setSelected',
            'form/toggleVisibility',
            'form/setVisibility',
            'feature/setEditable', 
            'feature/toggleEdit',
            'feature/setSelected',
            'quickMeasure/setType',
            'quickMeasure/cancel',
        ]),

        ...mapActions([
            'feature/cancel'
        ]),

        validateButtonClicked (){
            this['feature/setEditable'](false)
            this['feature/toggleEdit'](this.map)
            this['form/toggleVisibility']()
        },
        

        editableButtonClicked (){
            (this.editable) ? this['feature/setEditable'](false) : this['feature/setEditable']()
            this['feature/toggleEdit'](this.map)
        },

        measurementsButtonClicked(){
            (this.isMeasuring == true) ? this.isMeasuring = false : this.isMeasuring = true;
        },

        buttonClicked (button) {
            this.$emit('button-clicked', button)
        },

        cancel () {
            this['feature/cancel']()
            this['feature/setSelected'](null)
            this['form/setVisibility'](false)
            this['feature/setEditable'](false)
            this['feature/toggleEdit'](this.map)

            if (this.selectedLayer) {
                const layer = this.layers.find(l => l.properties.name === this.selectedLayer.properties.name)
                bus.$emit('layerItemClicked')
                this['layer/setSelected'](layer)
            }
        },

        drawPolygon () {
            this.isQuickMeasuring=true;            
            this['quickMeasure/setType']('polygon');
        },

        drawPolyline () {
            this.isQuickMeasuring=true;
            this['quickMeasure/setType']('polyline');
        },

        quickMeasuringCancel () {
            this.isQuickMeasuring=false; 
            this.showDrawIcon=false;
            this['quickMeasure/cancel']();           
        },

        centerOnFeature (f) {
            let c = (Array.isArray(f.coordinates[0])) 
                    ? f.representation.getBounds().getCenter() 
                    : c = f.coordinates;
            this.map.panTo(c)
        }

    },

    watch: {
        isValidate(){
            if (this.isValidate && window.innerWidth >= 768) this.validateButtonClicked();
        },

        isMeasuring: function(){
            if (this.feature) {
                this.feature.representation.hideMeasurements()
                if (this.isMeasuring && this.feature.representation) this.feature.representation.showMeasurements()
            }
        },        
    },

    mounted() {
        bus.$on('resetIsMeasuring', () => { this.isMeasuring=false })
        bus.$on('centerOnFeature', (f) => { this.centerOnFeature(f) });
    }

}
</script>

<style lang="sass" scoped>
#map-container
    width: 100%
    position: relative
    overflow: hidden

    & > .ux-right-buttons 
        position: absolute
        top: .5rem
        right: .5rem
        z-index: 1000
        display: flex
        flex-direction: column

        & > #btn-cancel
            background-color: #f4f4f4
            color: #0e0e0e
            margin-bottom: .5rem

        & > #btn-validate
            background-color: #259325
            margin-bottom: .5rem

        & > #btn-edit
            background-color: #ff8000
            margin-bottom: .5rem

        & > #btn-measurements
            background-color: #087519

    & > .ux-left-buttons
        position: absolute
        top: .5rem
        left: 12px
        z-index: 1000

    .quick-measure
        margin-top: 6rem

        .quick-measure-label,
        .quick-draw-cancel
            max-width: 5rem
            max-height: 2.5rem
            font-size: 0.8rem
            font-weight: normal
            color: black

        button
            max-width: 2.5rem
            max-height: 2.5rem

            .draw-icon
                max-width: 100%
                max-height: 100%

        button:hover,
        button:focus,
        button:active
            background-color: #9e9e9e
                

            


    @media screen and (min-width: 768px)
        
        & > .ux-left-buttons
            top: 5.5rem
</style>