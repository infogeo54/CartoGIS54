
import { deleteFiles, deleteImages, deleteAFile } from './delete'
import { fileAPI as confAPI } from '@/app.config.json'
const baseUrl = confAPI.baseUrl

import axios from 'axios'

// const baseUrl = "http://localhost:8888"

const deleteAllFiles = async (f) => {
    try {
        await deleteFiles(f);
        await deleteImages(f);
        return true
    } catch (err) {
        console.log(err.message);
    }
}

/**
 * Create a GET request for a file
 * 
 * @param { string } fileName - The name of the file to get
 * @param { string } layer - The name of the layer of the feature 
 * @param { boolean } [isImage=false] - Is the file for Thumbnail (image)  
 * @returns { string } The file Url 
 */
const getFile = async (fileName, layer, isImage = false) => {
    
    let uri = `${baseUrl}/${layer}/${isImage?'images':'files'}/${fileName}`

    let fileUrl;
    await axios.get(uri, {
        responseType: 'blob'
    }).then(res => {
        if (res.status == 200) {
            fileUrl = URL.createObjectURL(res.data);
        }
    }).catch(async err => { 
        if (err.response && err.response.status === 404) {
            let errUrl = URL.createObjectURL(err.response.data);
            await axios.get(errUrl, { responseType: 'json'})
                        .then(mess => { throw new Error(mess.data) })
                        .catch(err => { throw new Error(err) });
        } else throw new Error(err);
    });
    return fileUrl;
}

/**
 * Create a POST request for a file
 * 
 * @param { File } file - The file to post
 * @param { string } layer - The name of the layer of the feature 
 * @param { boolean } [isImage=false] - Is the file for Thumbnail (image)  
 * @returns { string } The new name of the file 
 */
const postFile = async (file, layer, isImage = false) => {
    let uri = `${baseUrl}/${layer}/${isImage?'images':'files'}`


    const data = new FormData();
    data.append(`${isImage?'image':'file'}`, file);

    let name;
    await axios.post(uri, data, {
        headers: {
            'Content-Type' : 'multipart/form-data'
        }
    }).then(res => {
        name = res.data.name
    }).catch(err => {
        throw new Error(err.message);
    });
    return name;
}

/**
 * Create a PUT request for a file
 * 
 * @param { File } file - The new file to put
 * @param { string } fileName - The name of the old file 
 * @param { string } layer - The layer name of the feature 
 * @param { boolean } [isImage=false] - Is the file for Thumbnail (image)  
 * @returns { string } The new name of the file 
 */
const putFile = async (file, fileName, layer, isImage=false) => {
    let uri = `${baseUrl}/${layer}/${isImage?'images':'files'}/${fileName}`

    const data = new FormData();
    data.append(`${isImage?'image':'file'}`, file);

    let name;
    await axios.put(uri, data, {
        headers: {
            'Content-Type' : 'multipart/form-data'
        }
    }).then(res => {
        name = res.data.name
    }).catch(err => {
        throw new Error(err);
    });
    return name;

}

/**
 * Test if the FileAPI responds
 * 
 * @returns { boolean } do the FileAPI responds
 */
const ping = async() => {
    let uri = `${baseUrl}/ping`
    let resp = false;

    await axios.get(uri).then(res => { 
        if(res.status == 200) {
            resp = true;
        }
    }).catch(() => { return });
    return resp;
}


export { deleteAllFiles, deleteAFile, getFile, postFile, putFile, ping }

export default { 
    deleteAllFiles,
    deleteAFile,
    getFile,
    postFile,
    putFile,
    ping,
} 