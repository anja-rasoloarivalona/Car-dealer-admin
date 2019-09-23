import React, { Component } from 'react'
import './AddProduct.css';


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
        urlImages: []
    }

    uploadHandler = async e => {

        e.preventDefault();

        const { images } = this.state;


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
        }



            
            
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

    render() {

     //const {url} = this.state;

    

        return (
            <section className="add-product">
                <form className="add-product__form">
                    <Input className="add-product__input add-product__input--title"
                        id="title"
                        placeholder="titre"
                        control="input"
                        type="text"
                        value=""
                    />             

                    <FilePond className="add-product__input--mainImg"
                              allowMultiple={true}
                              onupdatefiles={this.filesHandler}                 
                        />

                    <Input className="add-product__input"
                        id="made"
                        placeholder="marque"
                        control="input"
                        type="text"
                        value=""
                    />     

                    <Input className="add-product__input"
                        id="model"
                        placeholder="modèle"
                        control="input"
                        type="text"
                        value=""
                    />    


                    <Input className="add-product__input"
                        id="year"
                        placeholder="année"
                        control="input"
                        type="text"
                        value=""
                    />

                    <Input className="add-product__input"
                        id="price"
                        placeholder="prix"
                        control="input"
                        type="number"
                        value=""
                    />  

                    <Input className="add-product__input"
                        id="kilometers"
                        placeholder="Nb kilomètres"
                        control="input"
                        type="text"
                        value=""
                    />

                    <Input className="add-product__input"
                        id="gazol"
                        placeholder="Essence ou diesel"
                        control="input"
                        type="text"
                        value=""
                    />

                    <Input className="add-product__input"
                        id="yearOnRoad"
                        placeholder="Année de mise en circulation"
                        control="input"
                        type="text"
                        value=""
                    />

                    <Input className="add-product__input"
                        id="numberOwners"
                        placeholder="Nb de propriétaires"
                        control="input"
                        type="text"
                        value=""
                    />

                    <Input className="add-product__input"
                        id="seriesNumber"
                        placeholder="Numéro de série"
                        control="input"
                        type="text"
                        value=""
                    />

                    <Input className="add-product__input"
                        id="generalState"
                        placeholder="État général"
                        control="input"
                        type="text"
                        value=""
                    />

                    <button onClick={this.uploadHandler}>Upload</button>
               
                </form>

                
            </section>   
    )}

}
export default AddProduct;

