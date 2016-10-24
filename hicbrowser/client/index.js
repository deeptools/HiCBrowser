//Required global libs
global.jQuery = $ = require('jquery');
Backbone = require('backbone');
Backbone.$ = jQuery;
require('bootstrap');

// Views
var Loading = require('./js/views/loading');
var Search = require('./js/views/search');
var Index = require('./js/views/index');
var GeneView = require('./js/views/gene');
var BrowserView = require('./js/views/browser');
var Intro = require('./js/views/intro-header');

function initViews(){
  // Render initial views
  App.views.intro.render(App.config);
  App.views.search.render(App.config);
}

App = {};

App.init = function(){

    //Views
    App.views = {};
    App.views.loading = new Loading({el:'body'});
    App.views.search = new Search({el:'#search'});
    App.views.index = new Index({el:'#content'});
    App.views.gene = new GeneView({el:'#content'});
    App.views.browser = new BrowserView({el:'#content'});
    App.views.intro = new Intro({el:'.intro-header'});

    // Models
    App.models = {};
    App.models.Gene = require('./js/models/gene');
    App.models.Browser = require('./js/models/browser');
    App.models.Config = require('./js/models/config');

    // Init config with defaults
    App.config = new App.models.Config();

    // See if there is a config file defined.
    // If not, load app with defaults
    App.config.fetch({
      success: initViews,
      error: initViews
    });

    //Router
    App.router = require('./js/router');

    // listen to ajax
    $(document).ajaxStart(function() {
        App.views.loading.show();
    }).ajaxStop(function() {
        setTimeout(App.views.loading.hide, 800);
    });

    // Render loading
    App.views.loading.render();

    // Select all elements with data-toggle="tooltips" in the document
    $('[data-toggle="tooltip"]').tooltip();
};

App.init();
