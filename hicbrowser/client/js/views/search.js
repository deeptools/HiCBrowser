var _ = require('underscore');
var templates = require('../templates');


var prev_id = _.uniqueId('prev_id_'), next_id = _.uniqueId('next_id_') ,  zoomout_id = _.uniqueId('zoomout_id_'), browser_search_input = _.uniqueId('search_input_'), gene_search_input = _.uniqueId('search_input_'), search_btn = _.uniqueId('search_btn_'), gene_btn = _.uniqueId('gene_btn_'), browser_btn = _.uniqueId('browser_btn_'), gene_example_id = _.uniqueId('gene_example_'), browser_example_id = _.uniqueId('browser_example_');

var _show_gene = true, _links;

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
        'keydown input' : 'keyAction',
        'click a' : 'linkClick'
    },

    render: function(data){

        data = _.isUndefined(data) ? {} : data.attributes;

        data.prev_id = prev_id;
        data.next_id = next_id;
        data.zoomout_id = zoomout_id;
        data.gene_search_input = gene_search_input;
        data.browser_search_input = browser_search_input;
        data.gene_btn = gene_btn;
        data.browser_btn = browser_btn;
        data.browser_example_id = browser_example_id;
        data.gene_example_id = gene_example_id;


        var tpl = templates.search(data);
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

            App.router.navigate('/gene', {trigger: true, replace:true});

        }else if(id === browser_btn) {
            _show_gene = false;
            this.showBrowserView();

            App.router.navigate('/browser', {trigger: true, replace:true});
        }

    },

    linkClick: function(e){
        e.preventDefault();

        var id = $(e.currentTarget).data('id');

        if(id === gene_example_id){
            App.router.navigate('/gene/' + App.config.attributes.gene_example, {trigger: true});
        }else if(id === browser_example_id){
            App.router.navigate('/browser/' + App.config.attributes.browser_example, {trigger: true});
        }else if(!_.isUndefined(_links)){
            if(id === prev_id){
                App.router.navigate('/browser/' + _links.previous, {trigger: true});
            }else if(id === next_id){
                App.router.navigate('/browser/' + _links.next, {trigger: true});
            }else if(id === zoomout_id){
                App.router.navigate('/browser/' + _links.out, {trigger: true});
            }
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

    showBrowserView : function(links){
        _links = links;

        if(!_.isUndefined(links)) $( '#' + browser_search_input ).val(links.id);

        $( '#' + gene_btn).removeClass('active');
        $( '#' + browser_btn).addClass('active');

        $( '#' + gene_search_input ).parent().parent().css({opacity: 0.0, display: 'none'});
        $( '#' + browser_search_input ).parent().parent().css({opacity: 0.0, display: 'block'}).animate({opacity: 1.0}, 800);
    }
});
