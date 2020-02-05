import React, { Component } from "react";
import "./Inventory.css";
import Product from "../../components/product/Product";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Loader from "../../components/loader/Loader";
import queryString from 'querystring';
import Paginator from '../../components/paginator/Paginator';
import InputRange from "react-input-range";
import 'react-input-range/lib/css/index.css';




class Inventory extends Component {

  state = {
    products: null,
    loading: true,
    displayMode: 'grid',
    query: {
      page: 1,
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
    },
    displayedSelector : null
  }

  componentDidMount(){
    
    if(this.props.savedProductsQueries === true){
      this.fetchProductsHandler(this.props.productsQueries)
    } else {

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
      this.props.setCurrentPage(parseInt(parsedQueryDataSet.page)) 
    }
    this.fetchProductsHandler(query)
    }
  }

  resetHandler = () => {
    
    let query = this.state.query;
    let resetQuery = {
      page: 1,
      sortBy: 'prix_croissant',
      supplierId: null,
      supplierName: 'all',
      brand: 'all',
      model: 'all',
      price: {
        scope: {
          min: query.price.scope.min,
          max: query.price.scope.max
        },
        value: {
          min: query.price.scope.min,
          max: query.price.scope.max
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

    this.fetchProductsHandler(resetQuery)

  }

  componentWillMount(){
    document.addEventListener('mousedown', this.handleClick, false)
  }

  componentWillUnmount(){
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  handleClick = e => {         
    if(this.sortBySelectorOuter && this.sortBySelectorOuter.contains(e.target)){
        return
    }
    if(this.brandSelectorOuter && this.brandSelectorOuter.contains(e.target)){
      return
    }
    if(this.supplierSelectorOuter && this.supplierSelectorOuter.contains(e.target)){
      return
    }
    if(this.modelSelectorOuter && this.modelSelectorOuter.contains(e.target)){
      return
    }
    this.handleClickOutside()
  }

  handleClickOutside = () => {
    this.setState({ displayedSelector: null })
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
        priceMin: value.min,
        priceMax: value.max
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
        const {products, totalProducts} = resData
        this.props.setTotalProducts(totalProducts)
        this.props.setProducts(products);
        this.props.setProductsQueries(query);
        this.props.setSavedProductsQueriesToTrue();

        this.setState({ query: query, products: products, loading: false});
        this.props.history.push({ 
              search: `sortBy=${query.sortBy}&supplier=${query.supplierName}&brand=${query.brand}&model=${query.model}&minPrice=${query.price.value.min}&maxPrice=${query.price.value.max}&minYear=${query.year.value.min}&maxYear=${query.year.value.max}&page=${query.page}`
        })   
      })
      .catch(err => {
        console.log(err);
      });
  }

  toggleSelectorHandler = selector => {
    if(this.state.displayedSelector === null || selector !== this.state.displayedSelector){
      this.setState({ displayedSelector: selector})
    } else {
      this.setState({ displayedSelector: null})
    }   
  }

  paginationHandler = direction => {


    let query = this.state.query
    
    if(direction === 'next'){
        query = {
          ...query,
          page: this.props.currentPage + 1
        }
        this.props.setCurrentPage(this.props.currentPage + 1)
    }

    if(direction === 'previous'){
      query = {
        ...query,
        page: this.props.currentPage - 1
      }
      this.props.setCurrentPage(this.props.currentPage - 1)
    }

    if(direction !== 'previous' && direction !== 'next'){
      query = {
        ...query,
        page: direction
      }
      this.props.setCurrentPage(direction)
    }

    this.fetchProductsHandler(query)
  }


  render() {

    const { query, loading, products, displayMode, displayedSelector } = this.state;
    const suppliers = this.props.suppliers;
    const brandsAndModels = this.props.brandsAndModels;
    let productsList = <Loader />

    
    if(!loading){
      productsList = (
        <Paginator 
            onRequestPreviousPage={this.paginationHandler.bind(this, 'previous')}
            onRequestNextPage={this.paginationHandler.bind(this, 'next')}
            lastPage={Math.ceil(this.props.totalProducts / this.props.itemsPerPage)}
            currentPage={this.props.currentPage}
            onRequestPageNumber={this.paginationHandler}>
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
                        title={product.general.title}
                        brand={product.general.brand}
                        model={product.general.model}
                        year={product.general.year}
                        price={product.general.price}
                        nbKilometers={product.general.nbKilometers}
                        gazol={product.general.gazol}
                        transmissionType={product.general.transmissionType}
                        goToProd={() => {
                          this.props.setProductRequestedId(product._id);
                          this.props.history.push(`/inventory/${product._id}`);
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
        </Paginator>
      )
    }

    return (
      <div className="inventory">

              <div className="inventory__controller">

                <div className="inventory__controller__container">


                    <div className="inventory__controller__section"
                         ref={outer => this.sortBySelectorOuter = outer}
                         onClick={() => this.toggleSelectorHandler('sortBy')}>
                      <div className="inventory__controller__section__key">Trier par</div>
                      <div className="inventory__controller__section__value">
                          <span>{query.sortBy.split('_').length > 1 ? `${query.sortBy.split('_')[0]} ${query.sortBy.split('_')[1]}` : query.sortBy}</span>
                          <ul className={`inventory__controller__section__list
                                        ${displayedSelector === 'sortBy' ? 'active':''}`}>
                            <li className="inventory__controller__section__list__item" onClick={() => this.sortByHandler('prix_croissant')}>prix croissant</li>
                            <li className="inventory__controller__section__list__item" onClick={() => this.sortByHandler('prix_décroissant')}>prix décroissant</li>
                            <li className="inventory__controller__section__list__item" onClick={() => this.sortByHandler('popularité')}>popularité</li>
                            <li className="inventory__controller__section__list__item" onClick={() => this.sortByHandler('date')}>date</li>
                        </ul>
                      </div>

                      

                    </div>


                    <div className="inventory__controller__section"
                          ref={outer => this.brandSelectorOuter = outer}
                          onClick={() => this.toggleSelectorHandler('brand')}>
                      <div className="inventory__controller__section__key">Marque</div>
                      <div className="inventory__controller__section__value">
                          <span>{query.brand === 'all' ? 'Toutes' : query.brand}</span>
                          <ul className={`inventory__controller__section__list
                                        ${displayedSelector === 'brand' ? 'active':''}`}>
                              <li className="inventory__controller__section__list__item" onClick={() => this.selectBrandHandler('all')}>Toutes</li>
                               {Object.keys(brandsAndModels).map(brand => (
                              <li key={brand} className="inventory__controller__section__list__item" onClick={() => this.selectBrandHandler(brand)}>{brand}</li>
                              ))}
                          </ul>
                      </div>
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

                    <div className="inventory__controller__section"
                         ref={outer => this.supplierSelectorOuter = outer}
                         onClick={() => this.toggleSelectorHandler('supplier')}>
                        <div className="inventory__controller__section__key">Fournisseur</div>
                        <div className="inventory__controller__section__value">
                              <span>{query.supplierName === 'all' ? 'Tous' : query.supplierName}</span>
                               <ul className={`inventory__controller__section__list
                                    ${displayedSelector === 'supplier' ? 'active':''}`}>
                                    <li className="inventory__controller__section__list__item" onClick={() => this.selectSupplierHandler('all')}>Tous</li>
                                    {suppliers && suppliers.map(supplier => (
                                    <li key={supplier._id} className="inventory__controller__section__list__item" onClick={() => this.selectSupplierHandler(supplier.name)}>{supplier.name}</li>
                                    ))}
                               </ul>
                        </div>
                    </div>
                   
                    <div className="inventory__controller__section"
                         ref={outer => this.modelSelectorOuter = outer}
                         onClick={() => this.toggleSelectorHandler('model')}>
                      <div className="inventory__controller__section__key">Modèle</div>
                      <div className="inventory__controller__section__value">
                            <span>{query.model === 'all' ? 'Tous' : query.model}</span>
                            <ul className={`inventory__controller__section__list
                                ${displayedSelector === 'model' ? 'active':''}`}>
                                <li className="inventory__controller__section__list__item" onClick={() => this.selectModelHandler('all')}>
                                  Tous
                                </li>
                                {query.brand !== 'all' && query.brand !==  undefined && Object.keys(brandsAndModels[query.brand].datas).map(model => (
                                <li key={model} className="inventory__controller__section__list__item" onClick={() => this.selectModelHandler(model)}>{model}</li>
                                ))}
                            </ul>           
                      </div>
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

                <div className="inventory__controller__shortcut">
                  <div className={`inventory__controller__shortcut__button inventory__controller__shortcut__button--displayMode
                                  ${displayMode === 'list' ? 'active': ''}`}
                      onClick={this.toggleDisplayMode}>
                        Afficher données
                  </div> 
                  <div className="inventory__controller__shortcut__button inventory__controller__shortcut__button--reset"
                      onClick={this.resetHandler}>
                        Reset
                  </div>              
                </div>
              </div>
              <div className="inventory__counter">
                  Search results : {this.props.totalProducts}
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
    brandsAndModels: state.products.brandsAndModels,
    totalProducts : state.products.totalProducts,
    itemsPerPage: state.paginator.itemsPerPage,
    currentPage: state.paginator.currentPage,
    productsQueries: state.products.productsQueries,
    savedProductsQueries: state.products.savedProductsQueries
    
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProductRequestedId: (prodId) =>dispatch(actions.setRequestedProductId(prodId)),
    setProducts: (products) => dispatch(actions.setProducts(products)),
    setCurrentPage: currentPage => dispatch(actions.setCurrentPage(currentPage)),
    setTotalProducts: (totalProducts) => dispatch(actions.setTotalProducts(totalProducts)),
    setProductsQueries: (data) => dispatch(actions.setProductsQueries(data)),
    setSavedProductsQueriesToTrue: () => dispatch(actions.setSavedProductsQueriesToTrue())
    };

};



export default connect(mapStateToProps,mapDispatchToProps)(Inventory);
