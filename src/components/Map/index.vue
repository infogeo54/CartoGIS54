<template>
    <div id="map-container">
        <div class="ux-buttons">
            <button v-if="feature" @click="cancel" id="btn-cancel">
                <i class="fas fa-undo-alt"></i>
                Annuler
            </button>
            <button id="btn-validate" v-if="isValidate" @click="validateButtonClicked">
                <i class="fas fa-file-invoice"></i>
                Voir la fiche
            </button>
            <div class="buttonsBar" @mouseleave="buttonsBarIsVisible=true" >
                <button class="burgerButton" @mouseenter="buttonsBarIsVisible=false" :class="[ buttonsBarIsVisible ? 'isNotActive' : 'isActive']">
                    <i class="fas fa-bars"></i>
                    Outils
                </button>
                <template v-if="isButtonsBarVisible" >
                    <button id="btn-edit" v-if="isEditable" @click="editableButtonClicked" >
                        <template v-if="editable">
                            <img src="/img/icon_editable_hide.png" />
                            Enlever la modification
                        </template>
                        <template v-else>
                            <img src="/img/icon_editable_show.png" />
                            Modifier l'objet
                        </template>
                    </button>
                    <button id="btn-measurements" v-if="isMeasurable" @click="measurementsButtonClicked" >
                        <template v-if="isMeasuring">
                            <img src="/img/icon_measure_hide.png" />
                            Retirer <br> Mesures
                        </template>
                        <template v-else>
                            <img src="/img/icon_measure_show.png" />
                            Afficher Mesures
                        </template>
                    </button>
                    
                    <!-- Quick Measure-->
                    <div v-if="isQuickMeasuring" class="quick-measure">
                        <button @click="quickMeasuringCancel" class="quick-draw-cancel">
                            <img src="/img/icon_quick_measure_hide.png" />
                            Annuler
                        </button>
                    </div>
                    <div v-else class="quick-measure">

                        <div v-if="showDrawIcon" @mouseout="showDrawIcon=false" class="quick-measure-choice">
                            <button @click="drawPolygon">
                                <img class="draw-icon" src="/img/icon_measure_polygon.png">
                                surface    
                            </button>
                            <button @click="drawPolyline">
                                <img class="draw-icon" src="/img/icon_measure_polyline.png">
                                distance
                            </button>
                        </div>
                        <button v-else class="quick-measure-label" @mouseover="showDrawIcon=true" @click="showDrawIcon=true">
                            <img src="/img/icon_quick_measure_show.png" />
                            Mesurer
                        </button>

                    </div>
                </template>
            </div>
            <HelpButton
                v-for="button in buttons"
                :key="button.name"
                :button="button"
                @clicked="buttonClicked"
            />
        </div>
        <div class="step-2-header">           
            <h2>2</h2>
                <h3>Je localise <br/>mon objet</h3>
        </div>
        <div class="step-3-header">
            <h2>3</h2>
            <h3>Je remplis <br/>la fiche</h3>
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
            buttonsBarIsVisible: true,    
            isQuickMeasuring: false,
            windowWidth: window.innerWidth,
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
            if (this.feature && !this.formVisible && this.feature.coordinates){
                if (this.feature.type=="polygon") return(this.feature.coordinates.length >= 3);
                if (this.feature.type=="polyline") return(this.feature.coordinates.length >= 2);
                return !!this.feature.representation
            } 
            return false
        },
        isEditable(){
            
            if (this.feature) {
                if (this.smallScreen && this.formVisible) return false;
                return !!this.feature.representation
            }
            return false

        },
        isMeasurable(){
            if (this.feature){
                if(this.feature.representation && this.feature.representation._latlngs) return !!this.feature.representation
                else if (this.feature.type != 'point') return true 
                
            }
            return false
        },
        isButtonsBarVisible(){
            return !(this.smallScreen && this.buttonsBarIsVisible)
        },
        smallScreen(){ return(this.windowWidth < 768); }

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
        let el = document.querySelector('.leaflet-control-layers')
        let label = document.createElement('div')
        let t = document.createTextNode('Fonds')
        label.appendChild(t)
        label.classList.add('leaflet-control-label')
        el.appendChild(label)

        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth
        })
    }


}
</script>

<style lang="sass" scoped>
#map-container
    width: 100%
    position: relative
    overflow: hidden

    & > .ux-buttons 
        position: absolute
        top: 15rem
        right: .5rem
        z-index: 1000
        display: flex
        flex-direction: column
        align-items: flex-end

        & > .buttonsBar
 
            display: flex
            flex-direction: row-reverse
            align-items: center

            & > .burgerButton svg
                transition: transform 330ms cubic-bezier(.65,.05,.36,1)

            .isActive svg
                transform: rotate(90deg)

            button
                margin-left: .5rem

        button 
            display: flex
            flex-direction: column
            align-items: center            
            background-color: var(--button-color)
            color: white
            border-radius: .5rem
            border: none
            margin-bottom: .5rem
            padding-bottom: .5rem
            width: 5.5rem
            
            svg, img 
                margin: .5rem auto
                height: auto
            img 
                width: 50%
            
            svg    
                width: 40%

            &:hover,&:active,&:focus
                opacity: .9
            

    .quick-measure

        .quick-measure-label,
        .quick-draw-cancel
            font-size: 0.8rem
            font-weight: normal

        .quick-measure-choice
            button
                flex-direction: row
                padding-bottom: 0
                font-size: .6rem
                border-radius: .5rem

                img
                    padding-right: .3rem

        button:hover,
        button:focus,
        button:active
            background-color: #9e9e9e

    & > .step-2-header,
    & > .step-3-header
        display: flex
        flex-direction: column
        align-items: center
        position: absolute
        z-index: 1000
        background-color: white
        padding: 1rem 
        text-align: center
        & > h2 
            margin: .5rem auto
            font-size: 2.7rem
            font-weight: bold
        & > h3 
            margin: 0 auto .5rem auto

    & > .step-3-header
        right: 0

    @media screen and (min-width: 768px)

        
        & > .ux-buttons 
            top: 18rem

            .burgerButton
                display: none
            
            .buttonsBar
                flex-direction: column
        
        & > .step-2-header,
        & > .step-3-header
            z-index: 2500
            top: 3.5rem
        
</style>