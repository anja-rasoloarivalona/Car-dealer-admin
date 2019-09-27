import React from 'react';
import './FilePicker.css';
import { FilePond, registerPlugin } from "react-filepond";
import * as FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond/dist/filepond.min.css";

import Button from '../../../../components/button/Button';
import IconSvg from '../../../../utilities/svg/svg';

registerPlugin(FilePondPluginImagePreview);



const filePicker = props => {

    let productBeingEditedCurrentImages = props.productBeingEditedCurrentImages;
    let selectedImages = props.selectedImages;
    let cancelDeleteImagesAlowed = props.cancelDeleteImagesAlowed
   

    let filePond;

    if(props.editingMode === true){

        filePond = (
            <div>
                <h3 className="file-picker__title">New images</h3>
                <FilePond className="add-product__filepond"
                          allowMultiple={true}
                          onupdatefiles={props.filesHandler}                 
                />
            </div>
        )    
    } else {
        filePond = (
        <FilePond className="add-product__filepond"
                    allowMultiple={true}
                    onupdatefiles={props.filesHandler}/>
        )
    }

    return (

        <div className="file-picker">

            { props.editingMode === true && (
                    <div className="file-picker__currentImages">
                        <h3 className="file-picker__title">Current images</h3>
                        <ul className="file-picker__currentImages__list">
                            {
                                productBeingEditedCurrentImages.map( i => (


                                    <div className="file-picker__currentImages__list__item"
                                        onClick={() => props.selectDeleteHandler(i.url)}>
                                        {
                                            i.checked === true ? <IconSvg icon="checked"/> : null
                                        }         
                                        <img src={i.url} alt="current images" className="file-picker__currentImages__list__item__img" key={i.url}/>
                                    </div>

                                   
                                ))
                            }
                        </ul>
                        <div className="file-picker__currentImages__controller">

                            {
                                selectedImages.length !== 0 && (
                                    <Button onClick={props.onDeleteCurrentImages}>
                                         Delete
                                    </Button>
                                )
                            }

                            {
                                cancelDeleteImagesAlowed === true && (
                                    <Button onClick={props.onCancelDeleteCurrentImages}>
                                        Cancel
                                    </Button>
                                )
                            }
                           
                        </div>
                        
                    </div>
                )
            }

            {filePond}
             
        </div>
    )
}

export default filePicker
