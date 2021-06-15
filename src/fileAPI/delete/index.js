import { form as config, fileAPI as confAPI } from '@/app.config.json'
import axios from "axios";
const baseUrl = confAPI.baseUrl

const deleteImages = async (f) => {
    const layer = f.parent.layer;
    for await (const i of config["thumbnail"]) {
        let fileIndex = Object.keys(f.properties).indexOf(i.name);
        let fileName = Object.entries(f.properties)[fileIndex];
        if (fileName && fileName[1] && fileName[1].value) {
            await axios.delete(`${baseUrl}/${layer}/images/${fileName.value}`)
                        .then((r) => {
                            console.log(r.data);
                            f.properties[i.name].value = null;
                        })
                        .catch(err => { 
                            if (err.response && err.response.status === 404) return
                            else throw new Error(err);
                        });
        }
    }
        
}

const deleteFiles = async (f) => {
    const layer = f.parent.layer;
    for await (const i of config['fileInput']){
        let fileIndex = Object.keys(f.properties).indexOf(i.name);
        let fileName = Object.entries(f.properties)[fileIndex]
        if (fileName && fileName[1] && fileName[1].value) {
            await axios.delete(`${baseUrl}/${layer}/files/${fileName.value}`)
                        .then((r) => { 
                            console.log(r.data);
                            f.properties[i.name].value = null;
                        })
                        .catch(err => { 
                            if (err.response && err.response.status === 404) return
                            else throw new Error(err);
                        });
        }
    }
}


const deleteAFile = async (fileName, layer, isImage = false) => {
    
    let uri = `${baseUrl}/${layer}/${isImage?'images':'files'}/${fileName}`
    // let uri = `${baseUrl}/test/${isImage?'images':'files'}/${fileName}`

    let r;
    await axios.delete(uri)
    .then(res => {
        if (res.status == 200) {
            r = res.data;
        }
    }).catch(async err => { 
        throw new Error(err);
    });
    return r;
}

export { deleteImages, deleteFiles, deleteAFile };