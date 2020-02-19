export const INITIAL_FORM = {
    general : {
        title: {
            valueType: 'text',
            control: 'input',
            label: 'titre',
            placeholder: 'titre',
            value: ''
        },

        brand: {
            valueType: 'text',
            control: 'input',
            label: 'marque',
            placeholder: 'marque',
            value: ''
        },

        model: {
            valueType: 'text',
            control: 'input',
            label: 'modèle',
            placeholder: 'modèle',
            value: ''
        },

        year: {
            valueType: 'text',
            control: 'select',
            label: 'année',
            placeholder: 'année',
            value: '2008',
            options: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
        },

        price: {
            valueType: 'number',
            control: 'input',
            label: 'prix',
            placeholder: 'prix',
            value: 0
        },
        bodyType: {
            valueType: 'text',
            control: 'select',
            label: 'body type',
            placeholder: 'body type',
            value: 'sedan',
            options: ['sedan','coupe','hatchBack','SUV','crossover','minivan','pickup']
        },
            

        nbKilometers: {
            valueType: 'number',
            control: 'input',
            label: 'Nb km',
            placeholder: 'Nombre de kilomètres',
            value: 0
        },
        
        gazol: {
            valueType: 'text',
            control: 'select',
            label: 'carburant',
            placeholder: 'essence',
            value: 'essence',
            options: ['essence', 'diesel']
        },

        yearOfRelease: {
            valueType: 'text',
            control: 'select',
            label: 'mise en circulation',
            placeholder: 'année de mise en circulation',
            value: '2008',
            options: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
        },

        nbOwners: {
            valueType: 'number',
            control: 'select',
            label: 'nb proprios',
            placeholder: 'nombre de propriétaires',
            value: 0,
            options: [0, 1, 2, 3, 4, 5, 6]
        },

        serialNumber: {
            valueType: 'text',
            control: 'input',
            label: 'numéro de série',
            placeholder: 'numéro de série',
            value: ''
        },

        generalState: {
            valueType: 'text',
            control: 'input',
            label: 'état général',
            placeholder: 'état général',
            value: ''
        },

        publicity: {
            valueType: 'number',
            control: 'select',
            label: 'publicité',
            placeholder: 'oui ou non',
            value: 'oui',
            options: ['oui', 'non']
        },

        homePage: {
            valueType: 'number',
            control: 'select',
            label: "page d'accueil",
            placeholder: 'oui ou non',
            value: 'oui',
            options: ['oui', 'non']
        },
    },

    supplier : {
        reference: {
            valueType: 'text',
            control: 'input',
            label: 'référence',
            placeholder: 'référence',
            value: ''
        },

        supplierPrice : {
            valueType: 'number',
            control: 'input',
            label: 'prix fournisseur',
            placeholder: 'prix fournisseur',
            value: 0
        },

        supplierName : {
            valueType: 'text',
            control: 'select',
            label: 'fournisseur',
            placeholder: 'fournisseur',
            value: '',
            options: []
        }


    },

    tech : {
        transmissionType : {
            valueType: 'text',
            control: 'select',
            label: 'boîte',
            placeholder: 'manuelle ou automatique',
            value: 'manuelle',
            options: ['manuelle', 'automatique']  
        },

        nbGearRatios : {
            valueType: 'number',
            control: 'select',
            label: 'nb rapports',
            placeholder: 'nombre de rapports',
            value: 5,
            options: [5, 6]  
        },

        nbCylinders : {
            valueType: 'number',
            control: 'select',
            label: 'nb cylindres',
            placeholder: 'nombre de cylindres',
            value: 2,
            options: [2, 3, 4, 5, 6, 7,8,9,10,11,12]
        },

        motorSize: {
            valueType: 'text',
            control: 'input',
            label: 'taille moteur',
            placeholder: 'taille du moteur',
            value: ''
        },

        maxSpeed: {
            valueType: 'text',
            control: 'input',
            label: 'vitesse maximum',
            placeholder: 'vitesse max',
            value: ''
        },



    },

    design: {
        intColor: {
            valueType: 'text',
            control: 'input',
            label: 'couleur intérieure',
            placeholder: 'couleur intérieure',
            value: ''
        },

        extColor: {
            valueType: 'text',
            control: 'input',
            label: 'couleur extérieure',
            placeholder: 'couleur extérieure',
            value: ''
        },
    }

    
}

   





