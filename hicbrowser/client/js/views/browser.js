var _ = require('underscore');

var templates = require('../templates');

function _getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function _onload(e){
    
    var img = e.target;
    
    var imgWrapper = img.parentNode;
    imgWrapper.className += imgWrapper.className ? ' loaded' : 'loaded';
}

function _onerror(e){
    var img = e.target;
    img.src = '/static/img/not_found.png';
    
    var imgWrapper = img.parentNode;
    imgWrapper.className += imgWrapper.className ? ' loaded' : 'loaded';
}

function _load_images(imgDefer, n, index){
    
    var i = index || 0, j = 0;
    while( i < imgDefer.length && j < n){
        if(imgDefer[i].getAttribute('data-original')) {
            
            imgDefer[i].onload = _onload;
            imgDefer[i].onerror = _onerror;
            imgDefer[i].setAttribute('src', imgDefer[i].getAttribute('data-original'));
            j ++;
        }
        i++;
    }
    
    if(i < imgDefer.length -1 ){
        setTimeout(_load_images, 600, imgDefer, n, i);
    }
}


module.exports = Backbone.View.extend({
    
    initialize: function(options){
        this.options = options;
    },
    
    render: function(render){
        
        render.tracks = _.sortBy(_.flatten(render.tracks), function(url){
            return + _getParameterByName('id', url);
        });
        
        $(this.options.el).css({opacity: 0.0, visibility: 'hidden'});
        
        var tpl = templates.browser(render);
        $(this.options.el).html(tpl);
        
        _load_images(document.getElementsByTagName('img'), 6);
        
        $(this.options.el).css({opacity: 0.0, visibility: 'visible'}).animate({opacity: 1.0}, 800);
    },
});