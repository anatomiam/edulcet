// 'use strict'

$(document).ready(function() {

    // Sticky navbar
    $(window).scroll(function() {

        if ($(window).scrollTop() > 50) {
            $('.navigation').addClass('sticky');
        } else {
            $('.navigation').removeClass('sticky');
        }
    });

    // scroll navigation
    $('.goto').click(function(e) {
        var link = $(this).attr('href');
        var offset = (function() {
            if (link === "#home" || link === "#contact") {
                return 0;
            } 
            else if (link === "#where") {
                return $(window).height() - 350;
            }
            else if (link === "#who" && $(window).width() < 475) {
                return 0;
            }
            else {
                return 70;
            }
        })();
        var posi = $(link).offset().top - offset;
        e.preventDefault();
        $('body,html').animate({
            scrollTop: posi
        }, 700);
    });


   // var screenHeight = $(window).height();
   // $('.jumbotron').css('height', (screenHeight - (screenHeight /4))+ 'px');
   // $('.bg-index-bottom').css('height', (screenHeight + 'px'));


});
