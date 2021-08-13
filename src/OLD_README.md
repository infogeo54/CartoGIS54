# :rotating_light: This is the old README, some of the information might not work with the current app :rotating_light:
# Sources

This directory contains the source code of the **CartoGIS54** Web app.

## Configuration

The `app.config.json` file contains the app configuration.

Some configurations are required in order to make the app work correctly, they will be signaled with a *required* tag. 

Optional configurations will be signaled by an *optional* tag, even if they are recomended to offer a better user experience.

## QGIS Plugin

If you're using QGIS and QGIS Server to develop your Web Services (WMS/WFS), you could use the QGIS **Carto54 plugin** in order to create and fill this config file easily, see the [repository](https://github.com/infogeo54/carto54-config.git).

## File structure

```json
{
  "server": {
    "host": "",
    "queryParams": []
  },
  "form": {
    "inputDate": [],
    "inputNumber": [],
    "inputRange": [],
    "inputText": [],
    "selectBox": [],
    "textArea": []
  },
  "modals": []
}
```

## Server

The `server` section is used to tell your application where and how to send HTTP requests in order to retrieve or update data.

* `host` (String) : the IP adress or URL of the WMS/WFS data provider - *required*
* `queryParams` (Array) : a list of **query parameter objects** that will be applied to each request - *optional*

### Query parameter object

A query param is a simple object that takes 2 attributes :

* `key` (String) : the parameter that you want to add, see examples for [WMS](https://github.com/infogeo54/carto54-config/blob/master/fr.wikipedia.org/wiki/Web_Map_Service#Liste_des_param%C3%A8tres_disponibles) and [WFS](https://fr.wikipedia.org/wiki/Web_Feature_Service)
* `value` (String) : the value of the parameter that you want to add

## Form

The `form` section is used to customize the **Form component** in order to make it more user friendly :

You can add a **field object** to the appropiate section :

* `selectBox` : fields that will be rendered as **select boxes**
* `inputNumber` : fields that will be rendered as **number inputs**
* `inputDate` : fields that will be rendered as **date inputs**
* `inputText` : fields that will be rendered as **text inputs**
* `inputRange` : fields that will be rendered as **range inputs**
* `textArea` : fields that will be rendered as **text areas**

Each section must be composed of **valid Field objects**. 

### Field object

A field object must respect a **pre-defined structure** and implement some required parameters :

```json
{
  "name": "",
  "alias": "",
  "options": {}
}
```

* `name` (String) : the name of the field, as returned by your WFS (check *DescribeFeatureType* requests) - *required*
* `alias` (String) : the alias is a user-friendly name that will be displayed inside the Form part of the Web app - *optional*
* `options` (Object) : a list of useful options that can be applied to the field, see the **Options section** below - *optional*

#### Options

Options can be defined inside the `options` attribute.

They are all optional, even if they are highly recomended to offer a better user experience.

There are many different options, depending on the field's type :

* `disabled` (Boolean) : indicates if the field must be disabled
* `hidden` (Boolean) : indicates if the field must be rendered
* `required` (Boolean) : indicates if the field must be filled before sending data
* `map` (Array) : an array of `{ "text": "", "value": "" }` objects, used to provide *selectBox* options
* `Min` (Number) : the minimum value that can be applied
* `Max` (Number) : the maximum value that can be applied
* `Step` (Number) : the increment value that will be applied
* `Style` (String : `"Spinbox"` | `"Slider""`) : indicates the way to represent a number input. Spinbox defines a classic HTML number input when Slider defines an HTML range input

## Modals

This section is used to configure modals that can be added to your the app.

The idea here, is to provide meta-data about your modal before writing its content within an HTML file, placed into the `src/modals` directory.

Those meta-data must respect a *pre-defined structure* :

```json
{
  "name": "",
  "title": "",
  "icon": "",
  "visible": false
}
```

* `name` (String) : the name will be used to identify the modal in the DOM and to tell the app the name of the HTML file where to find the content
* `title` (String) : the title will be displayed inside the modal header
* `icon` (String) : the name of a *free and valid FontAwesome icon* that will be used for the modal trigger button, check the list [here](https://fontawesome.com/icons?d=gallery)
* `visible` (Boolean) : indicates if the modal must be displayed by default, you'll often want to set it to `false`
