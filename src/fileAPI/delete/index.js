import { form as config } from '@/app.config.json'
import axios from "axios";

const baseUrl = "http://localhost:8888"

const deleteImages = async (f) => {
    for await (const i of config["thumbnail"]) {
        let fileIndex = Object.keys(f.properties).indexOf(i.name);
        let fileName = Object.entries(f.properties)[fileIndex][1].value;
        if (fileName) {
            await axios.delete(`${baseUrl}/test/images/${fileName}`)
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
    for await (const i of config['fileInput']){
        let fileIndex = Object.keys(f.properties).indexOf(i.name);
        let fileName = Object.entries(f.properties)[fileIndex][1].value;
        if (fileName) {
            await axios.delete(`${baseUrl}/test/files/${fileName}`)
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
    
    // let uri = `${baseUrl}/${layer}/${isImage?'images':'files'}/${fileName}`
    let uri = `${baseUrl}/test/${isImage?'images':'files'}/${fileName}`

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