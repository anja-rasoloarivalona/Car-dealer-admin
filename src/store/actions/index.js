export {
    setRequestedProduct,
    setRequestedProductId,
    toggleEditingMode,
    setProducts,
    setBrandsAndModels,
    setTotalProducts,
    addTotalProducts,
    setProductsQueries,
    setSavedProductsQueriesToTrue
} from './products'


export {
    toggleShowFullNavbar,
    initNotifications,
    addANotification,
    substractANotification
} from './nav'

export {
    loginSucceeded,
    loginFailed,
    setLoginStateToTrue,
    setLoginStateToFalse,
} from './auth'


export {
    setSuppliers
} from './suppliers'


export {
    setCurrentPage
} from './paginator'

export {
    setError
} from './error'


export {
    setPublicityData,
    setPublicityEditingMode,
    setPublicitySelectedPubProducts,
    setPublicitySelectedHomePageProducts,
    cancelPublicityEditingMode,
    deletePublicitySelectedPubProducts,
    deletePublicitySelectedHomePageProducts,
    togglePublicitySelector,
    setPublicitySelectorSelectedProducts,
    addPublicityPubProducts,
    addPublicityHomePageProducts
} from './publicity'