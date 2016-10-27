var _ = require('underscore');

var templates = require('../templates');

var _data = {}, $div;

module.exports = Backbone.View.extend({

    initialize: function(options){
        this.options = options;
    },

    render: function(render){

        render = _.isUndefined(render) ? {} : render;

        $(this.el).css({opacity: 0.0, visibility: 'hidden'});

        var tpl = templates.index(render);

        $div = $('<div></div>')
            .hide()
            .append(tpl);

        $(this.el)
            .empty()
            .append($div);

        this.rendered = true;
    },

    // Returns true if the view element is in the DOM
    rendered: false,

    setVisible: function(){
        $div.show().siblings().hide();
        $(this.el).css({opacity: 0.0, visibility: 'visible'}).animate({opacity: 1.0}, 800);
    }

});
