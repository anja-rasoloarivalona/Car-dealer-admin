export const INITIAL_FORM = {
    general : {
        title: {
            valueType: 'text',
            control: 'input',
            label: 'title',
            placeholder: 'title',
            value: ''
        },

        brand: {
            valueType: 'text',
            control: 'input',
            label: 'brand',
            placeholder: 'brand',
            value: ''
        },

        model: {
            valueType: 'text',
            control: 'input',
            label: 'model',
            placeholder: 'model',
            value: ''
        },

        year: {
            valueType: 'text',
            control: 'select',
            label: 'year',
            placeholder: 'year',
            value: '2008',
            options: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
        },

        price: {
            valueType: 'number',
            control: 'input',
            label: 'price',
            placeholder: 'price',
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
            placeholder: 'kilometers',
            value: 0
        },
        
        gazol: {
            valueType: 'text',
            control: 'select',
            label: 'fuel',
            placeholder: 'fuel',
            value: 'essence',
            options: ['essence', 'diesel']
        },

        yearOfRelease: {
            valueType: 'text',
            control: 'select',
            label: 'year of release',
            placeholder: 'year of release',
            value: '2008',
            options: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
        },

        nbOwners: {
            valueType: 'number',
            control: 'select',
            label: 'nb owners',
            placeholder: 'number of owners',
            value: 0,
            options: [0, 1, 2, 3, 4, 5, 6]
        },

        serialNumber: {
            valueType: 'text',
            control: 'input',
            label: 'serial number',
            placeholder: 'serial number',
            value: ''
        },

        generalState: {
            valueType: 'text',
            control: 'input',
            label: 'general state',
            placeholder: 'general state',
            value: ''
        },

        publicity: {
            valueType: 'number',
            control: 'select',
            label: 'publicity',
            placeholder: 'true',
            value: 'true',
            options: ['true', 'false']
        },

        homePage: {
            valueType: 'number',
            control: 'select',
            label: "home page",
            placeholder: 'true',
            value: 'true',
            options: ['true', 'false']
        },
    },

    supplier : {
        reference: {
            valueType: 'text',
            control: 'input',
            label: 'reference',
            placeholder: 'reference',
            value: ''
        },

        supplierPrice : {
            valueType: 'number',
            control: 'input',
            label: 'supplier price',
            placeholder: 'supplier price',
            value: 0
        },

        supplierName : {
            valueType: 'text',
            control: 'select',
            label: 'supplier',
            placeholder: 'supplier',
            value: '',
            options: []
        }


    },

    tech : {
        transmissionType : {
            valueType: 'text',
            control: 'select',
            label: 'gear box',
            placeholder: 'gear box',
            value: 'manual',
            options: ['manual', 'automatic']  
        },

        nbGearRatios : {
            valueType: 'number',
            control: 'select',
            label: 'gear box ratio',
            placeholder: 'gear box ratio',
            value: 5,
            options: [5, 6]  
        },

        nbCylinders : {
            valueType: 'number',
            control: 'select',
            label: 'nb cylinders',
            placeholder: 'nombre de cylinders',
            value: 2,
            options: [2, 3, 4, 5, 6, 7,8,9,10,11,12]
        },

        motorSize: {
            valueType: 'text',
            control: 'input',
            label: 'motor size',
            placeholder: 'motor size',
            value: ''
        },

        maxSpeed: {
            valueType: 'text',
            control: 'input',
            label: 'max speed',
            placeholder: 'max speed',
            value: ''
        },



    },

    design: {
        intColor: {
            valueType: 'text',
            control: 'input',
            label: 'interior color',
            placeholder: 'interior color',
            value: ''
        },

        extColor: {
            valueType: 'text',
            control: 'input',
            label: 'exterior color',
            placeholder: 'exterior color',
            value: ''
        },
    }

    
}

   





