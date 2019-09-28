export const formTech = [
    {
        id: 'transmissionType',
        value: 'manuelle',
        placeholder: 'manuel ou automatique',
        control: 'select',
        type: 'text',
        formType: "tech",
        label: 'boîte',
        options: ['manuelle', 'automatique']  
    },
    {
        id: 'nbGearRatios',
        value: 5,
        placeholder: 'nombre de rapports',
        control: 'select',
        type: 'number',
        formType: "tech",
        label: 'nb rapports',
        options: [5, 6]
        
    },

    {
        id: 'nbCylinders',
        value: 2,
        placeholder: 'nombre de cylindres',
        control: 'select',
        type: 'number',
        formType: "tech",
        label: 'nb cylindres',
        options: [2, 3, 4, 5, 6, 7,8,9,10,11,12]
    },

    {
        id: 'motorSize',
        value: '',
        placeholder: 'taille du moteur',
        control: 'input',
        type: 'text',
        formType: "tech",
        label: 'taille moteur'
    },

    {
        id: 'maxSpeed',
        value: '',
        placeholder: 'vitesse maximum',
        control: 'input',
        type: 'text',
        formType: "tech",
        label: 'vitesse max'
    },

    
]