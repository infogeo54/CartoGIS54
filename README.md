# Bourgs-Centres

Bourgs-Centres is a GIS web app developed for some municipalities inside of the [Conseil Départemental de Meurthe-et-Moselle](http://meurthe-et-moselle.fr) in order to help them localizing and providing data about projects they did or they want to undertake.

## Front stack

The interface is developed with [Vue.js](https://github.com/vuejs/vue.git) and the state is managed thanks to [Vuex](https://github.com/vuejs/vuex.git)

The map is integrated using [Leaflet](https://github.com/Leaflet/Leaflet)

AJAX requets are made using [axios](https://github.com/axios/axios)

## Back stack

The whole server part is running in [containers](https://github.com/infogeo54/bourgs-centres/blob/master/docker-compose.yml) that you can configure as you want (see each image's documentation for more details).

## Setup

First, clone this repository :

```
git clone https://github.com/infogeo54/bourgs-centres.git

```

Then, follow these steps to configure the containers and the app :

NOTE : If you already have an existing and configured environment and a WMS/WFS server you can skip to the **App setup** section.

### Containers setup

#### PostGIS

PostGIS is a PostgreSQL database able to manipulate spatial and geographical objects.

##### Environment variables

You can edit existing environment variables or add some more (check image's documentation).

##### Persisting data

If you want the data to be persisted when you stop or remove the container, create a folder anywhere on your computer and edit the path in the volumes section : 

```
...
volumes:
  - /path/to/data/folder:/var/lib/postgres
...
```

#### pgAdmin

pgAdmin is an administration and development platform for PostgreSQL.

##### Environment variables

You can edit existing environment variables or add some more (check image's documentation).

##### Ports

Be aware to use an available port :

```
...
ports:
  - 1337:80
...
```

##### Connecting to the PostGIS container

Once you're signed in, if you didn't edit ENV variables nor the service name, create a new connection and provide these informations :

```
host: db
username: docker
password: docker
```

#### QGIS

QGIS is a free and open-source GIS.

##### GUI

NOTE : This configuration works for UNIX systems only.

If you want to run the QGIS container and display the GUI on your host machine, you'll have to enable the container to access you're current display by using :

```
sudo xhost +
```

##### Project file

Edit the path to your QGIS project in the volumes section : 

```
...
volumes:
  ...
  - /path/to/project/folder:/project
...
```

Then, if your QGIS project filename is different than *project.qgs*, edit the command section :

```
...
command: ["qgis", "filename.qgs"]
...
```

#### QGIS Server

##### Accessing to your QGIS project

Edit the path to your QGIS project in the volumes section : 

```
...
volumes:
  ...
  - /path/to/project/folder:/etc/qgisserver
...
```

IMPORTANT : If your QGIS project filename is different than *project.qgs*, you'll have to set the *QGIS_PROJECT_FILE* ENV variable :

```
environment:
  - QGIS_PROJECT_FILE: /etc/qgisserver/filename.qgs
```

##### Apache config & Server logging

You can edit existing environment variables or add some more (check image's documentation).

##### Ports

Be aware to use an available port :

```
...
ports:
  - 1337:80
...
```


### App setup

#### Install dependencies

```
npm install
```

#### WMS/WFS url

If you changed containers config or if you have an existing and configured environment with a WMS/WFS server you have to edit **host values** at the top of [WMS.js](https://github.com/infogeo54/bourgs-centres/blob/master/src/API/WMS.js) and [WFS.js](https://github.com/infogeo54/bourgs-centres/blob/master/src/API/WFS.js).

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
