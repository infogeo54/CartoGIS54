/*
    Build a Transaction
 */


class Transaction{

    constructor() {
        this['_declaration'] = {
            '_attributes': {
                'version': '1.0',
                'encoding': 'utf-8'
            }
        }
        this['wfs:Transaction'] = {
            '_attributes':  {
                'version': '1.3.0',
                'xmlns:topp': 'http://www.openplans.org/topp',
                'xmlns:fes': 'http://www.opengis.net/fes/2.0',
                'xmlns:gml': 'http://www.opengis.net/gml/3.2',
                'xmlns:wfs': 'http://www.opengis.net/wfs/2.0',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
            },
            'wfs:Insert': {},
            'wfs:Update': {},
            'wfs:Delete': {},
        }
    }

    static insert (layer, feature) {
    }

    static update (layer, feature) {
    }

    static delete (feature) {
    }
}