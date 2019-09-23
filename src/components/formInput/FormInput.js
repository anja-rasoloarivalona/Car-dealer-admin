import React from 'react';
import './FormInput.css';

const formInput = props => {
    return (
        <div className={`input ${props.className}`}>

            {/*--------INPUT LABEL-----------*/}
            {
                props.label && (
                    <label htmlFor={props.id}>{props.label}</label>
                )
            }

            {/*-------INPUT VARIATION--------*/}


                {/*-----BASIC INPUT--------*/}
                {
                    props.control === 'input' && (
                        <input className="input__field" 
                               type={props.type} //text, email, password...
                               id={props.id}
                               required={props.required}
                               value={props.value}
                               placeholder={props.placeholder}
                               onChange={e => props.onChange(props.id, e.target.value, props.formType)}
                               />
                    )
                }



                {/*----TEXTAREA INPUT--------*/}
                {
                    props.control === 'textarea' && (
                        <textarea className="textarea"
                            id={props.id}
                            required={props.required}
                            value={props.value}
                            onChange={e => props.onChange(props.id, e.target.value)}
                            />
                    )
                }

                {
                    props.control === 'select' && (
                        <select id={props.id}
                                required={props.required}
                                value={props.value}
                                onChange={e => props.onChange(props.id, e.target.value)}>
                                
                                <option value="option1">Option1</option>
                                <option value="option2">Option2</option>
                                <option value="option3">Option3</option>
                        </select>
                    )
                }
        </div>
    )
}

export default formInput;
