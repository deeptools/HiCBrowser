var templates = require('../templates');

var _id = _.uniqueId('loading_');

module.exports = Backbone.View.extend({
    
    initialize: function(options){
        this.options = options;
    },
    
    render: function(render){
        
        render = _.isUndefined(render) ? {} : render;
        render.id = _id;
        
        var tpl = templates.loading(render);    
        $(this.options.el).append(tpl);
    },
    
    show: function(){
        $('#' + _id).modal({show:true, backdrop: 'static', keyboard: false});
    },
    hide:function(){
        $('#' + _id).modal('hide');
    }
});