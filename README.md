# GloBI Explorer: Interactive Ecosystem Explorer

This project was developed by a team of students as part of the [Indiana University Information Visualization 2015 MOOC](http://ivmooc.cns.iu.edu/).

## Goals

The  goal  of  GloBI  Explorer  is  to  design  an  engaging  yet informative  and  effective,  interactive  visualization  of the  biotic interaction data in GloBI and to provide an educational resource in ecology and biodiversity for middle and high-school students.

## Data

The data used in this project is based on the [Global Biotic Interactions API](https://github.com/jhpoelen/eol-globi-data/wiki/API), designed to provide access to interaction data for the purpose of integrating the data into wikis, custom webpages or other interaction exploration tools.

## Tech Stack

This is a single page application using [AngularJS](https://angularjs.org/) and scaffolded with the [Yeoman Angular Generator](https://github.com/yeoman/generator-angular). The visualization component is built with [D3.js](http://d3js.org/) and geospatial mapping provided by [Leaflet](http://leafletjs.com/).

[Bootstrap](http://getbootstrap.com/) is used for layout and [LESS](http://lesscss.org/) for CSS preprocessing.

## Developing

To get started, make sure you have [Node.js](https://nodejs.org/) installed, then run the following (mac users throw a `sudo` in front of these):

```bash
npm install -g grunt-cli
npm install -g bower
```

Then `cd` to project directory and run:

```bash
npm install && bower install
grunt serve
```

This will install all the required dependencies and launch a static connect server for development.

To generate and preview the optimized build (i.e. all assets concatenated, minified, reved etc.) run `grunt serve:dist`.
