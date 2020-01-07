import React from 'react';
import './Overview.css';
import IconSvg from '../../../utilities/svg/svg';

const overview = () => {
    return (
        <div className="overview">

       

            <section className="overview__section">
                <div className="overview__title">
                    <IconSvg icon="file"/>
                    <div>General</div>
                </div>
                <ul className="overview__list">
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Marque</div>
                    <div className="overview__list__item__value">Toyota</div>
                </li>
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Modèle</div>
                    <div className="overview__list__item__value">Celica</div>
                </li>
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Année</div>
                    <div className="overview__list__item__value">2018</div>
                </li>
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Kilométrage</div>
                    <div className="overview__list__item__value">46 000 km</div>
                </li>
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Mise en circulation</div>
                    <div className="overview__list__item__value">2019</div>
                </li>
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Nombre de propriétaires</div>
                    <div className="overview__list__item__value">1</div>
                </li>
                <li className="overview__list__item">
                    <div className="overview__list__item__key">Nombre de places</div>
                    <div className="overview__list__item__value">5</div>
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
                        <div className="overview__list__item__key">Couleur extérieur</div>
                        <div className="overview__list__item__value">gris</div>
                    </li>
                    <li className="overview__list__item">
                        <div className="overview__list__item__key">Couleur intérieur</div>
                        <div className="overview__list__item__value">gris</div>
                    </li>                            
            </ul>
            </section>

            
           
        </div>
    )
}

export default overview;
