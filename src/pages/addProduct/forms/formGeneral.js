export const formGeneral = [
    {
        id: 'title',
        value: '',
        placeholder: 'titre',
        control: 'input',
        type: 'text',
        formType: "general",
        label: 'titre'
        
    },

    {
        id: 'made',
        value: '',
        placeholder: 'marque',
        control: 'input',
        type: 'text',
        formType: "general",
        label: 'marque'
    },

    {
        id: 'model',
        value: '',
        placeholder: 'modèle',
        control: 'input',
        type: 'text',
        formType: "general",
        label: 'modèle'
    },

    {
        id: 'year',
        value: '2008',
        placeholder: 'année',
        control: 'select',
        type: 'text',
        formType: "general",
        label: 'année',
        options: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
    },

    {
        id: 'price',
        value: '',
        placeholder: 'prix',
        control: 'input',
        type: 'number',
        formType: "general",
        label: 'prix'
    },

    {
        id: 'nbKilometers',
        value: '',
        placeholder: 'Nombre de kilomètres',
        control: 'input',
        type: 'number',
        formType: "general",
        label: 'Nb km'
    },

    {
        id: 'gazol',
        value: 'essence',
        placeholder: 'essence ou diesel',
        control: 'select',
        type: 'text',
        formType: "general",
        label: 'carburant',
        options: ['essence', 'diesel']
    },

    {
        id: 'yearOfRelease',
       // value: '2008',
        placeholder: 'année de mise en circulation',
        control: 'select',
        type: 'text',
        formType: "general",
        label: 'mise en circulation',
        options: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
    },

    {
        id: 'nbOwners',
        value: 0,
        placeholder: 'nombre de propriétaires',
        control: 'select',
        type: 'number',
        formType: "general",
        label: 'nb proprios',
        options: [0, 1, 2, 3, 4, 5, 6]
    },

    {
        id: 'serialNumber',
        value: '',
        placeholder: 'numéro de série',
        control: 'input',
        type: 'text',
        formType: "general",
        label: 'numéro de série'
    },

    {
        id: 'generalState',
        value: '',
        placeholder: 'état général',
        control: 'input',
        type: 'text',
        formType: "general",
        label: 'état général'
    },

    {
        id: 'publicity',
        value: 'oui',
        placeholder: 'oui ou non',
        control: 'select',
        type: 'text',
        formType: "general",
        label: 'publicité',
        options: ['oui', 'non']
    },

    {
        id: 'homePage',
        value: 'oui',
        placeholder: 'oui ou non',
        control: 'select',
        type: 'text',
        formType: "general",
        label: "page d'accueil",
        options: ['oui', 'non']
    }
]