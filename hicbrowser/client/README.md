# HiCBrowser web client

This project aims to visualize gene expression profiles in the context of mitochondrial processes. See a working demo [here](http://jmvillaveces.github.io/mito_models_visualization/dist/).

## Getting Started

1. Clone the project
`git clone https://github.com/maxplanck-ie/HiCBrowser`
2. Install dependencies
`npm i`
3. Compile the project
`grunt dist`

## Usage

```
<html>
    <head>

        <!-- 1. Import the app styles CSS -->
        <link href='css/App.css' rel='stylesheet' type='text/css'>

    </head>

    <body></body>

    <!-- 2. Import javascript  -->
    <script src="js/App.min.js"></script>

    <script>
        // 3. Initialize application!
        App.init({
          browser_example: 'X:3800000-4340000',
          gene_example: 'mof',
          icon: '/static/img/fly.svg'
        });

        // Alternatively use the default configuration:
        // App.init();
    </script>
</html>
```

## Built With

* [NPM](https://www.npmjs.com/) - Dependency Management
* [GRUNT](http://gruntjs.com/) - Task Runner
* [Backbone](http://backbonejs.org/) -  model–view–presenter (MVP) application design paradigm
* [Handlebars](http://handlebarsjs.com/) - HTML templating
