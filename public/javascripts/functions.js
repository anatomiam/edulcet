'use strict'
$('.button').eq(0).click(function () {
	$('html, body').animate({ scrollTop: 
		$('.container').eq(0).offset().top }, 500);
});
$('.button').eq(1).click(function () {
	$('html, body').animate({ scrollTop: 
		$('.container').eq(1).offset().top }, 500);
});
$('.button').eq(2).click(function () {
	$('html, body').animate({ scrollTop: 
		$('.container').eq(2).offset().top }, 500);
});
$('.button').eq(3).click(function () {
	$('html, body').animate({ scrollTop: 
		$('.container').eq(3).offset().top }, 500);
});