var templates = require('../templates');

var _gene = {}, $div;

module.exports = Backbone.View.extend({
    
    initialize: function(options){
        this.options = options;
    },
    
    render: function(render){
        
        render = _.isUndefined(render) ? {} : render;
        
        if(render.id === _gene.id){
            return;
        }
        
        $(this.el).css({opacity: 0.0, visibility: 'hidden'});
        
        var tpl = templates.gene(render);
        
        if( ! _.isUndefined($div) ) $div.remove();  
        
        
        $div = $('<div></div>')
            .hide()
            .append(tpl);
        
        $(this.el).append($div);
        
        // Select all elements with data-toggle="tooltips" in the document
        $('[data-toggle="tooltip"]').tooltip(); 
    },
    
    setVisible: function(){
        $div.show().siblings().hide();
        $(this.el).css({opacity: 0.0, visibility: 'visible'}).animate({opacity: 1.0}, 800);
    }
});