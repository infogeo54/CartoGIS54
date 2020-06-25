/**
 * These options are used to configure the the URL where to send HTTP requests
 * host : the server's IP address or URL
 * queryParams : an array of default query parameters, applied to each requests
 */
export const server = {
    host: "0.0.0.0" || "my.geo.server.fr",
    queryParams: [
        "SERVICE=WMS",
        "MAP=/path/to/your/qgis/project.qgs"
    ]
}

/**
 * These options are used in order to add more customization to the interface
 * form : options relative to the Form component and it's subcomponents
 */
export const app = {
    form: {
        groups: {
            textAreaFields: [
                'observations'
            ],
            selectFields: [
                {
                    field: 'my-field',
                    options: [
                        { value: '1', text: 'Un' },
                        { value: '2', text: 'Deux' },
                        { value: '3', text: 'Trois' },
                        { value: '4', text: 'Quatre' },
                        { value: '5', text: 'Cinq' }
                    ]
                }
            ],
            requiredFields: [
                'nom',
                'projet',
                'geometry',
                'disponible',
                'vacances'
            ],
            disabledFields: [
                'type',
                'geometry'
            ]
        }
    }
}