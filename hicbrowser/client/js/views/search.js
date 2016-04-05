var _ = require('underscore');
var templates = require('../templates');


var prev_id = _.uniqueId('prev_id_'), next_id = _.uniqueId('next_id_') ,  zoomout_id = _.uniqueId('zoomout_id_'), browser_search_input = _.uniqueId('search_input_'), gene_search_input = _.uniqueId('search_input_'), search_btn = _.uniqueId('search_btn_'), gene_btn = _.uniqueId('gene_btn_'), browser_btn = _.uniqueId('browser_btn_');

var _show_gene = true;

function _redirect(url){
    App.router.navigate(url, {trigger: true});
}

module.exports = Backbone.View.extend({
    
    initialize: function(options){
        this.options = options;
    },
    
    events: {
        'click li' : 'onLiClick',
        'click button' : 'search',
        'keydown input' : 'keyAction'
    },
    
    render: function(render){
        
        render = _.isUndefined(render) ? {} : render;
        
        render.prev_id = prev_id;
        render.next_id = next_id;
        render.zoomout_id = zoomout_id;
        render.gene_search_input = gene_search_input;
        render.browser_search_input = browser_search_input;
        render.gene_btn = gene_btn;
        render.browser_btn = browser_btn;
        
        
        var tpl = templates.search(render);
        $(this.options.el).html(tpl);
    },
    
    update : function(obj){
        
        if(_.isUndefined(obj.name)){
            onGeneButton();
        }else{
            onBrowserButton();
            updateButtons(obj);
        }
    },
    
    updateButtons : function(obj){
        document.getElementById(prev_id).href = '/#/browser/' + obj.previous;
        document.getElementById(next_id).href = '/#/browser/' + obj.next;
        document.getElementById(zoomout_id).href = '/#/browser/' + obj.out;
    },
    
    search: function(){
        var val = (_show_gene) ? $( '#' + gene_search_input).val() : $( '#' + browser_search_input).val();
        
        if(val.length > 0){
            var url = (_show_gene) ? '/gene/' + val : '/browser/' + val;
            App.router.navigate(url, {trigger: true});
        }
    },
    
    onLiClick : function(e){
        e.preventDefault();
        
        var id = $(e.currentTarget).data('id');
        
        if(id === gene_btn){
            _show_gene = true;
            this.showGeneView();
        }else if(id === browser_btn) {
            _show_gene = false;
            this.showBrowserView();
        }
        
    },
    
    keyAction: function(e){
        if(e.which === 13) this.search();
    },
    
    showGeneView : function(id){
        
        if(!_.isUndefined(id)) $( '#' + gene_search_input ).val(id);
        
        $( '#' + browser_btn).removeClass('active');
        $( '#' + gene_btn).addClass('active');
        
        $( '#' + browser_search_input ).parent().parent().css({opacity: 0.0, display: 'none'});
        $( '#' + gene_search_input ).parent().parent().css({opacity: 0.0, display: 'block'}).animate({opacity: 1.0}, 800);
    }, 
    
    showBrowserView : function(id, links){
        
        if(!_.isUndefined(id)) $( '#' + browser_search_input ).val(id);
        
        links = _.isUndefined(links) ? {previous: '', next: '', out: ''} : links;
        this.updateButtons(links);
        
        if(!_.isUndefined(links)) $( '#' + browser_search_input ).val(id);
        
        $( '#' + gene_btn).removeClass('active');
        $( '#' + browser_btn).addClass('active');
        
        $( '#' + gene_search_input ).parent().parent().css({opacity: 0.0, display: 'none'});
        $( '#' + browser_search_input ).parent().parent().css({opacity: 0.0, display: 'block'}).animate({opacity: 1.0}, 800);
    }
});