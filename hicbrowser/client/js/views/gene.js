var templates = require('../templates');

module.exports = Backbone.View.extend({
    
    initialize: function(options){
        this.options = options;
    },
    
    render: function(render){
        
        render = _.isUndefined(render) ? {} : render;
        
        $(this.options.el).css({opacity: 0.0, visibility: 'hidden'});
        
        var tpl = templates.gene(render);
        $(this.options.el).html(tpl);
        
        $(this.options.el).css({opacity: 0.0, visibility: 'visible'}).animate({opacity: 1.0}, 800);
        
        // Select all elements with data-toggle="tooltips" in the document
        $('[data-toggle="tooltip"]').tooltip(); 
    },
});