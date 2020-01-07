import React, { Component } from 'react'
import './Car.css';
import { Gallery, GalleryImage } from "react-gesture-gallery";

import Button from '../../components/button/Button';

import Overview from './overview/Overview';
import Technical from './technical/Technical';
import Features from './features/Features';

import { connect } from 'react-redux';
import * as actions from '../../store/actions';


class Car extends Component {

    state = {
        index: 0,
        initiatlIndex: 0,
        requestedSection: 'overview',

        product: {},
        loading: true
    }

   /* componentDidMount(){
        //console.log('did mount', this.props)
    }*/

    imageSlideHandler = () => {
    let {index, images, initiatlIndex} =  this.state;
    this.inter = setInterval(() => {
                if(index === images.length){
                    this.setState({index: initiatlIndex}, () => {
                        clearInterval(this.inter);
                        this.imageSlideHandler();
                    })
                } else {
                    this.setState({index: index++ })
                }
            }, 2500)
    }

    componentDidMount(){

        let prodId;

        if(this.props.prodId === ''){
            prodId = this.props.match.params.prodId
        } else {
            prodId = this.props.prodId
        }    

        let url = "http://localhost:8000/admin/" + prodId;
        let method = 'GET';
        
        fetch(url, {
            headers: {
                "Content-type": "application/json"
            },
            method: method
        })
        .then( res => {
            if(res.status !== 200){
                throw new Error('Failed to fetch that product')
            }
            return res.json();
        })
        .then( resData => {
            this.setState({
                product: resData.product,
                loading: false
            }, () => this.props.setProductRequested(resData.product))
        })
        .catch( err => {
            console.log(err)
        })
        
    }

    componentWillUnmount(){
        clearInterval(this.inter)
    }
    

    changeGalleryImgIndex = url => {
        const { product } = this.state;
        let index = product.imageUrls.indexOf(`${url}`);
        this.setState({ index: index})
    }

    detailRequestHandler = detail => {
        this.setState({ requestedSection: detail})
    }

    render() {

        let {requestedSection, product, loading } = this.state;

        let productRequested; 

        let detail;

        if(requestedSection === 'overview'){
            detail = <Overview />
        }

        if(requestedSection === 'technical'){
            detail = <Technical 
                        nbCylinders = {product.tech.nbCylinders}
                        motorSize={product.tech.motorSize}
                        gazol={product.general.gazol}
                        maxSpeed={product.tech.maxSpeed}
                        transmissionType={product.general.transmissionType}
                        nbGearRatios={product.tech.nbGearRatios}/>
        }

        if(requestedSection === 'features'){
            detail = <Features />
        }


        if(loading ===  true){
            productRequested = <div>loading</div>
        } else {
            productRequested = (
                <div className="car">

                        <div className="car__backBtn"
                              onClick={() => this.props.history.goBack()}>
                            Back
                        </div>

                        <div className="car__controller">
                            <Button link= {{pathname: '/ajouter'}} color="primary"
                                    onClick={this.props.toggleEditingMode}>
                                Edit
                            </Button>
                            <Button link='/' color="primary">
                                Delete
                            </Button>
                        </div>
                        

                        <h1 className="car__presentation__title">{product.general.title}</h1>
                        <div className="car__presentation__gallery">
                            <Gallery
                                index={this.state.index}
                                onRequestChange={i => this.setState({index: i})}>

                                {product.imageUrls.map(img => (
                                <GalleryImage objectFit="cover" key={img} src={img} />
                                ))}

                            </Gallery>
                        </div>
                        <div className="car__presentation__gallery__controller">
                            {
                                product.imageUrls.map(i => (
                                    <img src={i} alt="car" className="car__presentation__gallery__controller__img" key={Math.random().toString()}
                                        onClick={ () => this.changeGalleryImgIndex(i)}/>
                                ))
                            }

                        </div>
                        
                        <ul className="car__presentation__nav">

                            <li className={`car__presentation__nav__item
                                            ${requestedSection === 'overview' ? 'active': ''}`}
                                onClick={() => this.detailRequestHandler('overview')}>
                                Overview
                            </li>
                            <li  className={`car__presentation__nav__item
                                            ${requestedSection === 'technical' ? 'active': ''}`}
                                onClick={() => this.detailRequestHandler('technical')}>
                                Technical
                            </li>
                            <li  className={`car__presentation__nav__item
                                            ${requestedSection === 'features' ? 'active': ''}`}
                                onClick={() => this.detailRequestHandler('features')}>
                                Features
                            </li>
                        </ul>

                        {detail}

                        <div className="space">

                        </div>
            </div>
            )
        }

        
        
        return productRequested
    }
}


const mapStateToProps = state => {
    return {
        prodId: state.products.productRequestedId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setProductRequested: (prod) => dispatch(actions.setRequestedProduct(prod)),
        toggleEditingMode: () => dispatch(actions.toggleEditingMode())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Car);
