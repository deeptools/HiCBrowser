module.exports = Backbone.Model.extend({
    defaults: {
        browser_example: '',
        gene_example: '',
        icon: '/static/img/circose.png'
    },
    urlRoot: '/static/json/config.json'
});
