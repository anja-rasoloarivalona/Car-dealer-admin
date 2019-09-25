import React from 'react';
import './Technical.css';
import IconSvg from '../../../utilities/svg/svg';


const technical = props => {
    return (
        <div className="technical">


            <div className="technical__section">
                <div className="technical__title">
                    <IconSvg icon="engine"/>
                    <div>Engine</div>
                </div>
                <ul className="technical__section__list">
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">Taille du moteur</span>
                        <span className="technical__section__list__item__value">{props.motorSize}</span>
                    </li>
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">Nombre de cylindres</span>
                        <span className="technical__section__list__item__value">{props.nbCylinders}</span>
                    </li>
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">Carburant</span>
                        <span className="technical__section__list__item__value">{props.gazol}</span>
                    </li>
                </ul>
            </div>

            <div className="technical__section">
                <div className="technical__title">
                    <IconSvg icon="speedometer"/>
                    <div>Performance</div>
                </div>
                <ul className="technical__section__list">
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">Vitesse max</span>
                        <span className="technical__section__list__item__value">{props.maxSpeed} km/h</span>
                    </li>
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">0 à 100 km/h</span>
                        <span className="technical__section__list__item__value">10.6 s</span>
                    </li>
                </ul>
            </div>
            <div className="technical__section">
                <div className="technical__title">
                    <IconSvg icon="gear"/>
                    <div>Transmission</div>
                </div>
                <ul className="technical__section__list">
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">Type</span>
                        <span className="technical__section__list__item__value">{props.transmissionType}</span>
                    </li>
                    <li className="technical__section__list__item">
                        <span className="technical__section__list__item__detail">Nombre de rapports</span>
                        <span className="technical__section__list__item__value">{props.nbGearRatios}</span>
                    </li>
                </ul>
            </div>
            
            
        </div>
    )
}

export default technical;