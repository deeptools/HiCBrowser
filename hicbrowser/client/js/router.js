// Views
var Index = require('./views/index');
var index = new Index({el:'body'});

var GeneView = require('./views/gene');
var geneView = new GeneView({el:'#content'});

// Models
var Gene = require('./models/gene');


var AppRouter = Backbone.Router.extend({
    routes: {
        "gene/:id": 'getGene',
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
            
            index.setId(gene.name);
            index.slideUp();
            geneView.render(gene);
        },
        error: function(gene, res){
            
            var text = ( res.responseText === 'unknown gene' ) ? 'No results for ' + id : res.responseText;
            
            var error = { error : text};
            
            index.setId(gene.name);
            index.slideUp();
            geneView.render(error);
        }
    });
});

app_router.on('route:defaultRoute', function (actions) {
    index.render();
});

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();

module.exports = app_router;