import React from 'react';
import './Overview.css';
import IconSvg from '../../../utilities/svg/svg';

const overview = props => {
    let product = props.product
    return (
        <div className="overview">
            <section className="overview__section">
                <div className="overview__title">
                    <IconSvg icon="file"/>
                    <div>General</div>
                </div>
                <ul className="overview__list">
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Brand</div>
                    <div className="overview__list__item__value">{product.general.brand}</div>
                </li>
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Model</div>
                    <div className="overview__list__item__value">{product.general.model}</div>
                </li>
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Body Type</div>
                    <div className="overview__list__item__value">{product.general.bodyType}</div>
                </li>
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Year</div>
                    <div className="overview__list__item__value">{product.general.year}</div>
                </li>
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Kilometer</div>
                    <div className="overview__list__item__value">{product.general.nbKilometers.toLocaleString()} km</div>
                </li>
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Year of release</div>
                    <div className="overview__list__item__value">{product.general.yearOfRelease}</div>
                </li>
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Serial number</div>
                    <div className="overview__list__item__value">{product.general.serialNumber}</div>
                </li>
               
            </ul>
            </section>
            <section className="overview__section">
                <div className="overview__title">
                    <IconSvg icon="design"/>
                    <div>Design</div>
                </div>
                <ul className="overview__list">
                    <li className="overview__list__item">
                        <div className="overview__list__item__key">Interior color</div>
                        <div className="overview__list__item__value">{product.design.intColor}</div>
                    </li>
                    <li className="overview__list__item">
                        <div className="overview__list__item__key">Exterior color</div>
                        <div className="overview__list__item__value">{product.design.extColor}</div>
                    </li>                            
            </ul>
            </section>
        </div>
    )
}

export default overview;
