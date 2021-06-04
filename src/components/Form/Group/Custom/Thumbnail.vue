<template>
    <div v-if="modifying || !fileName">
        <input type="file" id="imageInput" @change="changeFiles" :accept="typeAccepted">
        <div class="form-buttons">
            <div v-if="files.length" @click="saveClick" class="save-button">Enregistrer</div>
            <div v-if="fileName" @click="cancel">Annuler</div>
        </div>
    </div>
    <div v-else>
        <template v-if="img!=null">
            <img :src="img">
        </template>
        <p v-else >Image loading ...</p>
        <div class="form-buttons">
            <div @click="deleteClick" class="delete-button">Supprimer</div>
            <div @click="modifying=true" >Modifier</div>
        </div>
    </div>

</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import fileAPI from '@/fileAPI'

export default {
    data() {
        return {
            img: null,
            modifying: false,
            files: [],
        }
    },
    props: {
        category: { type: String, default: '' },
        field: { type: Object, default: () => {} },
        value: { type: [String, Number, Boolean, Date], default: () => null },        
    },
    computed: {
        typeAccepted: function(){
            return "image/*"
        },
        ...mapGetters({
            feature: 'feature/selected',
        }),
        fileName: function(){
            return this.feature.properties[this.field.name].value;
        },
    },
    methods: {
        ...mapMutations(['feature/updateAttribute']),

        ...mapActions(['feature/save']),

        changeFiles(e) { this.files = e.target.files },

        resetFileInput() { document.querySelector('#imageInput').value = null },

        cancel(){
            this.modifying = false
            this.resetFileInput()
        },

        async saveClick(){
            if (this.modifying) {
                await this.updateImage()
            }else await this.postImage()

            await this['feature/save']()
 
        },

        async updateImage(){
            console.log("update");
            try {
                let newFileName = await fileAPI.putFile(this.files[0], this.fileName, this.feature.layer, true)
                if (newFileName) {
                    this.$emit('change', { target : { value: newFileName }})
                    this.resetFileInput()
                    this.modifying = false
                    this.getImage()
                }
            } catch (err) {
                console.log(err);
            }
        },

        async postImage(){
            console.log("post");
            try {
                let newFileName = await fileAPI.postFile(this.files[0], this.feature.layer, true)
                if (newFileName) {
                    this.$emit('change', { target : { value: newFileName }})
                    this.modifying = false
                    this.resetFileInput()
                    this.getImage()
                }
            } catch (err) {
                console.log(err);
            }
        },

        async deleteClick(){

            if (confirm("Êtes-vous sûr de vouloir supprimer l'image ?")) {
                console.log("delete");
    
                try {
                    let resDelete = await fileAPI.deleteAFile(this.fileName, this.feature.layer, true);
                    if (resDelete) {
                        this.$emit('change', { target : { value: null }})
                        this.img = null
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        },

        async getImage(){
            if(this.fileName) {
                try {
                    const imgUrl = await fileAPI.getFile(this.fileName, this.feature.layer, true);
                    if (imgUrl) this.img = imgUrl;
                } catch (err) {
                    console.log(err);
                }
            } 
         }
    },
    mounted() {
        this.getImage()
    },
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
        font-size: .75rem
        font-weight: 500 
        padding: .5rem
        border: 1px solid #333333
        border-radius: .5rem

        &:hover,&:focus,&:active
            box-shadow: 0px 3px 2px 0px rgba(0, 0, 0, 0.5)
            -webkit-box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.5)

            &::not(.delete-button, .save-button)
                color: #333333
                background-color: #f0f0f0
                

    .delete-button
        background-color: red
        color: white

    .save-button
        background-color: green
        color: white
</style>
