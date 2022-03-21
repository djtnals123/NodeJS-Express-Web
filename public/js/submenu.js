/*$(function(){
	$('.sub').hide();
	$('.menu li')
	.on('mouseover',function() {
		$('.sub',this).slideDown()
	})
	.on('mouseout',function() {
		$('.sub',this).slideUp()
	})
});*/


$(function(){
	$('.sub').hide();
	$('.menu li').hover(function() {//slideover
		$('ul',this).slideDown('fast') //내가 지금 오버한 ul밑에 있는 li
	},function() {//slideOut
		$('ul',this).slideUp('fast')
	}) //hover 메소드는 slideover과 slideOut 두가지 실행문을 가지고 있는 메소드이다 .hover(function() {},function() {})

});