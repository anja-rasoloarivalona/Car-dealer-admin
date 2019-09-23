import React, { Component } from 'react'
import './AddProduct.css';

import {formGeneral} from './forms/formGeneral';

import { FilePond, registerPlugin } from 'react-filepond';
import * as FilePondPluginImagePreview from 'filepond-plugin-image-preview';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';

import { storage } from '../../firebase';
import Input from '../../components/formInput/FormInput';


registerPlugin(FilePondPluginImagePreview);


 class AddProduct extends Component {

    state = {
        images: [],
        urlImages: [],


        formGeneral: formGeneral,
    }


    senData = e => {
        e.preventDefault();

        const { formGeneral } = this.state;

        console.log('fetch going....')

        const formData = new FormData();

        formGeneral.map( i => (
            formData.append(`${i.id}`, `${i.value}`)
        ))

        let url = "http://localhost:8000/admin/add-product";
        let method = 'POST'

        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                },
            method: method,
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(res => {
            if(res.status !==200 && res.status !== 201){
                throw new Error('Creating a product failed')
            }
            return res.json
        })
        .then( resData => {
            console.log(resData)
        })
        .catch(err => {
            console.log(err)
        })
    }


    uploadHandler = async e => {
        e.preventDefault();
        const { images } = this.state;

        /*
        try {
            const urls = await Promise.all( images.map(image => 
                new Promise((resolve, reject) => {
                    const uploadTask = storage.ref(`africauto/${image.name}`).put(image);
                    uploadTask.on('state_changed', 
                    (snapshot) => {
                        // progress function....
                    },
                    
                    reject,                   
                    () => {
                        //complete function...
        
                        storage.ref('africauto').child(image.name)
                            .getDownloadURL()
                            .then(url => {
                                let imgStored = this.state.urlImages;              
                                imgStored.push(url);

                                this.setState({
                                    urlImages: imgStored
                                }, () => console.log(this.state.urlImages))
                                resolve(url)
                            })
                    })
                })
            ))
            console.log('done', this.state.urlImages);
            return urls;
        }
        catch (err){
            console.log(err)
        }      */

    }


    filesHandler = files => {
        let images = [];
        files.forEach(file => {
            let a = file.file;
            images = [...images, a]
        })
        this.setState({
            images: images
        })
    }


    inputChangeHandler = (input, value, type) => {
        const { formGeneral } = this.state;
        const indexInput = formGeneral.findIndex(i => i.id === input);
        let newForm = formGeneral;
        newForm[indexInput].value = value;
        this.setState({
            formGeneral: newForm
        })
    }



    render() {

     const oldForm = this.state.formGeneral;

    

        return (
            <section className="add-product">
                <form className="add-product__form">

                    {
                        oldForm.map( i=> (
                            <Input className="add-product__input"
                                   key={i.id}
                                   id={i.id}
                                   placeholder={i.placeholder}
                                   control={i.control}
                                   type={i.type}
                                   value={i.value}
                                   formType="general"
                                   onChange={this.inputChangeHandler}/>
                        ))
                    }
                                                        
                    <button onClick={this.senData}>Upload</button>
               
                </form>

                
            </section>   
    )}

}
export default AddProduct;

 /*<FilePond className="add-product__input--mainImg"
                              allowMultiple={true}
                              onupdatefiles={this.filesHandler}                 
      />
*/ 