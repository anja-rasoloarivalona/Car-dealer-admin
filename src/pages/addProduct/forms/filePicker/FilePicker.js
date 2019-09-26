import React from 'react';
import './FilePicker.css';
import { FilePond, registerPlugin } from "react-filepond";
import * as FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond/dist/filepond.min.css";
registerPlugin(FilePondPluginImagePreview);



const filePicker = props => {

    let productBeingEditedCurrentImages = props.productBeingEditedCurrentImages;

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
                    <div>
                        <h3 className="file-picker__title">Current images</h3>
                        <ul className="file-picker__currentImages__list">
                            {
                                productBeingEditedCurrentImages.map( i => (
                                    <img src={i} alt="current images" className="file-picker__currentImages__list__item" key={i}/>
                                ))
                            }
                        </ul>
                    </div>
                )
            }

            {filePond}
             
        </div>
    )
}

export default filePicker
