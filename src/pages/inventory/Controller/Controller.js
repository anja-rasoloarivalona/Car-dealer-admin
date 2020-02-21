import React, { Component } from 'react';
import './Controller.css';
import { connect } from 'react-redux';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import DropDownList from '../../../components/dropDownList/DropDownList'


 class Controller extends Component {

    componentDidMount(){
        
    }
    componentDidUpdate(prevProps){
        // if(prevProps.currency !== this.props.currency){
        //    console.log('formated', this.props.query.price.formatedValue)
        // }
    }
    render() {
        const {query} = this.props;  
        let bodyTypeList = this.props.bodyTypeList;
        let data = this.props.brandAndModelsData;


        let brandData = Object.keys(data)
        let bodyTypeBrandData = [];
        if(query.bodyType !== 'all'){
            Object.keys(data).forEach(brand => {
                if(Object.keys(data[brand]).includes(query.bodyType)){
                    bodyTypeBrandData.push(brand)
                }
            })
            brandData = bodyTypeBrandData
        }

        let modelData = [];
        if(query.brand !== 'all'){
            if(query.bodyType === 'all'){
                Object.keys(data[query.brand]).forEach(bodyType => {
                    modelData = [...modelData, ...data[query.brand][bodyType]]
                })
            } else { modelData = [...modelData, ...data[query.brand][query.bodyType]]
            }
        }

        let suppliers = this.props.suppliers;

        let suppliersName = [];
        suppliers.forEach(supplier => {
            suppliersName.push(supplier.name)
        }) 

        return (
       
            <div className="inventory__controller">

                        <DropDownList 
                            value={query.bodyType === 'all' ? 'all body types' : query.bodyType}
                            list={[ {text: 'all body types', value: 'all'}, ...bodyTypeList]}
                            selectItemHandler={this.props.selectBodyTypeHandler}
                        />

                        <DropDownList 
                            value={query.brand === 'all' ? 'all brands' : query.brand}
                            list={[ {text: 'all brands', value: 'all'}, ...brandData]}
                            selectItemHandler={this.props.selectBrandHandler}
                        />
      
                        <DropDownList 
                            value={query.model === 'all' ? 'all models' : query.model}
                            list={ query.brand !== 'all' ? [{text: 'all models', value: 'all'}, ...modelData] : ['all models']}
                            selectItemHandler={this.props.selectModelHandler}
                        />
              
                        {query.sort && (
                            <DropDownList 
                            value={query.sort}
                            list={['increasing price', 'decreasing price', 'latest', 'most popular']}
                            selectItemHandler={this.props.sortHandler}
                            />
                        )}

                        <DropDownList 
                            value={query.supplierName === 'all' ? 'all suppliers': query.supplierName}
                            list={[ {value: 'all', text: 'all suppliers'}, ...suppliersName]}
                            selectItemHandler={this.props.selectSupplierHandler}
                        />
                      
                 

                    <div className="inventory__controller__group">
                        <div className="inventory__controller__group__infos">
                            <div className="inventory__controller__group__infos__key">
                                Price
                            </div>
                            <div className="inventory__controller__group__infos__value">
                                {query.price.value.min} - {query.price.value.max}
                            </div>
                        </div>
                        <InputRange 
                            step={1000}
                            maxValue= {query.price.scope.max}
                            minValue={query.price.scope.min}
                            value={query.price.value}
                            onChange={value => this.props.changePriceHandler(value)}
                            onChangeComplete={this.props.changeComplete}/>
                    </div>

                    <div className="inventory__controller__group">
                        <div className="inventory__controller__group__infos">
                            <div className="inventory__controller__group__infos__key">
                                Year
                            </div>
                            <div className="inventory__controller__group__infos__value">
                                {query.year.value.min} - {query.year.value.max}
                            </div>
                        </div>
                        <InputRange 
                            maxValue={query.year.scope.max }
                            minValue={query.year.scope.min } 
                            value={query.year.value}
                            onChange={value => this.props.changeYearHandler(value)}
                            onChangeComplete={this.props.changeComplete}/>
                    </div>
                </div>
        )
    }

}


const mapStateToProps = state => {
    return {
        brandAndModelsData: state.products.brandAndModelsData,
        price: state.products.price,
        bodyTypeList: state.products.bodyTypeList,
        suppliers: state.suppliers.suppliers
    }
}

export default connect(mapStateToProps)(Controller)
