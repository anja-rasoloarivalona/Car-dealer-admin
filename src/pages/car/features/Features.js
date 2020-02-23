import React from 'react';
import './Features.css';
import IconSvg from '../../../utilities/svg/svg'

const features = props => {
    let product = props.product
    return (
        <div className="features">
            <ul className="features__list">
                {product.features.map(feature => (
                    <li className="features__list__item">
                        <IconSvg icon="arrow-list"/>
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default features;