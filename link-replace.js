app.events.subscribe('homeWidgetsReady', function(data, homeWidgets){
	homeWidgets.add('link-replace', function(widget){
		$(widget).parent().parent().parent().parent().prev().remove();
	});
});