var templates = require('../templates');

module.exports = Backbone.View.extend({
    
    events: {
        'click #search' : 'search',
        'keydown #search_input' : 'keyAction'
    },
    
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
    },
    
    slideUp: function(){
        $('.site-heading').addClass('header_small');
    },
    
    setId: function(id){
        $('#search_input').val(id);
    },
    
    search: function(){
        var gene_name = $('#search_input').val();
        
        if( gene_name.length === 0 ) return;
        
        App.router.navigate('/gene/' + gene_name, {trigger: true}); 
    },
    
    keyAction: function(e){
        if(e.which === 13) this.search();
    }
});