import React, { Component } from "react";
import "./Inventory.css";
import Product from "../../components/product/Product";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Loader from "../../components/loader/Loader";
import queryString from 'querystring';

import InputRange from "react-input-range";
import 'react-input-range/lib/css/index.css';




class Inventory extends Component {

  state = {
    products: null,
    loading: true,
    displayMode: 'grid',
    query: {
      sortBy: 'prix_croissant',
      supplierId: null,
      supplierName: 'all',
      brand: 'all',
      model: 'all',
      price: {
        scope: {
          min: 0,
          max: 100
        },
        value: {
          min: 1,
          max: 99
        }
      },
      year: {
        scope: {
          min: 2008,
          max: 2020
        },
        value: {
          min: 2008,
          max: 2020
        }
      }
    }
  }

  componentDidMount(){    
    let query = this.state.query;

    let queryMinPrice = 0
    let queryMaxPrice = 0

    let data = this.props.brandsAndModels;
    Object.keys(data).forEach(brand => {
      if(data[brand].price.min < queryMinPrice){
        queryMinPrice = data[brand].price.min
      }
      if(data[brand].price.max > queryMaxPrice){
        queryMaxPrice = data[brand].price.max
      }
    })

    query = {
      ...query,
      price : {
        ...query.price,
        value : {
          min: queryMinPrice,
          max: queryMaxPrice
        },
        scope: {
          min: queryMinPrice,
          max: queryMaxPrice
        }
      }
    }


    let parsedQueryDataSet = queryString.parse(this.props.location.search);
    parsedQueryDataSet = {
      ...parsedQueryDataSet,
      sortBy: parsedQueryDataSet['?sortBy'] !== 'undefined' ? parsedQueryDataSet['?sortBy'] : 'prix_croissant'
    }

    if(Object.keys(parsedQueryDataSet).length > 1){

      console.log('did mount and parsed');

      Object.keys(parsedQueryDataSet).forEach(parsedQuery => {
        Object.keys(query).forEach(stateQuery => {
            if(parsedQuery === stateQuery){
                query = {
                  ...query,
                  [stateQuery]: parsedQueryDataSet[stateQuery]
                }
            }
        })
      })
  
      if(parsedQueryDataSet.supplier !== 'all'){
          query = {
            ...query,
            supplierName: parsedQueryDataSet.supplier,
            supplierId: this.props.suppliers.find(supplier => supplier.name === parsedQueryDataSet.supplier)._id
          }
      } else {
          query = {
            ...query,
            supplierName: 'all'
          }
      }

      query = {
        ...query,
        priceMin: parsedQueryDataSet.minPrice,
        priceMax: parsedQueryDataSet.maxPrice,
        price : {
          ...query.price,
          value : {
            min: parsedQueryDataSet.minPrice,
            max: parsedQueryDataSet.maxPrice
          }
        },

        minYear: parsedQueryDataSet.minYear,
        maxYear: parsedQueryDataSet.maxYear,
        year : {
          ...query.year,
          value : {
            min: parsedQueryDataSet.minYear,
            max: parsedQueryDataSet.maxYear
          }
        }
      }

    }
    this.fetchProductsHandler(query)
  }

  changeInputHandler = (input, value) => {
    this.setState( prevState => ({
      ...prevState,
      query : {
        ...prevState.query,
        [input] : {
          ...prevState.query[input],
          value : value
        }
      }
    }))
  }

  changeInputCompleteHandler = (input, value) => {
    let query;
    if(input === 'price'){
      query = {
        ...this.state.query,
        minPrice: value.min,
        maxPrice: value.max
      }
    }
    if(input === 'year') {
      query = {
        ...this.state.query,
        minYear : value.min,
        maxYear : value.max
      }
    }
    this.fetchProductsHandler(query)
  }

  sortByHandler = sortBy => {    
    let query = {
      ...this.state.query,
      sortBy: sortBy
    };
    this.fetchProductsHandler(query);
  }

  selectSupplierHandler = supplierName => {

    let suppliers = this.props.suppliers;
    let supplierId;
    let query;

    if(supplierName !== 'all'){
      supplierId = suppliers.find(supplier => supplier.name === supplierName)._id
      query = {
        ...this.state.query,
        supplierId: supplierId,
        supplierName: supplierName,
      }
      this.fetchProductsHandler(query);

    } else {
      query = {
        ...this.state.query,
        supplierId: null,
        supplierName: 'all',
      }
      this.fetchProductsHandler(query)
    }
    
  }

  selectBrandHandler = brand => {

    let query;

    if(brand !== 'all'){
      query = {
        ...this.state.query,
        brand: brand
      }
    } else {
      query = {
        ...this.state.query,
        brand: brand,
        model: 'all'
      }
    }
     
    this.fetchProductsHandler(query)
  }

  selectModelHandler = model => {
    let query = {
      ...this.state.query,
      model: model
    } 
    this.fetchProductsHandler(query)
  }

  toggleDisplayMode = () => {
    let displayMode;

    if(this.state.displayMode === 'list'){
      displayMode = 'grid'
    } else {
      displayMode = 'list'
    }

    this.setState({ displayMode})
  }

  fetchProductsHandler = (query) => {

    this.setState({ loading: true });

    let url =  new URL('http://localhost:8000/product/admin');
    url.search = new URLSearchParams(query).toString();

    fetch(url, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch products");
        }
        return res.json(); 
    })
    .then(resData => {
        let products = resData.products;
        this.props.setProducts(products);

        let queryKeys = Object.keys(query);
        let keysToBeDeleted = ['minPrice', 'maxPrice', 'minYear', 'maxYear'];

        keysToBeDeleted.forEach(key => {
          if(queryKeys.includes(key)){
            delete query[key]
          }
        })
       
        this.setState({ query: query, products: products, loading: false});
        this.props.history.push({ 
              search: `sortBy=${query.sortBy}&supplier=${query.supplierName}&brand=${query.brand}&model=${query.model}&minPrice=${query.price.value.min}&maxPrice=${query.price.value.max}&minYear=${query.year.value.min}&maxYear=${query.year.value.max}`
        })   
      })
      .catch(err => {
        console.log(err);
      });
  }


  render() {

    const { query, loading, products, displayMode } = this.state;
    const suppliers = this.props.suppliers;
    const brandsAndModels = this.props.brandsAndModels;
    let productsList = <Loader />

    
    if(!loading){
      productsList = (
            <ul className={`inventory__list 
                ${displayMode === 'grid' ? '': 'list'}`}>
                {products.map(product => {

                  let date = new Date(product.createdAt).toLocaleString('fr-FR');
                  let view = product.general.viewCounter;
                  if(view === undefined){
                      view = 0
                  }

                  return (
                  
                    <li className="inventory__list__item"
                        key={product._id}>
  
                      <Product
                        id={product._id}
                        mainImg={product.general.mainImgUrl}
                        made={product.general.made}
                        model={product.general.model}
                        year={product.general.year}
                        price={product.general.price}
                        nbKilometers={product.general.nbKilometers}
                        gazol={product.general.gazol}
                        transmissionType={product.general.transmissionType}
                        goToProd={() => {
                          this.props.setProductRequestedId(product._id);
                          this.props.history.push(`/car/${product._id}`);
                        }}
                      />
  
                        {
                          displayMode === 'list' && (
                            <div className="inventory__list__item__info">
                              
                              <ul className="inventory__list__item__info__list">
                                  <li className="inventory__list__item__info__list__item">
                                      <div>Date de publication</div>
                                      <div>{date}</div>
                                  </li>
                                  <li className="inventory__list__item__info__list__item">
                                      <div>Fournisseur</div>
                                      <div>{product.supplier ? product.supplier.info.name : ''}</div>
                                  </li>
                                  <li className="inventory__list__item__info__list__item">
                                      <div>Prix concessionnaire</div>
                                      <div>{product.supplier ? product.supplier.price : ''}</div>
                                  </li>
                                  <li className="inventory__list__item__info__list__item">
                                      <div>Nombre de vues</div>
                                      <div>{view}</div>
                                  </li>
                                  <li className="inventory__list__item__info__list__item">
                                      <div>Suivis par</div>
                                      <div>{product.followers.length}</div>
                                  </li>
                                  <li className="inventory__list__item__info__list__item">
                                      <div>Numéro de référence</div>
                                      <div>{product.supplier.reference}</div>
                                  </li>
                              </ul>
                            </div>
                          ) 
                        }
                    </li>                
                  )
                }
                )}
              </ul>
      )
    }

    return (
      <div className="inventory">

              <div className="inventory__controller">

                <div className="inventory__controller__container">
                    <div className="inventory__controller__section">
                      <div className="inventory__controller__section__key">Trier par</div>
                      <select value={query.sortBy}
                              onChange={e => this.sortByHandler(e.target.value)}>
                        <option value="prix_croissant">Prix croissant</option>
                        <option value="prix_décroissant">Prix décroissant</option>
                        <option value="popularité">Popularité</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                    <div className="inventory__controller__section">
                      <div className="inventory__controller__section__key">Marque</div>
                      <select value={query.brand}
                              onChange={e => this.selectBrandHandler(e.target.value)}>
                          <option value="all">Toutes</option>
                          {
                            Object.keys(brandsAndModels).map(brand => (
                              <option key={brand} value={brand}>{brand}</option>
                            ))
                          }
                      </select>
                    </div>
                   
                  <div className="inventory__controller__section inventory__controller__section--input-range">
                        <div className="inventory__controller__section__keyContainer">
                            <div className="inventory__controller__section__key">Année :</div>
                            <div className="inventory__controller__section__value">
                              <span>{query.year.value.min}</span> - <span>{query.year.value.max}</span>
                            </div>
                        </div>
                        
                        <InputRange 
                            maxValue={query.year.scope.max}
                            minValue={query.year.scope.min}
                            value={query.year.value}
                            onChange={value => this.changeInputHandler('year', value)}
                            onChangeComplete={value => this.changeInputCompleteHandler('year', value)}
                        />
                    </div>
                </div>

                <div className="inventory__controller__container">
                    <div className="inventory__controller__section">
                        <div className="inventory__controller__section__key">Fournisseur</div>
                        <select value={query.supplierName}
                            onChange={e => this.selectSupplierHandler(e.target.value)}>
                              <option value='all'>Tous</option>
                            {suppliers && suppliers.map(supplier => (
                              <option key={supplier._id} value={supplier.name}>{supplier.name}</option>
                            ))}
                        </select>
                    </div>
                   
                    <div className="inventory__controller__section">
                      <div className="inventory__controller__section__key">Modèle</div>
                      <select value={query.model}
                              onChange={e => this.selectModelHandler(e.target.value)}>
                          <option value="all">Tous</option>


                          {query.brand !== 'all' && query.brand !==  undefined &&
                            Object.keys(brandsAndModels[query.brand].datas).map(model => (
                              <option key={model} value={model}>{model}</option>
                            ))
                          }
                      </select>
                    </div>

                    <div className="inventory__controller__section inventory__controller__section--input-range">
                        <div className="inventory__controller__section__keyContainer">
                            <div className="inventory__controller__section__key">Prix :</div>
                            <div className="inventory__controller__section__value">
                              <span>{query.price.value.min}</span> - <span>{query.price.value.max}</span> MRU
                            </div>
                        </div>
                        
                        <InputRange 
                            maxValue={query.price.scope.max}
                            minValue={query.price.scope.min}
                            value={query.price.value}
                            onChange={value => this.changeInputHandler('price', value)}
                            onChangeComplete={value => this.changeInputCompleteHandler('price',value)}
                        />
                    </div>
                </div>

                  <div className={`inventory__controller__displayMode 
                                  ${displayMode === 'list' ? 'active': ''}`}
                      onClick={this.toggleDisplayMode}>
                        Afficher données
                  </div>
              </div>

              {productsList}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    products: state.products.products,
    suppliers: state.suppliers.suppliers,
    brandsAndModels: state.products.brandsAndModels
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProductRequestedId: (prodId) =>dispatch(actions.setRequestedProductId(prodId)),
    setProducts: (products) => dispatch(actions.setProducts(products))
    };

};



export default connect(mapStateToProps,mapDispatchToProps)(Inventory);
