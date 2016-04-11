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
            parsed.seqLength = parsed.extent[1] - parsed.extent[0];
            
            feats =  _.map(track.x_values, function(d, j){
                return { x: d - parsed.extent[0], y: track.y_values[j]};
                //return { x: d - lx[0], y: data.y_values[i]};
            });
            
            
            return {
                type: 'line',
                name: track.section_name,
                className: 'tads',
                color: '#008B8D',
                height: '5',
                data: feats
            };
            
        }else if(track.file_type === 'bed'){
            
            feats = _.map(track.intervals, function(d, j){
                
                var feat = {
                    x: d.bed[1] - parsed.extent[0], 
                    y: d.bed[2] - parsed.extent[0]
                };
                
                if(!_.isUndefined(d.bed[8])) feat.color = rgbToHex.apply(null, d.bed[8]);
                
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
        
        this.renderViewer();
        
        // Select all elements with data-toggle="tooltips" in the document
        $('[data-toggle="tooltip"]').tooltip(); 
    },
    
    setVisible: function(){
        $div.show().siblings().hide();
        $(this.el).css({opacity: 0.0, visibility: 'visible'}).animate({opacity: 1.0}, 800);
    },
    
    renderViewer: function(){
        
        var data = 
            {"tracks": [{"x-axis": true, "fontsize": 15, "section_name": "1. [x-axis]"}, {"x_values": [21438852, 21457975.5, 21477099, 21477099, 21489854.5, 21502610, 21502610, 21517726.5, 21532843, 21532843, 21540403.0, 21547963, 21547963, 21557641.5, 21567320, 21567320, 21582578.5, 21597837], "file_type": "boundaries", "title": "", "width": 7, "section_name": "2. [tads]", "file": "data/domains.bed", "y_values": [0, 38247, 0, 0, 25511, 0, 0, 30233, 0, 0, 15120, 0, 0, 19357, 0, 0, 30517, 0]}, {"style": "flybase", "title": "chromatin states", "file_type": "bed", "border_color": "black", "labels": "off", "width": 0.5, "intervals": [{"bed": ["chr3L", 21449116, 21480549, "BLUE_4680", 0.0, ".", 21449116, 21480549, [0, 0, 255]], "row": 0}, {"bed": ["chr3L", 21482086, 21485430, "BLACK_4681", 0.0, ".", 21482086, 21485430, [0, 0, 0]], "row": 0}, {"bed": ["chr3L", 21485582, 21501095, "YELLOW_4682", 0.0, ".", 21485582, 21501095, [255, 255, 0]], "row": 1}, {"bed": ["chr3L", 21501092, 21503206, "RED_4683", 0.0, ".", 21501092, 21503206, [255, 0, 0]], "row": 0}, {"bed": ["chr3L", 21503429, 21535097, "YELLOW_4684", 0.0, ".", 21503429, 21535097, [255, 255, 0]], "row": 1}, {"bed": ["chr3L", 21535094, 21547753, "GREEN_4685", 0.0, ".", 21535094, 21547753, [0, 255, 0]], "row": 0}, {"bed": ["chr3L", 21547813, 21548764, "YELLOW_4686", 0.0, ".", 21547813, 21548764, [255, 255, 0]], "row": 1}, {"bed": ["chr3L", 21548990, 21560231, "BLACK_4687", 0.0, ".", 21548990, 21560231, [0, 0, 0]], "row": 0}, {"bed": ["chr3L", 21560261, 21563128, "YELLOW_4688", 0.0, ".", 21560261, 21563128, [255, 255, 0]], "row": 1}, {"bed": ["chr3L", 21563204, 21567105, "GREEN_4689", 0.0, ".", 21563204, 21567105, [0, 255, 0]], "row": 0}, {"bed": ["chr3L", 21567145, 21569780, "YELLOW_4690", 0.0, ".", 21567145, 21569780, [255, 255, 0]], "row": 1}, {"bed": ["chr3L", 21569822, 21572800, "BLACK_4691", 0.0, ".", 21569822, 21572800, [0, 0, 0]], "row": 0}, {"bed": ["chr3L", 21572912, 21602343, "BLUE_4692", 0.0, ".", 21572912, 21602343, [0, 0, 255]], "row": 1}], "fontsize": 12, "section_name": "3. [chrom states]", "file": "data/chromatinStates_kc.bed", "display": "collapsed"}, {"style": "flybase", "title": "genes", "file_type": "bed", "border_color": "black", "labels": "on", "width": 12, "intervals": [{"bed": ["chr3L", 21467232, 21469579, "croc", 0.0, "-"], "row": 0}, {"bed": ["chr3L", 21477990, 21483686, "Neu2", 0.0, "-"], "row": 0}, {"bed": ["chr3L", 21484498, 21485873, "CG7202", 0.0, "-"], "row": 0}, {"bed": ["chr3L", 21486182, 21487007, "CG7519", 0.0, "+"], "row": 1}, {"bed": ["chr3L", 21487118, 21490041, "Hr78", 0.0, "-"], "row": 2}, {"bed": ["chr3L", 21489492, 21491930, "CR43933", 0.0, "+"], "row": 0}, {"bed": ["chr3L", 21490648, 21500638, "Glg1", 0.0, "-"], "row": 1}, {"bed": ["chr3L", 21494520, 21497059, "Est-Q", 0.0, "+"], "row": 2}, {"bed": ["chr3L", 21500951, 21505849, "M6", 0.0, "+"], "row": 0}, {"bed": ["chr3L", 21505240, 21508987, "SAK", 0.0, "-"], "row": 1}, {"bed": ["chr3L", 21509405, 21515256, "Cdk12", 0.0, "+"], "row": 0}, {"bed": ["chr3L", 21516285, 21521263, "CG7611", 0.0, "+"], "row": 0}, {"bed": ["chr3L", 21521317, 21522433, "CG32442", 0.0, "-"], "row": 1}, {"bed": ["chr3L", 21521645, 21522215, "CR43877", 0.0, "+"], "row": 2}, {"bed": ["chr3L", 21523058, 21526813, "Mkrn1", 0.0, "-"], "row": 0}, {"bed": ["chr3L", 21527759, 21529367, "ppk5", 0.0, "+"], "row": 0}, {"bed": ["chr3L", 21530099, 21531682, "Rpn10", 0.0, "+"], "row": 1}, {"bed": ["chr3L", 21531958, 21532547, "CoVIII", 0.0, "-"], "row": 0}, {"bed": ["chr3L", 21532961, 21533798, "VhaM9.7-b", 0.0, "+"], "row": 2}, {"bed": ["chr3L", 21535458, 21536112, "CG33290", 0.0, "+"], "row": 1}, {"bed": ["chr3L", 21536949, 21548028, "Wnk", 0.0, "-"], "row": 0}, {"bed": ["chr3L", 21548472, 21551326, "CG7173", 0.0, "-"], "row": 1}, {"bed": ["chr3L", 21552073, 21555281, "CapaR", 0.0, "-"], "row": 0}, {"bed": ["chr3L", 21558525, 21560885, "CG7634", 0.0, "+"], "row": 0}, {"bed": ["chr3L", 21561158, 21561998, "CG7172", 0.0, "-"], "row": 1}, {"bed": ["chr3L", 21562275, 21566623, "Smc5", 0.0, "+"], "row": 2}, {"bed": ["chr3L", 21567113, 21567220, "mir-193", 0.0, "+"], "row": 0}, {"bed": ["chr3L", 21567230, 21568974, "CG32441", 0.0, "+"], "row": 1}, {"bed": ["chr3L", 21569132, 21570319, "CR43939", 0.0, "-"], "row": 2}, {"bed": ["chr3L", 21579927, 21606449, "TfAP-2", 0.0, "+"], "row": 0}], "fontsize": 16.0, "section_name": "4. [genes]", "file": "data/genes.bed6", "display": "stacked"}, {"style": "flybase", "file_type": "bed", "title": "CTCF motif", "color": "orange", "border_color": "black", "labels": "off", "width": 4, "intervals": [{"bed": ["chr3L", 21477136, 21477150, "GGCGACACCTACCGC", 0.146, "+"], "row": 0}, {"bed": ["chr3L", 21500557, 21500571, "TGCGGCATCTATAGT", 0.214, "+"], "row": 0}, {"bed": ["chr3L", 21531102, 21531116, "GGCTCCACCGACTGG", 0.214, "+"], "row": 0}, {"bed": ["chr3L", 21545845, 21545859, "TGCTCCGCCTCGCGG", 0.214, "+"], "row": 0}, {"bed": ["chr3L", 21547501, 21547515, "GGCGCCGTCTCCAGG", 0.214, "+"], "row": 0}], "fontsize": 12, "section_name": "5. [ctcf motif]", "file": "motifs/CTCF_at_boundary.bed", "display": "stacked"}, {"style": "flybase", "file_type": "bed", "title": "Beaf32 motif", "color": "red", "border_color": "black", "labels": "off", "width": 4, "intervals": [{"bed": ["chr3L", 21500653, 21500667, "GGCTATCGATAGATC", 0.172, "-"], "row": 0}, {"bed": ["chr3L", 21500654, 21500668, "ATCTATCGATAGCCG", 0.169, "+"], "row": 1}, {"bed": ["chr3L", 21500914, 21500928, "TACTATCGATGTTTC", 0.206, "-"], "row": 2}, {"bed": ["chr3L", 21500915, 21500929, "AAACATCGATAGTAC", 0.193, "+"], "row": 3}, {"bed": ["chr3L", 21503792, 21503806, "AATTATCGATCACAG", 0.186, "-"], "row": 0}, {"bed": ["chr3L", 21532571, 21532585, "AACTATCGCAAGCCA", 0.193, "+"], "row": 0}, {"bed": ["chr3L", 21532935, 21532949, "GACTATCGCTTGATT", 0.224, "-"], "row": 1}, {"bed": ["chr3L", 21547468, 21547482, "AAATATCGCTTACAG", 0.174, "+"], "row": 0}, {"bed": ["chr3L", 21548056, 21548070, "CGCTATCGATAGATC", 0.174, "-"], "row": 0}, {"bed": ["chr3L", 21548057, 21548071, "ATCTATCGATAGCGC", 0.206, "+"], "row": 1}, {"bed": ["chr3L", 21548454, 21548468, "CATTATCGAAAATCA", 0.236, "-"], "row": 2}], "fontsize": 12, "section_name": "6. [beaf32 motif]", "file": "motifs/BEAF32_at_boundary.bed", "display": "stacked"}, {"style": "flybase", "file_type": "bed", "title": "CP190 motif", "color": "lightgreen", "border_color": "black", "labels": "off", "width": 4, "intervals": [{"bed": ["chr3L", 21534520, 21534538, "CGTTGCATAGTTTTCGGCG", 0.00138, "+"], "row": 0}, {"bed": ["chr3L", 21546538, 21546556, "GAAAGCCCACTTGCAAGCA", 0.175, "-"], "row": 0}, {"bed": ["chr3L", 21549323, 21549341, "GCTAGCATATTTGTTGGCC", 0.108, "-"], "row": 0}], "fontsize": 12, "section_name": "7. [cp190 motif]", "file": "motifs/CP190_at_boundary.bed", "display": "stacked"}, {"style": "flybase", "file_type": "bed", "title": "Su(Hw) motif", "color": "darkblue", "border_color": "black", "labels": "off", "width": 4, "intervals": [{"bed": ["chr3L", 21476620, 21476638, "TGTGCAAAAAAATATCCAA", 0.173, "-"], "row": 0}, {"bed": ["chr3L", 21533660, 21533678, "AAAGCATAAAAATATGTTG", 0.188, "-"], "row": 0}, {"bed": ["chr3L", 21534522, 21534540, "TGCGCCGAAAACTATGCAA", 0.00126, "-"], "row": 0}, {"bed": ["chr3L", 21549321, 21549339, "TTGGCCAACAAATATGCTA", 0.106, "+"], "row": 0}], "fontsize": 12, "section_name": "8. [Su_Hw motif]", "file": "motifs/Su_Hw_at_boundary.bed", "display": "stacked"}, {"style": "flybase", "file_type": "bed", "title": "GxGT motif", "color": "cyan", "border_color": "black", "labels": "off", "width": 4, "intervals": [{"bed": ["chr3L", 21476620, 21476638, "TGTGCAAAAAAATATCCAA", 0.173, "-"], "row": 0}, {"bed": ["chr3L", 21533660, 21533678, "AAAGCATAAAAATATGTTG", 0.188, "-"], "row": 0}, {"bed": ["chr3L", 21534522, 21534540, "TGCGCCGAAAACTATGCAA", 0.00126, "-"], "row": 0}, {"bed": ["chr3L", 21549321, 21549339, "TTGGCCAACAAATATGCTA", 0.106, "+"], "row": 0}], "fontsize": 12, "section_name": "9. [GxGT motif]", "file": "motifs/Su_Hw_at_boundary.bed", "display": "stacked"}], "general": {"vertical_lines": [21438852, 21477099, 21502610, 21532843, 21547963, 21567320], "fig_width": 40, "fig_height": 42.5}
        };
        
        data = parseData(data);
        
        console.log(data);
        
        var seq =  new Array(data.seqLength + 1).join( 'c' );
        
        var ft2 = new FeatureViewer(
            seq,
            "#"+_feature_viewer_id, 
            {
                showAxis: false,
                showSequence: false,
                brushActive: true,
                toolbar:false,
                bubbleHelp:false,
                zoomMax:10
            });

        
        _.each(data.tracks, ft2.addFeature);
        
        //Add some features
        /*ft2.addFeature({
            data: data.tracks,
            name: "rect",
            className: "test1",
            color: "#005572",
            type: "line",
            filter: "type1"
        })*/
        
        /*ft2.addFeature({
            data: track,
            name: "test feature 1",
            className: "path",
            color: "#005572",
            type: "unique",
            filter: "type1"
        });
        
        ft2.addFeature({
            data: track,
            name: "test feature 1",
            className: "line",
            color: "#005572",
            type: "line",
            filter: "type1"
        });*/
        
        
        /*ft2.addFeature({
            data: [{x:52,y:52},{x:92,y:92}],
            name: "test feature 2",
            className: "test2",
            color: "#006588",
            type: "rect",
            filter: "type2"
        });
        
        ft2.addFeature({
            data: [{x:130,y:184},{x:40,y:142},{x:80,y:110}],
            name: "test feature 3",
            className: "test3",
            color: "#eda64f",
            type: "path",
            filter: "type2"
        });
        
        ft2.addFeature({
            data: [{x:120,y:154},{x:21,y:163},{x:90,y:108},{x:10,y:25},{x:193,y:210},{x:78,y:85},{x:96,y:143},{x:14,y:65},{x:56,y:167}],
            name: "test feature 4",
            className: "test4",
            color: "#F4D4AD",
            type: "rect",
            height: 8,
            filter: "type1"
        });
        
        var dataDemo = [];
        for (var i=1;i<100;i++) {
            var count = Math.floor((Math.random() * 20) + 1);
            dataDemo.push({
                x: i*2,
                y:count
            });
        }
        ft2.addFeature({
            data: dataDemo,
            name: "test feature 5",
            className: "test5",
            color: "#008B8D",
            type: "line",
            filter: "type2",
            height: "5"
        });*/
        
        
        
        
        
        
        /*var ft = new FeatureViewer(
                'MALWMRLLPLLALLALWGPGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLE',
                '#' + _feature_viewer_id,
                {
                    showAxis: true,
                    showSequence: true,
                    brushActive: true, //zoom
                    toolbar:true, //current zoom & mouse position
                    bubbleHelp:true, 
                    zoomMax:50 //define the maximum range of the zoom
                });*/
        
        /*ft.addFeature({
            data: [{x:20,y:32},{x:46,y:100},{x:123,y:167}],
            name: "test feature 1",
            className: "test1", //can be used for styling
            color: "#0F8292",
            type: "rect" // ['rect', 'path', 'line']
        });*/
    }
});