var _ = require('underscore');

var templates = require('../templates');

var _data = {};

module.exports = Backbone.View.extend({
    
    initialize: function(options){
        this.options = options;
    },
    
    render: function(render){
        
        $('.site-heading').removeClass('header_small');
        
        render = _.isUndefined(render) ? {} : render;
        
        $('#content').css({opacity: 0.0, visibility: 'hidden'});
        
        var tpl = templates.index(render);    
        $('#content').html(tpl);
        
        $('#content').css({opacity: 0.0, visibility: 'visible'}).animate({opacity: 1.0}, 800);
    }
});