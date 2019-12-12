var glob = ('undefined' === typeof window) ? global : window,

Handlebars = glob.Handlebars || require('handlebars');

this["Templates"] = this["Templates"] || {};

this["Templates"]["browser"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "            <div class=\"col-xs-12 img_wrapper\">\n                <img class=\"lazy\" data-original=\""
    + alias2(alias1(depth0, depth0))
    + "\">\n                <!--<img src=\""
    + alias2(alias1(depth0, depth0))
    + "\" onload=\"imgLoaded(this)\">-->\n            </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"container-fixed\">\n    <div class=\"row\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.tracks : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n</div>\n";
},"useData":true});

this["Templates"]["gene"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <h1 class=\"page-header\">\n            "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n            <small>\n                 chromosome "
    + alias4(((helper = (helper = helpers.chromosome || (depth0 != null ? depth0.chromosome : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"chromosome","hash":{},"data":data}) : helper)))
    + " (start: "
    + alias4(((helper = (helper = helpers.start || (depth0 != null ? depth0.start : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"start","hash":{},"data":data}) : helper)))
    + ", end: "
    + alias4(((helper = (helper = helpers.end || (depth0 != null ? depth0.end : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"end","hash":{},"data":data}) : helper)))
    + ")\n            </small>\n        </h1>\n        <div style=\"width: 900px;\" id=\""
    + alias4(((helper = (helper = helpers.feature_viewer || (depth0 != null ? depth0.feature_viewer : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"feature_viewer","hash":{},"data":data}) : helper)))
    + "\"></div>\n\n        <ul class=\"nav nav-pills\">\n          <li class=\"active\">\n            <a href=\"/#/browser/"
    + alias4(((helper = (helper = helpers.chromosome || (depth0 != null ? depth0.chromosome : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"chromosome","hash":{},"data":data}) : helper)))
    + ":"
    + alias4(((helper = (helper = helpers.start || (depth0 != null ? depth0.start : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"start","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.end || (depth0 != null ? depth0.end : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"end","hash":{},"data":data}) : helper)))
    + "\">Explore region in browser</a>\n          </li>\n        </ul>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        <div style=\"height:55%\">\n            <div class=\"alert alert-danger\" role=\"alert\">\n                <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n                <span class=\"sr-only\">Error:</span>\n                "
    + container.escapeExpression(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"error","hash":{},"data":data}) : helper)))
    + "\n            </div>\n        </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"col-lg-12\">\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.error : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <hr>\n</div>\n";
},"useData":true});

this["Templates"]["index"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<hr>\n<div class=\"row\">\n    <div class=\"col-md-6\">\n        <p>HiCBrowser is a simple web browser to visualize <strong>Hi-C</strong> and other genomic tracks. \n        <p>It is based on <strong>pyGenomeTracks</strong>, a program and library to plot beautiful genome browser tracks.</p>\n    </div>\n    <div class=\"col-md-6\">\n        <!-- build:src /static/img/vis.png -->\n        <img class=\"img-responsive\" src=\"../static/img/vis.png\" alt=\"\">\n        <!-- /build -->\n    </div>\n</div>\n<br>\n<br>\n";
},"useData":true});

this["Templates"]["loading"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"modal fade bs-example-modal-sm\" style=\"color: #fff\" tabindex=\"-1\" role=\"dialog\">\n    <div class=\"modal-dialog modal-sm\">\n        <div class=\"modal-content\">\n            <div class=\"search-box\" style=\"width:100%\">\n                <!-- build:src /static/img/loading.gif -->\n                    <img src=\"../static/img/loading.gif\">\n                <!-- /build -->\n                <h1>Loading ...</h1>\n            </div>\n        </div>\n    </div>\n</div>";
},"useData":true});

this["Templates"]["search"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        <small><a data-id=\""
    + container.escapeExpression(((helper = (helper = helpers.gene_example_id || (depth0 != null ? depth0.gene_example_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"gene_example_id","hash":{},"data":data}) : helper)))
    + "\" href=\"#\"> <span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\"></span> example</a></small>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        <small><a data-id=\""
    + container.escapeExpression(((helper = (helper = helpers.browser_example_id || (depth0 != null ? depth0.browser_example_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"browser_example_id","hash":{},"data":data}) : helper)))
    + "\" href=\"#\"> <span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\"></span> example</a></small>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<ul class=\"nav nav-pills\">\n    <li id=\""
    + alias4(((helper = (helper = helpers.gene_btn || (depth0 != null ? depth0.gene_btn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene_btn","hash":{},"data":data}) : helper)))
    + "\" data-id=\""
    + alias4(((helper = (helper = helpers.gene_btn || (depth0 != null ? depth0.gene_btn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene_btn","hash":{},"data":data}) : helper)))
    + "\" role=\"presentation\" class=\"active\"><a href=\"#\">Search Gene</a></li>\n    <li id=\""
    + alias4(((helper = (helper = helpers.browser_btn || (depth0 != null ? depth0.browser_btn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"browser_btn","hash":{},"data":data}) : helper)))
    + "\" data-id=\""
    + alias4(((helper = (helper = helpers.browser_btn || (depth0 != null ? depth0.browser_btn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"browser_btn","hash":{},"data":data}) : helper)))
    + "\" role=\"presentation\"><a href=\"#\">Browse Region</a></li>\n</ul>\n\n<br>\n\n<div class=\"jumbotron\">\n\n    <div>\n        <div class=\"input-group input-group-lg\">\n            <input id=\""
    + alias4(((helper = (helper = helpers.gene_search_input || (depth0 != null ? depth0.gene_search_input : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene_search_input","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" class=\"  search-query form-control\" placeholder=\"Type a gene name here ...\" />\n            <span class=\"input-group-btn\">\n                <button id=\"search\" class=\"btn btn-primary\" type=\"button\" data-toggle=\"tooltip\" placement=\"bottom\" title=\"Search!\">\n                    <span class=\"glyphicon glyphicon-search\"></span>\n                </button>\n            </span>\n        </div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.gene_example : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n    <div style=\"display:none\">\n        <div class=\"input-group input-group-lg\">\n            <input id=\""
    + alias4(((helper = (helper = helpers.browser_search_input || (depth0 != null ? depth0.browser_search_input : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"browser_search_input","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" class=\"  search-query form-control\" placeholder=\"Type the region that you want to see ...\" />\n            <span class=\"input-group-btn\">\n                <button id=\"search\" class=\"btn btn-primary\" type=\"button\" data-toggle=\"tooltip\" placement=\"bottom\" title=\"Search!\">\n                    <span class=\"glyphicon glyphicon-search\"></span>\n                </button>\n            </span>\n        </div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.browser_example : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <br>\n\n        <div class=\"row\">\n            <div class=\"col-md-2 col-md-offset-5\">\n\n                <div id=\"control-buttons\"  class=\"btn-group\" role=\"group\" aria-label=\"...\">\n                    <a data-id=\""
    + alias4(((helper = (helper = helpers.prev_id || (depth0 != null ? depth0.prev_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prev_id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.previous || (depth0 != null ? depth0.previous : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"previous","hash":{},"data":data}) : helper)))
    + "\" role=\"button\" class=\"btn btn-primary\" data-toggle=\"tooltip\" placement=\"bottom\" title=\"Previous\">\n                        <span class=\"glyphicon glyphicon-backward\"></span>\n                    </a>\n                    <a data-id=\""
    + alias4(((helper = (helper = helpers.next_id || (depth0 != null ? depth0.next_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"next_id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.next || (depth0 != null ? depth0.next : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"next","hash":{},"data":data}) : helper)))
    + "\" role=\"button\" class=\"btn btn-primary\">\n                        <span class=\"glyphicon glyphicon-forward\" data-toggle=\"tooltip\" placement=\"bottom\" title=\"Next\"></span>\n                    </a>\n                    <a data-id=\""
    + alias4(((helper = (helper = helpers.zoomout_id || (depth0 != null ? depth0.zoomout_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"zoomout_id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.out || (depth0 != null ? depth0.out : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"out","hash":{},"data":data}) : helper)))
    + "\" role=\"button\" class=\"btn btn-primary\">\n                        <span class=\"glyphicon glyphicon-zoom-out\" data-toggle=\"tooltip\" placement=\"bottom\" title=\"Zoom-out\"></span>\n                    </a>\n                </div>\n\n            </div>\n        </div>\n    </div>\n\n</div>\n\n<div id=\"error\" class=\"bg-danger\" style=\"text-align:center\"></div>\n<br>\n";
},"useData":true});

if (typeof exports === 'object' && exports) {module.exports = this["Templates"];}