//Required libs
global.jQuery = $ = require('jquery');
Backbone = require('backbone');
Backbone.$ = jQuery;
_ = require('underscore');
require('bootstrap');

// Views
var Loading = require('./js/views/loading');
var loading = new Loading({el:'body'});

App = {};

//Router
App.router = require('./js/router');

App.init = function(){

    // listen to ajax
    $(document).ajaxStart(function() {
        loading.show();

    }).ajaxStop(function() {
        setTimeout(loading.hide, 800);
    });
    
    // Render loading
    loading.render();
};

App.init();