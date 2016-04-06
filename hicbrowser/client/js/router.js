var _ = require('underscore');

var AppRouter = Backbone.Router.extend({
    routes: {
        
        "gene": 'getGene',
        "gene/:id": 'getGeneId',
        
        "browser" : 'getBrowser',
        "browser/:id" : 'getBrowserId',
        
        "*actions": "defaultRoute"
        // Backbone will try to match the route above first
    }
});

function setIndex(){
    if(!App.views.index.rendered) App.views.index.render();
    App.views.index.setVisible();
}

var _current = {};

function _renderGene(gene){
    
    App.views.search.showGeneView(gene.id);
    App.views.gene.render(gene);
    App.views.gene.setVisible();
}

function _renderBrowser(browser){
    
    App.views.search.showBrowserView(browser);
    App.views.browser.render(browser);
    App.views.browser.setVisible();
}

// Instantiate the router
var app_router = new AppRouter();

app_router.on('route:getGene', function(){
    
    if(!_.isUndefined(_current.gene)){
        App.router.navigate('/gene/' + _current.gene.id, {trigger: false});
        _renderGene(_current.gene);
        return;
    }
    
    
    App.views.search.showGeneView();
    setIndex();
});

app_router.on('route:getGeneId', function (id) {
    
    if(!_.isUndefined(_current.gene) && _current.gene.id === id){
        _renderGene(_current.gene);
        return;
    }
    
    var gene = new App.models.Gene({id:id});
    
    gene.fetch({
        success: function(gene){
            
            gene = gene.toJSON();
            _current.gene = gene;
            _renderGene(gene);
            
        },
        error: function(gene, res){
            
            var text = ( res.responseText === 'unknown gene' ) ? 'No results for ' + id : res.responseText;
            
            var error = { error : text};
            
            //search.showGeneView(id);
            //geneView.render(error);
        }
    });
});

app_router.on('route:getBrowser', function(){
    
    if(!_.isUndefined(_current.browser)){
        App.router.navigate('/browser/' + _current.browser.id, {trigger: false});
        _renderBrowser(_current.browser);
        return;
    }
    
    App.views.search.showBrowserView();
    setIndex();
});

app_router.on('route:getBrowserId', function (id) {
    
    if(!_.isUndefined(_current.browser) && _current.browser.id === id){
        _renderBrowser(_current.browser);
        return;
    }
    
    var browser = new App.models.Browser({id:id});
    
    browser.fetch({
        success: function(browser){
            browser = browser.toJSON();
            _current.browser = browser;
            _renderBrowser(browser);
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

app_router.on('route:defaultRoute', setIndex);

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();

module.exports = app_router;