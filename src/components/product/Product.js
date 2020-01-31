import React from 'react';
import './Product.css';
import IconSvg from '../../utilities/svg/svg';

const product = props => {
    return (
        <article className="product" >
            {props.children}
            <div className="product__imgContainer" onClick={props.goToProd}>
                <div className="product__imgContainer__hoverLayer"></div>
                <img src={props.mainImg} alt="main img" className="product__img"/>
                    <IconSvg icon="search"/>
            </div>
            
            
            <div className="product__details">
                <div className="product__details__model">
                   {/*<span>{props.brand} {props.model}</span>*/} 
                   <span>{props.title}</span>
                    <span>{props.year}</span>
                </div>
                <div className="product__details__price">
                    {props.price.toLocaleString()} MRU
                </div>           
            </div>

            <ul className="product__specList">
                <li className="product__specList__item">
                    <span>{props.nbKilometers}</span>
                    <IconSvg icon="road"/>
                </li>
                <li className="product__specList__item">
                    <span>{props.gazol}</span>
                    <IconSvg icon="gas-station"/>
                </li>
                <li className="product__specList__item">
                    <span>{props.transmissionType}</span>
                    <IconSvg icon="gear"/>
                </li>
            </ul>
        </article>
    )
}

export default product;