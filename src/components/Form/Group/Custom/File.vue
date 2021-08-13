<template>
    <div v-if="apiWorking">
        <div v-if="modifying || !fileName">
            <input type="file" id="fileInput" @change="changeFiles" :accept="acceptedTypes">
            <div class="form-buttons">
                <div v-if="files.length" @click="saveClick" class="save-button">Enregistrer</div>
                <div v-if="fileName" @click="cancel" class="cancel-button">Annuler</div>
            </div>
        </div>
        <div v-else>
            <template v-if="url!=null">
                <a :href="url" download>
                    Télécharger la pièce jointe
                </a>
            </template>
            <p v-else>File loading ...</p>
            <div class="form-buttons">
                <div @click="deleteClick" class="delete-button">Supprimer</div>
                <div @click="modifying=true" class="modify-button">Modifier</div>
            </div>
        </div>
    </div>

    <div v-else>Gestion des fichiers non disponible pour le moment</div>

</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { fileAPI as confAPI } from '@/app.config.json'

import fileAPI from '@/fileAPI'

export default {
    data() {
        return {
            url: null,
            modifying: false,
            files: [],
        }
    },
    props: {
        category: { type: String, default: '' },
        field: { type: Object, default: () => {} },
        value: { type: [String, Number, Boolean, Date, Object], default: () => null },
    },
    computed: {
        acceptedTypes: function(){
            let acceptedTypes = []
            Object.entries(confAPI.acceptedTypes).forEach(types => {
                if (Array.isArray(types[1])) { 
                    types[1].forEach(subtype => {
                        acceptedTypes.push(`${types[0]}/${subtype}`);
                    });
                }
                else acceptedTypes.push(`${types[0]}/*`);
            });
            return(acceptedTypes.join(','));
        },
        ...mapGetters({
            feature: 'feature/selected',
            apiWorking: 'apiWorking',
        }),
        fileName: function(){
            return this.feature.properties[this.field.name].value;
        }
    },
    methods: {
        ...mapMutations(['feature/updateAttribute']),

        ...mapActions(['feature/save']),

        changeFiles(e) { this.files = e.target.files },

        resetFileInput() { document.querySelector('#fileInput').value = null },

        cancel(){
            this.modifying = false
            this.resetFileInput()
        },


        async saveClick(){
            if (this.modifying) await this.updateFile()
            else await this.postFile()

            await this['feature/save']()
        },

        async updateFile () {
            if(this.fileName && this.fileName.length){
                try {
                    let newFileName = await fileAPI.putFile(this.files[0], this.fileName, this.feature.layer)
                    if (newFileName) {
                        this.$emit('change', { target : { value: newFileName }})
                        this.resetFileInput()
                        this.modifying = false
                        this.getFile()
                    }
                } catch (err) { console.log(err); }
            }
        },

        async postFile () {
            try {
                let newFileName = await fileAPI.postFile(this.files[0], this.feature.layer)
                if (newFileName) {
                    this.$emit('change', { target : { value: newFileName }})
                    this.modifying = false
                    this.resetFileInput()
                    this.getFile()
                }
            } catch (err) { console.log(err); }
        },

        async deleteClick(){
            if (this.fileName && this.fileName.length) {
                if (confirm("Êtes-vous sûr de vouloir supprimer le fichier ?")) {        
                    try {
                        let resDelete = await fileAPI.deleteAFile(this.fileName, this.feature.layer);
                        if (resDelete) {
                            this.$emit('change', { target : { value: "" }})
                            this.url = null
                        }
                        await this['feature/save']()
                    } catch (err) { console.log(err); }
                }
            }
            
        },

        async getFile(){   
            if(this.fileName && this.fileName.length) {
                try {
                    const fileUrl = await fileAPI.getFile(this.fileName, this.feature.layer);
                    if (fileUrl) this.url = fileUrl 
                } catch (err) { console.log(err); }
            }
        }
    },
    mounted() {
        if (this.apiWorking) this.getFile()
    },
    watch:{
      feature: function(){
        this.getFile()
      }
    }
}
</script>

<style lang="sass" scoped>
div
  text-align: center

  img
      max-width: 100%
      height: auto

.form-buttons
    display: flex
    flex-direction: row-reverse
    justify-content: space-between
    margin-top: .5rem
    & > div
        font-size: .85rem
        padding: .75rem .5rem
        border-radius: .5rem

        &:hover,&:focus,&:active
            box-shadow: 0px 3px 2px 0px rgba(0, 0, 0, 0.5)
            -webkit-box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.5)

            &::not(.delete-button, .save-button)
                color: #333333
                background-color: #f0f0f0
                
</style>
