export {
    initAppData,
    setRequestedProduct,
    setRequestedProductId,
    toggleEditingMode,
    setProducts,
    addTotalProducts,
    setInventoryCurrentPage
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
    setError
} from './error'

export {
    setCurrency,
    setLang
} from './parameters'

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