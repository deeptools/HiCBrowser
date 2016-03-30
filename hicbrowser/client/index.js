//Required libs
global.jQuery = $ = require('jquery');
require('bootstrap');

function search(){
    
    var gene_name = $('#search_input').val();
    
    if( gene_name.length === 0 ) return;
    
    $.get('/tad?gene=' + gene_name, function(res) {
        
        if(res.error){
            /* TODO  */
            return;
        }
        
        res = JSON.parse(res);
        
        $('#content').css({opacity: 0.0, visibility: 'hidden'});
        $('.site-heading').addClass('header_small');
        
        $('#content').html(getTADView(res));
        $('#content').css({opacity: 0.0, visibility: 'visible'}).animate({opacity: 1.0}, 800);
        
    });
    
}

function getTADView(data){
    
    return '<div class="col-lg-12"><h1 class="page-header">'+ data.gene +'<small> chromosome ' + data.chromosome +' (start: ' + data.start + ', end: ' + data.end + ')</small></h1><a href="/browser?region=' + data.chromosome + ':' + data.start + '-' + data.end + '"><img class="img-responsive" src="' + data.img + '" alt=""></a><hr></div>';
    
}

$('#search').click(search);