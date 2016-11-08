var _ = require('underscore');
var d3 = require('d3');
var FeatureViewer = require('feature-viewer');
var templates = require('../templates');

var _gene = {}, _feature_viewer_id = _.uniqueId('feat_viewer_'), $div;


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function parseData(data){

    var parsed = {};

    parsed.tracks = _.compact(_.map(data.tracks, function(track, i){

        var feats;

        if(track.file_type === 'boundaries'){

            parsed.extent = d3.extent(track.x_values);

            feats =  _.map(track.x_values, function(d, j){
                return { x: d, y: track.y_values[j]};
            });


            return {
                type: 'line',
                name: track.section_name,
                className: 'tads',
                color: '#008B8D',
                height: '5',
                data: feats,
                interpolation: 'linear'
            };

        }else if(track.file_type === 'bed'){

            feats = _.map(track.intervals, function(d, j){

                var feat = {
                    x: d.bed[1],
                    y: d.bed[2]
                };

                if(track.title === 'genes')
                    feat.description = d.bed[3];

                if(_.isArray(d.bed[8])) feat.color = rgbToHex.apply(null, d.bed[8]);

                return feat;
            });

            return {
                type: 'rect',
                name: track.title,
                data: feats,
                color: 'steelblue'
            };
        }

    }));

    return parsed;

}

module.exports = Backbone.View.extend({

    initialize: function(options){
        this.options = options;
    },

    render: function(render){

        render = _.isUndefined(render) ? {} : render;
        render.feature_viewer = _feature_viewer_id;

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

        this.renderViewer(render.tracks);

        // Select all elements with data-toggle="tooltips" in the document
        $('[data-toggle="tooltip"]').tooltip();
    },

    setVisible: function(){
        $div.show().siblings().hide();
        $(this.el).css({opacity: 0.0, visibility: 'visible'}).animate({opacity: 1.0}, 800);
    },

    renderViewer: function(tracks){

        data = parseData(tracks);


        var ft = new FeatureViewer(
            data.extent[1],
            "#"+_feature_viewer_id,
            {
                showAxis: false,
                showSequence: false,
                brushActive: true,
                toolbar:false,
                bubbleHelp:false,
                zoomMax:10,
                offset: {start: data.extent[0], end: data.extent[1]}
            });


        _.each(data.tracks, ft.addFeature);
    }
});
