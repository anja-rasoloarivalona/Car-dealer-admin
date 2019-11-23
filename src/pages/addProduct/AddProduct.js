import React, { Component } from "react";
import "./AddProduct.css";
import uuid from 'uuid/v4';


import { formGeneral } from "./forms/formGeneral";
import { formTech } from "./forms/formTech";
import { formDesign } from "./forms/formDesign";
import { formSupplier } from './forms/formSupplier';

import FormFeature from './forms/formFeature/FormFeature';
import Filepicker from './forms/filePicker/FilePicker';
import { storage } from "../../firebase";
import Input from "../../components/formInput/FormInput";
import Button from '../../components/button/Button';
import { connect } from 'react-redux'
import * as actions from '../../store/actions';
import Loader from '../../components/loader/Loader';

class AddProduct extends Component {

  state = {
    images: [],
    urlImages: [],
    albumId: '',
    loading: false,

    /*We need all inputs in one array to send the date easiliy */
    fullForm: [],
    /*We need to store each array into an array to build the UI easily */
    fullFormPart: [],  

    featuresList: [],
    featureBeingAdded: '',
    showImage: false,

    productBeingEdited: {},
    productBeingEditedID: '',
    productBeingEditedCurrentUrlImages: [], 
    newFullForm: {},

    productBeingEditedCurrentUrlImagesWithChekedOption: [],
    selectedImages: [],
    cancelImageDeletingAllowed: false,

  }; 

  componentDidMount() {   
    let suppliers = this.props.suppliers;

    //Before adding or updating a product, we need the list of suppliers
    if(suppliers){
        //The list of suppliers has already been initialized in redux
        this.preparesDataHandler(suppliers)
    } else {
      //The list of suppliers has not been initialized yet in redux 
      this.fetchSuppliers()
    }
  }

  fetchSuppliers = () => {
    let url = 'http://localhost:8000/suppliers';  
    fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(res => {
        if(res.status !== 200 && res.status !== 201){
            throw new Error('Could not fetch suppliers')
        }
        return res.json()
    })
    .then(resData => {
        let suppliers = resData.suppliers;
        //We need to set the current view for the suppliers list page
        suppliers.forEach(supplier => {
            supplier.currentView = 'contacts'
        })
      this.preparesDataHandler(suppliers)
      this.props.setSuppliers(suppliers)
  
    })
    .catch( err => {
        console.log(err)
    })
  }

  preparesDataHandler = suppliersData => {

    /*------INITIALIZE THE SUPPLIER SELECT OPTIONS-----*/
      let suppliers;
      if(this.props.suppliers){
        suppliers = this.props.suppliers
      } else {
        suppliers = suppliersData
      }

      let suppliersName = [];
      suppliers.forEach(supplier => {
        suppliersName.push(supplier.name)
      })

      let updatedFormSupplier = [...formSupplier, {
          id: 'supplier',
          value: suppliersName[0],
          placeholder: 'fournisseur',
          control: 'select',
          type: 'text',
          formType: "general",
          label: "fournisseur",
          options: suppliersName
      }]
    

    /*------CREATE A DEEP CLONE IF EACH PART OF THE FORM SO WE NEVER MUTATE THE ORIGINAL DATAS------*/
      const initFormSupplier = updatedFormSupplier.map( a => ({ ...a}))
      const initFormGeneral = formGeneral.map( a => ({...a}));
      const initFormTech = formTech.map(a => ({...a}));
      const initFormDesign = formDesign.map(a => ({...a}));

      //INIT FULL FORM WILL BE USED TO STORE ALL THE DATA TO BE SENT TO THE SERVER
      const INIT_FULL_FORM = initFormGeneral.concat( initFormSupplier, initFormTech, initFormDesign);

      //INIT FULL FORM PART WILL BE USED TO BUILT THE UI
      const INIT_FULL_FORM_PART = [ initFormGeneral, initFormSupplier, initFormTech, initFormDesign];

    /*----ONCE ALL THE DATA ARE INITIALIZED, WE NEDD TO CHECK IF WE ARE ADDING OR EDITING A PRODUCT---*/
 
   if(this.props.editingMode === false){
        /*  ADDING A NEW PRODUCT */
          this.setState({fullForm: INIT_FULL_FORM, fullFormPart: INIT_FULL_FORM_PART })
          return 
    } else {
        /*EDITING A PRODUCT */
          let prod = this.props.productBeingEdited;

          let supplierId = prod.supplier.info._id;
          let general = prod.general;
          let tech = prod.tech
          let design = prod.design
      
          let supplierName; 

          let supplier = {
              supplierReference: prod.supplier.reference,
              supplierPrice: prod.supplier.price,
              supplierId: supplierId
          };

      if(supplierId){
          supplierName = suppliers.find(supplier => supplier._id === supplierId).name;
          supplier.supplier = supplierName;
      }
      

      
     


      let newFullForm = {...general, ...supplier, ...tech, ...design};

      let productBeingEditedCurrentUrlImagesWithChekedOption = [];
      
      this.props.productBeingEdited.imageUrls.forEach( url => {
        productBeingEditedCurrentUrlImagesWithChekedOption = [...productBeingEditedCurrentUrlImagesWithChekedOption, {url: url, checked: false}]
      })
  
      this.setState({
        featuresList: this.props.productBeingEdited.features,
        newFullForm: newFullForm,
        albumId: this.props.productBeingEdited.albumId,
        productBeingEditedCurrentUrlImages: this.props.productBeingEdited.imageUrls,
        productBeingEditedID: this.props.productBeingEdited._id,
        productBeingEditedCurrentUrlImagesWithChekedOption: productBeingEditedCurrentUrlImagesWithChekedOption,
        fullFormPart: INIT_FULL_FORM_PART,

        loading: false
      })
    } 
  }

  

  

  componentWillUnmount(){

    console.log(['UNMOUNTED'])

 if(this.props.editingMode === true){
      this.props.toggleEditingMode()
      this.props.setProductRequestedId('')
      this.props.setProductRequested({})
    }
  }

  inputChangeHandler = (input, value) => {

    const { fullForm, newFullForm } = {...this.state};


    if(this.props.editingMode === false) {
      
      const indexInput = fullForm.findIndex(i => i.id === input);

      let newForm = [...fullForm]

      newForm[indexInput].value = value;

      console.log('new form', newForm)


      this.setState({
        fullForm: newForm
        })
    }

    if(this.props.editingMode === true){

      let upDatedNewFullForm = newFullForm;
          upDatedNewFullForm[input] = value
      this.setState({
        newFullForm: upDatedNewFullForm
      }, () => console.log('new full form',this.state.newFullForm))
    }
  };

  senData = () => {

    
    let suppliers = this.props.suppliers;


    const { fullForm, featuresList, urlImages, newFullForm } = this.state;

    
    let supplierName, supplierId;


    if(this.props.editingMode === true){

       


        supplierName = newFullForm.supplier;
        supplierId = suppliers.find(i => i.name === supplierName)._id;

        console.log( 'new supplier Id ', supplierId);



    } else {
      supplierName = fullForm.find(i => i.id === 'supplier').value;
      supplierId = suppliers.find(i => i.name === supplierName)._id
    }


    const formData = new FormData();

    let method;
    let url;


    if(this.props.editingMode === false){
        fullForm.map(i => formData.append(`${i.id}`, `${i.value}`));
        formData.append('features', featuresList);
        formData.append('imageUrls', urlImages);
        formData.append('albumId', this.state.albumId);
        formData.append('supplierId', supplierId)


        method = 'POST';
        url = "http://localhost:8000/admin/add-product";
    }

    if(this.props.editingMode === true){

      let productBeingEditedUrlImages = [];

      if(this.state.images.length === 0 && this.state.selectedImages.length === 0){
        // we don't need need to add neither delete images
        productBeingEditedUrlImages = this.state.productBeingEditedCurrentUrlImages
      } else {
          
          if(this.state.images.length !== 0 && this.state.selectedImages.length === 0){
            //we need to add new imgUrls but we don't need to delete
            productBeingEditedUrlImages = [...this.state.productBeingEditedCurrentUrlImages, ...this.state.urlImages]
          } 

          if(  this.state.images.length === 0 && this.state.selectedImages.length !== 0){
            //We need to delete the images but we dont need to add new ones
            productBeingEditedUrlImages = this.state.productBeingEditedCurrentUrlImages.filter( url => !this.state.selectedImages.includes(url) )
          }

          if(this.state.images.length !== 0 && this.state.selectedImages.length !== 0){
            //We need to upload and delete images at the same time
            productBeingEditedUrlImages = [...this.state.productBeingEditedCurrentUrlImages, ...this.state.urlImages].filter( url => !this.state.selectedImages.includes(url) )
          }

      }

        for(let i in newFullForm){
          formData.append(`${i}`, `${newFullForm[i]}`)
        };
        formData.append('features', featuresList);
        formData.append('albumId', this.state.albumId);
        formData.append('imageUrls', productBeingEditedUrlImages);
        formData.append('productBeingEditedID', this.state.productBeingEditedID );
        formData.append('supplierId', supplierId)

        method = 'PUT';
        url = "http://localhost:8000/admin/edit-product"
    }



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


        return res.json()
      })
      .then(resData => {
        this.props.setProductRequested(resData.product)
        this.props.setProductRequestedId(resData.product._id)
        return resData
      })
      .then( resData => {
        if(this.props.editingMode === true){  
          this.props.toggleEditingMode()     
          this.props.history.push(`/car/${this.props.productBeingEditedId}`)
        } else {

          this.props.history.push(`/car/${resData.product._id}`)
        }
      })
      .catch(err => {
        this.setState({loading: false})
        console.log(err);
      });


  };

  uploadHandler = async e => {
    e.preventDefault();
    this.setState({loading: true})

    const { images } = this.state;

    let albumId;

    if(this.props.editingMode === true){
      albumId = this.state.albumId
    } else {
      albumId = uuid()
      this.setState({ albumId: albumId})
    }

    if(this.state.images.length !== 0){

      try {
        const urls = await Promise.all( images.map(image => 

            new Promise((resolve, reject) => {
                const uploadTask = storage.ref(`${albumId}--${image.name}`).put(image);
                uploadTask.on('state_changed', 
                (snapshot) => {
                    // progress function....
                },          
                reject,                   
                () => {
                    //complete function...
    
                    storage.ref(`${albumId}--${image.name}`)
                        .getDownloadURL()
                        .then(url => {
                            let imgStored = this.state.urlImages;              
                            imgStored.push(url);

                            this.setState({
                                urlImages: imgStored
                            })
                            resolve(url)
                         })
                })
            })
        ))        
        
        //check if we need to delete images after uploading images

        if(this.state.selectedImages.length === 0 ){
          //we need to send images but no images to delete
          this.senData(); 
        } 

        if( this.state.selectedImages.length !== 0){
          // after sending images, we need to delete as well before sending data
          this.deleteImagesInFirebase()
        }
        
        return urls;
      }
      catch (err){
          this.setState({loading: false})
          console.log(err)
          
      }   
    } 
    
    /*------NO IMAGES TO SEND TO FIREBASE-------*/
    
    else {

        //check if we need to delete
        if(this.state.selectedImages !== 0){
          this.deleteImagesInFirebase()
        } else {
          this.senData();
        }
        
    }  
    
  };

  deleteImagesInFirebase =  async () => {

    const { selectedImages, albumId } = this.state;

    try {
      const imagesDeleted = await Promise.all(

        selectedImages.map(imgUrl => 
          
          new Promise( (resolve, reject) => {
            let first = imgUrl.indexOf('--');
            let end = imgUrl.indexOf('?');
            let imageName = imgUrl.substr(first + 2, (end - first - 2));
            let imageRef = storage.ref(`${albumId}--${imageName}`);

            imageRef.delete()
            .then( () => resolve(imgUrl))
            .catch( err => reject)
          })
        )
    )

    this.senData()

    return imagesDeleted
    }

    catch (err){
      this.setState({loading: false})
      console.log(err)
    } 
  }

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


  selectDeleteHandler = urlSelected => {

    const  data  = this.state.productBeingEditedCurrentUrlImagesWithChekedOption;

    let selectedImages = this.state.selectedImages;

    if(selectedImages.length !== 0){

        if(selectedImages.includes(urlSelected)){
            selectedImages = selectedImages.filter(i => i !== urlSelected)
        } else {
            selectedImages = [...selectedImages, urlSelected]
        }

    } else {
      selectedImages = [...selectedImages, urlSelected]
    }

    // New data with checked key updated for the UI
    let newData = [];

    data.forEach( i => {

        if(i.url === urlSelected){
          //When we find the object having the url selected, we change its checked value

            if(i.checked === false){
              newData = [...newData, { url: i.url, checked: true}];

            } else {
              newData = [...newData, { url: i.url, checked: false}]
            }

            
        } else {
            //Otherwise, we just add the data 
            newData = [...newData, i]
        }
    })

    this.setState({
        productBeingEditedCurrentUrlImagesWithChekedOption : newData,
        selectedImages: selectedImages
      })
  
  }


  deleteImageOnThePage = e => {
    e.preventDefault()

    let imagesWithCheck = this.state.productBeingEditedCurrentUrlImagesWithChekedOption 
    let newCurrentImages = imagesWithCheck.filter(i => i.checked !== true)

    this.setState({
      productBeingEditedCurrentUrlImagesWithChekedOption: newCurrentImages,
      cancelImageDeletingAllowed: true
    })

    
  }

  cancelDeleteCurrentImageHandler = e => {
    e.preventDefault()

    const { selectedImages, productBeingEditedCurrentUrlImagesWithChekedOption } = this.state;

    let deletedImages = [];



    selectedImages.forEach( url => {
      deletedImages = [...deletedImages, { url: url, checked: true}]
    })

    let oldImagesWithCheck = [...productBeingEditedCurrentUrlImagesWithChekedOption, ...deletedImages]



    this.setState({ productBeingEditedCurrentUrlImagesWithChekedOption: oldImagesWithCheck,
                    cancelImageDeletingAllowed : false})

  } 

  render() {


    const fullFormPart = this.state.fullFormPart;


    console.log('full form part', fullFormPart);
    
    let addProduct;

    if(this.state.loading === true) {
      addProduct = <Loader />
    } else {
      addProduct = (
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
                            label={i.label}
                            key={i.id}
                            id={i.id}
                            options={i.options}
                            placeholder={i.placeholder}
                            control={i.control}
                            type={i.type}
                            value={ this.props.editingMode === false ? i.value : this.state.newFullForm[i.id]
                              }
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
                    <Filepicker filesHandler={this.filesHandler}
                                productBeingEditedCurrentImages={this.state.productBeingEditedCurrentUrlImagesWithChekedOption}
                                editingMode={this.props.editingMode}
                                selectDeleteHandler={this.selectDeleteHandler}
                                selectedImages ={this.state.selectedImages}
                                onDeleteCurrentImages = {this.deleteImageOnThePage}
                                cancelDeleteImagesAlowed = {this.state.cancelImageDeletingAllowed}
                                onCancelDeleteCurrentImages={this.cancelDeleteCurrentImageHandler}
                    />
                    <div className="add-product__form__controller">
                            <Button onClick={this.hideImageFormHandler}>
                                previous 
                            </Button>
                            <Button onClick={this.uploadHandler}>
                                upload
                            </Button>
                            <Button onClick={this.over}>
                                State
                            </Button>
                    </div>  
              </div>        
            </form>
          </section>
      )
    }

    return addProduct
  }
}

const mapStateToProps = state => {
  return {
      editingMode: state.products.editingMode,
      productBeingEdited: state.products.productRequested,

      productBeingEditedId: state.products.productRequestedId,

      suppliers: state.suppliers.suppliers
  }
}


const madDispacthToProps = dispatch => {
  return {
        toggleEditingMode: () => dispatch(actions.toggleEditingMode()),

        setProductRequested: (prod) => dispatch(actions.setRequestedProduct(prod)),
        setProductRequestedId: (id) => dispatch(actions.setRequestedProductId(id)),

        setSuppliers: suppliers => dispatch(actions.setSuppliers(suppliers))
  }
}
export default connect(mapStateToProps, madDispacthToProps)(AddProduct);


