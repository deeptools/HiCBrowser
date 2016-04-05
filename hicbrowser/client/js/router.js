// Views
var Search = require('./views/search');
var search = new Search({el:'#search'});
search.render();

var Index = require('./views/index');
var index = new Index({el:'body'});

var GeneView = require('./views/gene');
var geneView = new GeneView({el:'#content'});


var BrowserView = require('./views/browser');
var browserView = new BrowserView({el:'#content'});

// Models
var Gene = require('./models/gene');
var Browser = require('./models/browser');



var AppRouter = Backbone.Router.extend({
    routes: {
        "gene/:id": 'getGene',
        "browser/:id" : 'getBrowser',
        "*actions": "defaultRoute"
        // Backbone will try to match the route above first
    }
});

// Instantiate the router
var app_router = new AppRouter();

app_router.on('route:getGene', function (id) {
    var gene = new Gene({id:id});
    
    gene.fetch({
        success: function(gene){
            
            gene = gene.toJSON();
            
            search.showGeneView(id);
            geneView.render(gene);
        },
        error: function(gene, res){
            
            var text = ( res.responseText === 'unknown gene' ) ? 'No results for ' + id : res.responseText;
            
            var error = { error : text};
            
            search.showGeneView(id);
            geneView.render(error);
        }
    });
});

app_router.on('route:getBrowser', function (id) {
    var browser = new Browser({id:id});
    
    browser.fetch({
        success: function(browser){
            
            browser = browser.toJSON();
            
            
            search.showBrowserView(id, browser);
            browserView.render(browser);
        },
        error: function(browser, res){
            
            /*var text = ( res.responseText === 'unknown gene' ) ? 'No results for ' + id : res.responseText;
            
            var error = { error : text};
            
            index.setId(gene.name);
            index.slideUp();
            geneView.render(error);*/
        }
    });
});

app_router.on('route:defaultRoute', function (actions) {
    index.render();
});

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();

module.exports = app_router;