var glob = ('undefined' === typeof window) ? global : window,

Handlebars = glob.Handlebars || require('handlebars');

this["Templates"] = this["Templates"] || {};

this["Templates"]["browser"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "            <div class=\"col-xs-4 img_wrapper\">\r\n                <img class=\"lazy\" data-original=\""
    + alias2(alias1(depth0, depth0))
    + "\">\r\n                <!--<img src=\""
    + alias2(alias1(depth0, depth0))
    + "\" onload=\"imgLoaded(this)\">-->\r\n            </div>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"container-fixed\">\r\n    <div class=\"row\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.tracks : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n</div>";
},"useData":true});

this["Templates"]["gene"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <h1 class=\"page-header\">\r\n            "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n            <small> \r\n                 chromosome "
    + alias4(((helper = (helper = helpers.chromosome || (depth0 != null ? depth0.chromosome : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"chromosome","hash":{},"data":data}) : helper)))
    + " (start: "
    + alias4(((helper = (helper = helpers.start || (depth0 != null ? depth0.start : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"start","hash":{},"data":data}) : helper)))
    + ", end: "
    + alias4(((helper = (helper = helpers.end || (depth0 != null ? depth0.end : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"end","hash":{},"data":data}) : helper)))
    + ")\r\n            </small>\r\n        </h1>\r\n        <div style=\"width: 900px;\" id=\""
    + alias4(((helper = (helper = helpers.feature_viewer || (depth0 != null ? depth0.feature_viewer : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"feature_viewer","hash":{},"data":data}) : helper)))
    + "\"></div>\r\n        <a href=\"/#/browser/"
    + alias4(((helper = (helper = helpers.chromosome || (depth0 != null ? depth0.chromosome : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"chromosome","hash":{},"data":data}) : helper)))
    + ":"
    + alias4(((helper = (helper = helpers.start || (depth0 != null ? depth0.start : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"start","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.end || (depth0 != null ? depth0.end : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"end","hash":{},"data":data}) : helper)))
    + "\">\r\n            <img class=\"img-responsive\" src=\""
    + alias4(((helper = (helper = helpers.img || (depth0 != null ? depth0.img : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"img","hash":{},"data":data}) : helper)))
    + "\" alt=\"\" data-toggle=\"tooltip\" title=\"Click image to explore region in browser\">\r\n        </a>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        <div style=\"height:55%\">\r\n            <div class=\"alert alert-danger\" role=\"alert\">\r\n                <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\r\n                <span class=\"sr-only\">Error:</span>\r\n                "
    + container.escapeExpression(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"error","hash":{},"data":data}) : helper)))
    + "\r\n            </div>\r\n        </div>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"col-lg-12\">\r\n    \r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    \r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.error : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <hr>\r\n</div>";
},"useData":true});

this["Templates"]["index"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<hr>\r\n<div class=\"row\">\r\n    <div class=\"col-md-6\">\r\n        <p>HiCBrowser is a simple web browser to visualize <strong>Hi-C</strong> and other genomic tracks. \r\n        <p>It is based on <strong>HiCExplorer</strong>, a set of programs that enable you to process, normalize, analyze and visualize Hi-C data.</p>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n        <!-- build:src /static/img/vis.png -->\r\n        <img class=\"img-responsive\" src=\"../static/img/vis.png\" alt=\"\">\r\n        <!-- /build -->\r\n    </div>\r\n</div>\r\n<br>\r\n<br>\r\n";
},"useData":true});

this["Templates"]["introHeader"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"container\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1\">\r\n            <div class=\"site-heading\">\r\n                <div class=\"search-box\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-md-2\">\r\n                            <div class=\"fly\">\r\n                                <img src=\""
    + container.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"icon","hash":{},"data":data}) : helper)))
    + "\">\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"col-md-9 col-md-offset-1\">\r\n                            <h1>HiCBrowser</h1>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n";
},"useData":true});

this["Templates"]["loading"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"modal fade bs-example-modal-sm\" style=\"color: #fff\" tabindex=\"-1\" role=\"dialog\">\r\n    <div class=\"modal-dialog modal-sm\">\r\n        <div class=\"modal-content\">\r\n            <div class=\"search-box\" style=\"width:100%\">\r\n                <!-- build:src /static/img/loading.gif -->\r\n                    <img src=\"../static/img/loading.gif\">\r\n                <!-- /build -->\r\n                <h1>Loading ...</h1>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";
},"useData":true});

this["Templates"]["search"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        <small><a data-id=\""
    + container.escapeExpression(((helper = (helper = helpers.gene_example_id || (depth0 != null ? depth0.gene_example_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"gene_example_id","hash":{},"data":data}) : helper)))
    + "\" href=\"#\"> <span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\"></span> example</a></small>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        <small><a data-id=\""
    + container.escapeExpression(((helper = (helper = helpers.browser_example_id || (depth0 != null ? depth0.browser_example_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"browser_example_id","hash":{},"data":data}) : helper)))
    + "\" href=\"#\"> <span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\"></span> example</a></small>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<ul class=\"nav nav-pills\">\r\n    <li id=\""
    + alias4(((helper = (helper = helpers.gene_btn || (depth0 != null ? depth0.gene_btn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene_btn","hash":{},"data":data}) : helper)))
    + "\" data-id=\""
    + alias4(((helper = (helper = helpers.gene_btn || (depth0 != null ? depth0.gene_btn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene_btn","hash":{},"data":data}) : helper)))
    + "\" role=\"presentation\" class=\"active\"><a href=\"#\">Search Gene</a></li>\r\n    <li id=\""
    + alias4(((helper = (helper = helpers.browser_btn || (depth0 != null ? depth0.browser_btn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"browser_btn","hash":{},"data":data}) : helper)))
    + "\" data-id=\""
    + alias4(((helper = (helper = helpers.browser_btn || (depth0 != null ? depth0.browser_btn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"browser_btn","hash":{},"data":data}) : helper)))
    + "\" role=\"presentation\"><a href=\"#\">Browse Region</a></li>\r\n</ul>\r\n\r\n<br>\r\n\r\n<div class=\"jumbotron\">\r\n\r\n    <div>\r\n        <div class=\"input-group input-group-lg\">\r\n            <input id=\""
    + alias4(((helper = (helper = helpers.gene_search_input || (depth0 != null ? depth0.gene_search_input : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gene_search_input","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" class=\"  search-query form-control\" placeholder=\"Type a gene name here ...\" />\r\n            <span class=\"input-group-btn\">\r\n                <button id=\"search\" class=\"btn btn-primary\" type=\"button\" data-toggle=\"tooltip\" placement=\"bottom\" title=\"Search!\">\r\n                    <span class=\"glyphicon glyphicon-search\"></span>\r\n                </button>\r\n            </span>\r\n        </div>\r\n\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.gene_example : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n\r\n    <div style=\"display:none\">\r\n        <div class=\"input-group input-group-lg\">\r\n            <input id=\""
    + alias4(((helper = (helper = helpers.browser_search_input || (depth0 != null ? depth0.browser_search_input : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"browser_search_input","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" class=\"  search-query form-control\" placeholder=\"Type the region that you want to see ...\" />\r\n            <span class=\"input-group-btn\">\r\n                <button id=\"search\" class=\"btn btn-primary\" type=\"button\" data-toggle=\"tooltip\" placement=\"bottom\" title=\"Search!\">\r\n                    <span class=\"glyphicon glyphicon-search\"></span>\r\n                </button>\r\n            </span>\r\n        </div>\r\n\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.browser_example : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <br>\r\n\r\n        <div class=\"row\">\r\n            <div class=\"col-md-2 col-md-offset-5\">\r\n\r\n                <div id=\"control-buttons\"  class=\"btn-group\" role=\"group\" aria-label=\"...\">\r\n                    <a data-id=\""
    + alias4(((helper = (helper = helpers.prev_id || (depth0 != null ? depth0.prev_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prev_id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.previous || (depth0 != null ? depth0.previous : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"previous","hash":{},"data":data}) : helper)))
    + "\" role=\"button\" class=\"btn btn-primary\" data-toggle=\"tooltip\" placement=\"bottom\" title=\"Previous\">\r\n                        <span class=\"glyphicon glyphicon-backward\"></span>\r\n                    </a>\r\n                    <a data-id=\""
    + alias4(((helper = (helper = helpers.next_id || (depth0 != null ? depth0.next_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"next_id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.next || (depth0 != null ? depth0.next : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"next","hash":{},"data":data}) : helper)))
    + "\" role=\"button\" class=\"btn btn-primary\">\r\n                        <span class=\"glyphicon glyphicon-forward\" data-toggle=\"tooltip\" placement=\"bottom\" title=\"Next\"></span>\r\n                    </a>\r\n                    <a data-id=\""
    + alias4(((helper = (helper = helpers.zoomout_id || (depth0 != null ? depth0.zoomout_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"zoomout_id","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias4(((helper = (helper = helpers.out || (depth0 != null ? depth0.out : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"out","hash":{},"data":data}) : helper)))
    + "\" role=\"button\" class=\"btn btn-primary\">\r\n                        <span class=\"glyphicon glyphicon-zoom-out\" data-toggle=\"tooltip\" placement=\"bottom\" title=\"Zoom-out\"></span>\r\n                    </a>\r\n                </div>\r\n\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n\r\n<div id=\"error\" class=\"bg-danger\" style=\"text-align:center\"></div>\r\n";
},"useData":true});

if (typeof exports === 'object' && exports) {module.exports = this["Templates"];}