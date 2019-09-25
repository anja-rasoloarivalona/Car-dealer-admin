import React, { Component } from "react";
import "./AddProduct.css";
import uuid from 'uuid/v4';

import { formGeneral } from "./forms/formGeneral";
import { formTech } from "./forms/formTech";
import { formDesign } from "./forms/formDesign";
import FormFeature from './forms/formFeature/FormFeature';

import { FilePond, registerPlugin } from "react-filepond";
import * as FilePondPluginImagePreview from "filepond-plugin-image-preview";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond/dist/filepond.min.css";

import { storage } from "../../firebase";
import Input from "../../components/formInput/FormInput";


import Button from '../../components/button/Button';




registerPlugin(FilePondPluginImagePreview);

class AddProduct extends Component {
  state = {
    images: [],
    urlImages: [],
    albumId: '',

    /*We need all inputs in one array to send the date easiliy */
    fullForm: formGeneral.concat(formTech, formDesign),



    /*We need to store each array into an array to develop the UI easily */
    fullFormPart: [formGeneral, formTech, formDesign],
    featuresList: [],

    
    featureBeingAdded: '',



    showImage: false,



    editingMode: false,
    productBeingEditedId: null,


    productBeingEdited: {}

  };

  componentDidMount() {

    if(this.props.history.location.state === undefined){
        return console.log('new')
    } else {
        this.setState({
          editingMode: true,
          productBeingEditedId: this.props.history.location.state.prodId
        }, () => console.log(this.state.editingMode, this.state.productBeingEditedId))
    }

 
  }

  senData = () => {

    const { fullForm, featuresList, urlImages } = this.state;

    console.log("fetch going....");

    const formData = new FormData();

    fullForm.map(i => formData.append(`${i.id}`, `${i.value}`));
    formData.append('features', featuresList);
    formData.append('imageUrls', urlImages);
    formData.append('albumId', this.state.albumId);

    let url = "http://localhost:8000/admin/add-product";
    let method = "POST";

    fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: method,
      body: JSON.stringify(Object.fromEntries(formData))
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating a product failed");
        }
        return res.json;
      })
      .then(resData => {
        console.log(resData);
      })
      .catch(err => {
        console.log(err);
      });
  };

  uploadHandler = async e => {
    e.preventDefault();
    const { images } = this.state;

    let albumId = uuid();
    this.setState({ albumId: albumId});
    
        try {
            const urls = await Promise.all( images.map(image => 
                new Promise((resolve, reject) => {
                    const uploadTask = storage.ref(`${albumId}/${image.name}`).put(image);
                    uploadTask.on('state_changed', 
                    (snapshot) => {
                        // progress function....
                    },          
                    reject,                   
                    () => {
                        //complete function...
        
                        storage.ref(`${albumId}`).child(image.name)
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

            this.senData();

            return urls;
        }
        catch (err){
            console.log(err)
        }      
  };

  filesHandler = files => {
    let images = [];
    files.forEach(file => {
      let a = file.file;
      images = [...images, a];
    });
    this.setState({
      images: images
    });
  };

  inputChangeHandler = (input, value) => {
    const { fullForm } = this.state;
    const indexInput = fullForm.findIndex(i => i.id === input);
    let newForm = fullForm;
    newForm[indexInput].value = value;
    this.setState({
      fullForm: newForm
    });
  };

  showImageFormHandler = e => {
      e.preventDefault();
      window.scrollTo(0, 0);
    if(this.state.showImage === false){
        this.setState({showImage: true});
    }  
  }

  hideImageFormHandler = e => {
     e.preventDefault();
     window.scrollTo(0, 0);
      if(this.state.showImage === true){
        this.setState({showImage: false});
      }
    
  }


  addFeatureChangeHandler = (input, value) => {
        this.setState({featureBeingAdded: value})
  }

  addFeature = e => {
      e.preventDefault();
      const {featureBeingAdded, featuresList} = this.state;
      let newList = [...featuresList, featureBeingAdded];
      this.setState({featuresList: newList})
  }

  deleteFeature = i => {
      let {featuresList} = this.state;
      let newList = featuresList.filter(el => el !== i);
      this.setState({featuresList: newList})
  }



  

  render() {
    const fullFormPart = this.state.fullFormPart;

    return (
      <section className="add-product">
        <form className="add-product__form">

          <div className={`add-product__part add-product__part--details 
                           ${this.state.showImage === true ? 'hide' : '' }`}>

            {fullFormPart.map(part => (

              <div className="add-product__part--details__section" key={part[0].formType}>
                <h3 className="add-product__form__title">{part[0].formType}</h3>
                    {part.map(i => (
                    <Input
                        className="add-product__input"
                        key={i.id}
                        id={i.id}
                        placeholder={i.placeholder}
                        control={i.control}
                        type={i.type}
                        value={i.value}
                        formType={i.formType}
                        onChange={this.inputChangeHandler}
                    />
                    ))}
              </div>

            ))}

            <div className="add-product__part--details__section">
                <h3 className="add-product__form__title">options</h3>
                <FormFeature featuresList={this.state.featuresList}
                             addFeatureChangeHandler={this.addFeatureChangeHandler}
                             value={this.state.featureBeingAdded}
                             addFeature={this.addFeature}
                             deleteFeature= {this.deleteFeature}
                />
            </div>
            
            <div className="add-product__form__controller">
                <Button onClick={this.showImageFormHandler}>
                    next
                </Button>
                
            </div>
          </div>
          
          <div className={`add-product__part add-product__part--image 
                           ${this.state.showImage === true ? 'show' : '' }`}>
                <h3 className="add-product__form__title">Images</h3>          
                <FilePond className="add-product__filepond"
                          allowMultiple={true}
                          onupdatefiles={this.filesHandler}                 
                /> 
                <div className="add-product__form__controller">
                        <Button onClick={this.hideImageFormHandler}>
                            previous 
                        </Button>
                        <Button onClick={this.uploadHandler}>
                            upload
                        </Button>
                </div>  
          </div>  

          

          

          
        </form>
      </section>
    );
  }
}
export default AddProduct;


