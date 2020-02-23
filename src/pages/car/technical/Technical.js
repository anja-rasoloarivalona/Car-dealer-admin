import React from 'react';
import './Technical.css';
import IconSvg from '../../../utilities/svg/svg';


const technical = props => {
   let product = props.product;
    return (
        <div className="technical">


            <div className="technical__section">
                <div className="technical__title">
                    <IconSvg icon="engine"/>
                    <div>Engine</div>
                </div>
                <ul className="technical__section__list">
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">Motor size</span>
                        <span className="technical__section__list__item__value">{product.tech.motorSize}</span>
                    </li>
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">Number of cylinders</span>
                        <span className="technical__section__list__item__value">{product.tech.nbCylinders}</span>
                    </li>
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">Fuel</span>
                        <span className="technical__section__list__item__value">{product.general.gazol}</span>
                    </li>
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">Max speed</span>
                        <span className="technical__section__list__item__value">{product.tech.maxSpeed} km/h</span>
                    </li>
                </ul>
            </div>

            {/* <div className="technical__section">
                <div className="technical__title">
                    <IconSvg icon="speedometer"/>
                    <div>Performance</div>
                </div>
                <ul className="technical__section__list">
                    
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">0 à 100 km/h</span>
                        <span className="technical__section__list__item__value">10.6 s</span>
                    </li>
                </ul>
            </div> */}
            <div className="technical__section">
                <div className="technical__title">
                    <IconSvg icon="gear"/>
                    <div>Transmission</div>
                </div>
                <ul className="technical__section__list">
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">Gear box</span>
                        <span className="technical__section__list__item__value">{product.general.transmissionType}</span>
                    </li>
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">Number of gear ratios</span>
                        <span className="technical__section__list__item__value">{product.tech.nbGearRatios}</span>
                    </li>
                </ul>
            </div>
            
            
        </div>
    )
}

export default technical;