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
import DropDownList from '../../components/dropDownList/DropDownList';
import Title from '../../components/title/Title';
import IconSvg from '../../utilities/svg/svg';

class Inventory extends Component {

  state = {
    products: null,
    loading: true,
    displayMode: 'grid',
    query: {
      page: 1,
      sortBy: 'increasing_price',
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
    INIT_priceMin: null,
    INIT_priceMax: null,
    INIT_yearMin: 2008,
    INIT_yearMax: 2020
  }

  componentDidMount(){
    /// Check if we already have some queries in redux for fetching products - example : Returning to the inventory after viewing the article
    if(this.props.savedProductsQueries === true){
      this.fetchProductsHandler(this.props.productsQueries)
    } else {
    /// No queries saved, START INIT QUERY
    let query = this.state.query;
    let queryMinPrice = 20000000
    let queryMaxPrice = 0
    let data = this.props.brandsAndModels;
        /* START INIT QUERY --- PRICE DATA */
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
        this.setState({ INIT_priceMin: queryMinPrice, INIT_priceMax: queryMaxPrice})
        /* END INIT QUERY --- PRICE DATA */

        /* INIT PARSED QUERY (In the link) */
        let parsedQueryDataSet = queryString.parse(this.props.location.search);
        parsedQueryDataSet = {
          ...parsedQueryDataSet,
          sortBy: parsedQueryDataSet['?sortBy'] !== 'undefined' ? parsedQueryDataSet['?sortBy'] : 'increasing_price'
        }

        /* IF WE HAVE PARSED QUERY, WE HAVE TO USE ITS DATA */
        if(Object.keys(parsedQueryDataSet).length > 1){
            /* ASSIGN THE DATA OF THE PARSED QUERY */
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
            
            /* ASSIGN THE SUPPLIER ID TO OUR QUERY */
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
             /* ASSIGN ALL THE PRICE AND YEAR VALUES AS NUMBER TO OUR QUERY */
            query = {
              ...query,
              priceMin:  parseInt(parsedQueryDataSet.minPrice),
              priceMax: parseInt(parsedQueryDataSet.maxPrice),
              price : {
                ...query.price,
                value : {
                  min: parseInt(parsedQueryDataSet.minPrice),
                  max: parseInt(parsedQueryDataSet.maxPrice)
                },
              },
              minYear: parseInt(parsedQueryDataSet.minYear),
              maxYear: parseInt(parsedQueryDataSet.maxYear),
              year : {
                ...query.year,
                value : {
                  min: parseInt(parsedQueryDataSet.minYear),
                  max: parseInt(parsedQueryDataSet.maxYear)
                },
              }
            }

            if(query.brand !== 'all' && query.model === 'all'){
                query = {
                  ...query,
                  price : {
                    ...query.price,
                    scope: {
                      min: data[query.brand].price.min,
                      max: data[query.brand].price.max,
                    }
                  },
                  year: {
                    ...query.year,
                    scope: {
                      min: data[query.brand].year.min,
                      max: data[query.brand].year.max,
                    }
                  }
                }
            }

            if(query.brand !== 'all' && query.model !== 'all'){
              query = {
                ...query,
                price : {
                  ...query.price,
                  scope: {
                    min: data[query.brand].datas[query.model].minPrice,
                    max: data[query.brand].datas[query.model].maxPrice,
                  }
                },
                year: {
                  ...query.year,
                  scope: {
                    min: data[query.brand].datas[query.model].minYear,
                    max: data[query.brand].datas[query.model].maxYear,
                  }
                }
              }
            }
          this.props.setCurrentPage(parseInt(parsedQueryDataSet.page)) 
        }
    this.fetchProductsHandler(query)
    }
  }

  resetHandler = () => {
    let resetQuery = {
      page: 1,
      sortBy: 'increasing_price',
      supplierId: null,
      supplierName: 'all',
      brand: 'all',
      model: 'all',
      price: {
        scope: {
          min: this.state.INIT_priceMin,
          max: this.state.INIT_priceMax
        },
        value: {
          min: this.state.INIT_priceMin,
          max: this.state.INIT_priceMax
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
    const brandsAndModels = this.props.brandsAndModels;
    let query = {
      ...this.state.query,
      brand: brand,
      model: 'all',
    };
    if(brand === 'all'){
      query = {
        ...query,
        priceMin: this.state.INIT_priceMin,
        priceMax: this.state.INIT_priceMax,
        minYear: this.state.INIT_yearMin,
        maxYear: this.state.INIT_yearMax,
        price: {
          scope: {
            min: this.state.INIT_priceMin,
            max: this.state.INIT_priceMax,
          },
          value: {
            min: this.state.INIT_priceMin,
            max: this.state.INIT_priceMax
          }
        },
        year: {
          scope: {
            min: this.state.INIT_yearMin,
            max: this.state.INIT_yearMax,
          },
          value: {
            min: this.state.INIT_yearMin,
            max: this.state.INIT_yearMax
          }
        }
      }
    } else {
      query = {
        ...query,
        priceMin: brandsAndModels[brand].price.min,
        priceMax: brandsAndModels[brand].price.max,
        minYear: brandsAndModels[brand].year.min,
        maxYear: brandsAndModels[brand].year.max,
        price: {
          scope: {
            min: brandsAndModels[brand].price.min,
            max: brandsAndModels[brand].price.max,
          },
          value: {
            min: brandsAndModels[brand].price.min,
            max: brandsAndModels[brand].price.max
          }
        },
        year: {
          scope: {
            min: brandsAndModels[brand].year.min,
            max: brandsAndModels[brand].year.max,
          },
          value: {
            min: brandsAndModels[brand].year.min,
            max: brandsAndModels[brand].year.max
          }
        },

      }
    }
    this.fetchProductsHandler(query)
  }

  selectModelHandler = model => {
    const brandsAndModels = this.props.brandsAndModels;
    let query = {
          ...this.state.query,
          model: model
    };
    let brand = query.brand;
    if(model === 'all'){
        query = {
          ...query,
          priceMin: brandsAndModels[brand].price.min,
        priceMax: brandsAndModels[brand].price.max,
        minYear: brandsAndModels[brand].year.min,
        maxYear: brandsAndModels[brand].year.max,
        price: {
          scope: {
            min: brandsAndModels[brand].price.min,
            max: brandsAndModels[brand].price.max,
          },
          value: {
            min: brandsAndModels[brand].price.min,
            max: brandsAndModels[brand].price.max
          }
        },
        year: {
          scope: {
            min: brandsAndModels[brand].year.min,
            max: brandsAndModels[brand].year.max,
          },
          value: {
            min: brandsAndModels[brand].year.min,
            max: brandsAndModels[brand].year.max
          }
        },
        }
    } else {
      query = {
        ...query, 
        priceMin: brandsAndModels[brand].datas[model].minPrice,
        priceMax: brandsAndModels[brand].datas[model].maxPrice,
        minYear: brandsAndModels[brand].datas[model].minYear,
        maxYear: brandsAndModels[brand].datas[model].maxYear,

        price: {
          scope: {
            min: brandsAndModels[brand].datas[model].minPrice,
            max: brandsAndModels[brand].datas[model].maxPrice,
          },
          value: {
            min: brandsAndModels[brand].datas[model].minPrice,
            max: brandsAndModels[brand].datas[model].maxPrice,
          }
        }, 
        year: {
          scope: {
            min: brandsAndModels[brand].datas[model].minYear,
            max: brandsAndModels[brand].datas[model].maxYear,
          },
          value: {
            min: brandsAndModels[brand].datas[model].minYear,
            max: brandsAndModels[brand].datas[model].maxYear
          }
        }     
      } 
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
              pathname: '/inventory',
              search: `sortBy=${query.sortBy}&supplier=${query.supplierName}&brand=${query.brand}&model=${query.model}&minPrice=${query.price.value.min}&maxPrice=${query.price.value.max}&minYear=${query.year.value.min}&maxYear=${query.year.value.max}&page=${query.page}`,
        })   
      })
      .catch(err => {
        console.log(err);
      });
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
    const { query, loading, products, displayMode } = this.state;
    const suppliers = this.props.suppliers;
    const brandsAndModels = this.props.brandsAndModels;
    let productsList = <Loader />
    
    if(!loading ){
      productsList = (
        <Paginator 
            onRequestPreviousPage={this.paginationHandler.bind(this, 'previous')}
            onRequestNextPage={this.paginationHandler.bind(this, 'next')}
            lastPage={Math.ceil(this.props.totalProducts / this.props.itemsPerPage)}
            currentPage={this.props.currentPage}
            onRequestPageNumber={this.paginationHandler}
            products={products}>
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
                      {displayMode === 'list' && (
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
                       )}
                    </li>                
                  )
                }
                )}
              </ul>
        </Paginator>
      )
    }
    
    //INIT SUPPLIERS LIST FOR THE DROPDOWNLIST
    let suppliersList = [{text: 'all suppliers', value: 'all'}];
    suppliers && suppliers.forEach(supplier => {
      suppliersList = [...suppliersList, supplier.name]
    })

    //INIT MODELS LIST FOR THE DROPDOWNLIST
    let modelsList = [{text: 'all models', value: 'all'}];
    query.brand !== 'all' && query.brand !==  undefined && Object.keys(brandsAndModels[query.brand].datas).forEach(model => {
      modelsList = [...modelsList, model]
    })


    return (
      <div className="inventory">

              <div className="inventory__controller">

                <div className="inventory__controller__container">
                    <DropDownList 
                        value={query.sortBy.split('_').length > 1 ? `${query.sortBy.split('_')[0]} ${query.sortBy.split('_')[1]}` : query.sortBy}
                        list={[ 
                            { value: 'increasing_price', text: 'increasing price' },
                            { value: 'decreasing_price', text: 'decreasing price' },
                            { value: 'latest', text: 'latest' },
                            { value: 'most_popular', text: 'most popular' },
                        ]}
                        selectItemHandler={this.sortByHandler}
                    />
                    <DropDownList 
                      value={query.brand === 'all' ? 'all brands' : query.brand}
                      list={[ {text: 'all brands', value: 'all'} ,...Object.keys(brandsAndModels)]}
                      selectItemHandler={this.selectBrandHandler}
                    />

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
                    <DropDownList 
                        value={query.supplierName === 'all' ? 'all suppliers' : query.supplierName}
                        list={suppliersList}
                        selectItemHandler={this.selectSupplierHandler}
                    />
                    <DropDownList 
                        value={query.model === 'all' ? 'all models' : query.model}
                        list={modelsList}
                        selectItemHandler={this.selectModelHandler}
                    />                  
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
              </div>


              <div className="inventory__counter">
                        <Title title={`Products - ${this.props.totalProducts}`}>
                          <div className="inventory__controller__shortcut">
                            <div className={`inventory__controller__shortcut__button inventory__controller__shortcut__button--displayMode
                                            ${displayMode === 'list' ? 'active': ''}`}
                                onClick={this.toggleDisplayMode}>
                                  <IconSvg icon="eye"/>
                                  <span>Show Data</span>
                            </div> 
                            <div className="inventory__controller__shortcut__button inventory__controller__shortcut__button--reset"
                                onClick={this.resetHandler}>
                                  <IconSvg icon="return"/>
                                  <span>Reset</span>
                          </div>              
                        </div>
                        </Title>
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
