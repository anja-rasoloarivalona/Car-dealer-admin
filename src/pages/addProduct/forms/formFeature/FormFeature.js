import React from 'react';
import './FormFeature.css';
import Input from '../../../../components/formInput/FormInput';
import Button from '../../../../components/button/Button';

const formFeature = props => {

    let featuresList = props.featuresList;
    return (
        <div className="formFeature">

            <div className="formFeature__add">
                <Input className="add-product__input"
                    id="options"
                    placeholder="ajouter options"
                    control="input"
                    value={props.value}
                    onChange={props.addFeatureChangeHandler}
                />
                <Button onClick={props.addFeature}
                        color="secondary"
                 >
                    Add
                </Button>
            </div>

            <ul className="formFeature__list">
                {
                    featuresList.map(i => (
                        <li className="formFeature__list__item" 
                            key={i}
                            onClick={() => props.deleteFeature(i)}>
                            {i}
                        </li>
                    ))
                }
            </ul>  

        </div>
    )
}

export default formFeature
