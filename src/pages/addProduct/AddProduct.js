import React, { Component } from "react";
import "./AddProduct.css";
import uuid from 'uuid/v4';


import { INITIAL_FORM } from './forms/formGeneral'

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

    featuresList: [],
    featureBeingAdded: '',
    showImage: false,

    productBeingEdited: {},
    productBeingEditedID: '',
    productBeingEditedCurrentUrlImages: [], 

    productBeingEditedCurrentUrlImagesWithChekedOption: [],
    selectedImages: [],
    cancelImageDeletingAllowed: false,

    initialForm: null,
    requestDataSet: null

  }; 

  componentDidMount() {   
    this.preparesDataHandler()
  }

  preparesDataHandler = ()=> {
    /*------INITIALIZE THE SUPPLIER SELECT OPTIONS-----*/
      let suppliers = this.props.suppliers
      let suppliersName = [];
      suppliers.forEach(supplier => {
        suppliersName.push(supplier.name)
      })

    /*----INITIALIZE THE FORM--------------*/

     let initialForm = {}
     Object.keys(INITIAL_FORM).forEach(dataType => {
          initialForm = {
            ...initialForm,
            [dataType] : {
              ...INITIAL_FORM[dataType],

            } 
          }
     })

    /*----INITIALIZE THE REQUEST DATA SET OBJECT WHICH WILL BE USED TO STORE THE FORM'S VALUE*/

    let requestDataSet = {};
    Object.keys(initialForm).forEach( dataType => {
          Object.keys(initialForm[dataType]).forEach(data => {
              requestDataSet = {
                ...requestDataSet,
                [data] : initialForm[dataType][data].value
              }
          })
      })

    initialForm.supplier.supplierName.options = suppliersName;
  

  /*------CHECKING MODE------------*/
 
   if(this.props.editingMode === false){  
      //ADDING NEW PRODUCT
      requestDataSet.supplierName = suppliersName[0];
      return  this.setState({ initialForm : initialForm, requestDataSet: requestDataSet, loading: false})    
    } else {
      //UDPATING AN EXISTING PRODUCT
          let product = this.props.productBeingEdited;

          console.log(product);

          // Setting all the key value pairs for the request data set object
          Object.keys(product).forEach( dataType => {
            Object.keys(product[dataType]).forEach(data => {
              Object.keys(requestDataSet).forEach(reqData => {
                if(data === reqData){
                  requestDataSet = {
                    ...requestDataSet,
                    [reqData] : product[dataType][data]
                  }
                }
              })
            })
          })

          //Setting manually the supplier name as the identifier doesn't match
          requestDataSet = {
            ...requestDataSet,
            price: product.general.price,
            supplierName: product.supplier.info.name
          }

          //We need to transform each url (string) into an object with the checked property => We need it to select all the images we want to delete later
          let productBeingEditedCurrentUrlImagesWithChekedOption = [];
          product.imageUrls.forEach( url => {
            productBeingEditedCurrentUrlImagesWithChekedOption = [...productBeingEditedCurrentUrlImagesWithChekedOption, {url: url, checked: false}]
          })

          console.log(requestDataSet)

          this.setState({ 
            initialForm : initialForm, 
            requestDataSet: requestDataSet,
            albumId: product.albumId,
            productBeingEditedCurrentUrlImages: product.imageUrls,
            productBeingEditedID: product._id,
            featuresList: product.features,
            productBeingEditedCurrentUrlImagesWithChekedOption: productBeingEditedCurrentUrlImagesWithChekedOption,
            loading: false,              
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
      this.setState( prevState => ({
        ...prevState,
        requestDataSet : {
          ...prevState.requestDataSet,
          [input]: value
        }
      })) 
  };

  senData = () => {     
    const { featuresList, urlImages,requestDataSet, images, selectedImages } = this.state;
    
    let suppliers = this.props.suppliers;
    let supplierName = requestDataSet.supplierName;
    let supplierId = suppliers.find(i => i.name === supplierName)._id
    
    const formData = new FormData();
    let method;
    let url;

    
    if(this.props.editingMode === false){
        Object.keys(requestDataSet).map(  data => formData.append(`${data}`, `${requestDataSet[data]}`));
        formData.append('features', featuresList);
        formData.append('imageUrls', urlImages);
        formData.append('albumId', this.state.albumId);
        formData.append('supplierId', supplierId)
        method = 'POST';
        url = "http://localhost:8000/admin/add-product";
    }

    if(this.props.editingMode === true){

      let productBeingEditedUrlImages = [];

      if(images.length === 0 && selectedImages.length === 0){
        // we don't need need to add neither delete images
        productBeingEditedUrlImages = this.state.productBeingEditedCurrentUrlImages
      } else {
          
          if(images.length !== 0 && selectedImages.length === 0){
            //we need to add new imgUrls but we don't need to delete
            productBeingEditedUrlImages = [...this.state.productBeingEditedCurrentUrlImages, ...this.state.urlImages]
          } 

          if(  images.length === 0 && selectedImages.length !== 0){
            //We need to delete the images but we dont need to add new ones
            productBeingEditedUrlImages = this.state.productBeingEditedCurrentUrlImages.filter( url => !selectedImages.includes(url) )
          }

          if(images.length !== 0 && selectedImages.length !== 0){
            //We need to upload and delete images at the same time
            productBeingEditedUrlImages = [...this.state.productBeingEditedCurrentUrlImages, ...this.state.urlImages].filter( url => !this.state.selectedImages.includes(url) )
          }

      }

        Object.keys(requestDataSet).map(  data => formData.append(`${data}`, `${requestDataSet[data]}`));
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
        this.props.addTotalProducts()
        return resData
      })
      .then( resData => {
        if(this.props.editingMode === true){  
          this.props.toggleEditingMode()     
          this.props.history.push(`/inventory/${this.props.productBeingEditedId}`)
        } else {

          this.props.history.push(`/inventory/${resData.product._id}`)
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

    if(images.length !== 0){
      try {
        const urls = await Promise.all( images.map(image => 
            new Promise((resolve, reject) => {
                const uploadTask = storage.ref(`${albumId}--${image.name}`).put(image);
                uploadTask.on('state_changed', 
                    (snapshot) => {
                        // progress function....
                    },          
                    reject, //REJECTED                
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

    const { initialForm, requestDataSet } = this.state;

    let addProduct;

    if(this.state.loading === true || initialForm === null || requestDataSet === null) {
      addProduct = <Loader />
    } else {
      addProduct = (
        <section className="add-product">
            <form className="add-product__form">

              {this.state.showImage !== true && (
                <div className={`add-product__part add-product__part--details `}>
                {Object.keys(initialForm).map(dataType => (
                  <div className="add-product__part--details__section" key={dataType}>
                    <h3 className="add-product__form__title">{dataType}</h3>
                        {Object.keys(initialForm[dataType]).map(data => {

                          let info = initialForm[dataType][data];
                          return (
                              <Input
                                  className="add-product__input"
                                  label={info.label}
                                  key={info.label}
                                  id={data}
                                  options={info.options}
                                  placeholder={info.placeholder}
                                  control={info.control}
                                  type={info.type}
                                /*  value={ this.props.editingMode === false ? i.value : this.state.newFullForm[i.id]
                                    }*/
                                  value = {requestDataSet[data]}
                                  onChange={this.inputChangeHandler}
                              />
                            )
                        }
                        
                        )}
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
              )}

              {this.state.showImage === true && (
                <div className={`add-product__part add-product__part--image `}>
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
              )}      

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

        setSuppliers: suppliers => dispatch(actions.setSuppliers(suppliers)),

        addTotalProducts: () => dispatch(actions.addTotalProducts())
  }
}
export default connect(mapStateToProps, madDispacthToProps)(AddProduct);


