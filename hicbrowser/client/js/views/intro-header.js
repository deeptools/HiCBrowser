var _ = require('underscore');

var templates = require('../templates');

module.exports = Backbone.View.extend({

    initialize: function(options){
        this.options = options;
    },

    render: function(data){
        var tpl = templates.introHeader(data.attributes);
        $(this.options.el).append(tpl);
    }
});
