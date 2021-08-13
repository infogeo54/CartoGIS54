import axios from 'axios'
import XMLConverter from 'xml2js' 
import XMLExtract from 'xml-extract'
import { server } from '@/app.config.json'

const defaultQueryParams = server.queryParams.map(param => `${param.key}=${param.value}`).join('&')
const baseUrl = `${server.host}?${defaultQueryParams}&SERVICE=WMS&VERSION=1.1.0`

// Modify tags name with the following rules
const tagNameProcessors = [
    function (name) { return name.replace('se:', '') },
    function (name) { return name.replace('ogc:', '') },
    function (name) {
        let firstLetter = name.charAt(0).toLowerCase()
        let restOfWord = name.slice(1)
        let camelCaseName = firstLetter.concat('', restOfWord)
        return camelCaseName
    }
]
// Modify the attributes name with the following rules
const attrNameProcessors = [ function (name) { return name.replace('xlink:', '') }, ]

// Overwrite SVGparameter with a new on, simpler/clearer/more readable
const renameSVGParameter = parameter => {
    let newParameter = {
        color: parameter[0]._,
        width: parameter[1]._,
        join: parameter[2]._
    }
    if(parameter.length == 4) { newParameter.lineCap = parameter[3]._ }
    return newParameter
}

const extractStyles = stylesXML => {
    let styles = []
    XMLExtract(stylesXML, 'se:Rule', true, (error, style) => {
        if(error) console.error(error);
        else {
            XMLConverter.parseString(style, {
                trim: true,
                explicitArray: false,
                tagNameProcessors,
            },(err, res) => {
                if(err) console.log(err);
                else {
                    // Extract the marker styles for Points
                    XMLExtract(style, 'se:PointSymbolizer', false, (err, style) => {
                        if(err) return;
                        else XMLConverter.parseString(style, {
                            trim: true,
                            explicitArray: false,
                            mergeAttrs: true,
                            tagNameProcessors,
                            attrNameProcessors,
                        }, (err, resPointSymbolizer) => {
                            if(err) console.error(err);
                            res.rule.pointSymbolizer.graphic = resPointSymbolizer.graphic 
                        })
                    })
                    if (!res.rule.textSymbolizer) {
                        if(res.rule.polygonSymbolizer) res.rule.polygonSymbolizer.stroke = renameSVGParameter(res.rule.polygonSymbolizer.stroke.svgParameter);
                        if(res.rule.lineSymbolizer) res.rule.lineSymbolizer.stroke = renameSVGParameter(res.rule.lineSymbolizer.stroke.svgParameter);
                        styles.push(res.rule);
                    }
                } 
            }); 
        }
    })
    return styles
}

const fetchStyles = async layerName => {
    const url = `${baseUrl}&REQUEST=GetStyles&LAYERS=${layerName}`
    const res = await axios.get(url)
    return extractStyles(res.data)
}

export default { fetchStyles }
