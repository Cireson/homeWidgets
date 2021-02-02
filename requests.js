app.events.subscribe('homeWidgetsReady', function(data, homeWidgets){
	homeWidgets.add('requests', function(widget, index) {
		var url;
		var classes = $(widget).attr('class').split(/\s+/);
		var type = classes.indexOf('fav') > -1 ? 'fav' : 'top';
		var hov = classes.indexOf('horizontal') > -1 ? 'horizontal' : 'vertical';
		
		switch (type) {
			case 'fav': {
				url = '/ServiceCatalog/GetFavoriteRequestOffering';
				break;
			}
			case 'top': {
				url = '/api/V3/ServiceCatalog/GetTopRequestOffering?isScoped=' + session.user.Security.IsServiceCatalogScoped + '&returnAmount=5&userId=' + session.user.Id;
				break;
			}
			default: {
				url = '/ServiceCatalog/GetFavoriteRequestOffering';
			}
		}
		$(widget).empty().addClass(hov).append('<div id="roArea_' + type + '" class="roArea ' + hov + '"></div>');
		$.get(url, function(data) {
			var widgetData = _.has(data, 'Data') ? data.Data : data;
			$.each(widgetData, function(i,e) {
				$('#roArea_' + type).append('<div class="roTile ' + hov + '"><a id="' + type +'_' + e.Id + '" href="/ServiceCatalog/RequestOffering/' + e.Id + ',' + e.ServiceInfo.Id + '"></a></div>');
				$('#' + type + '_' + e.Id).append('<div class="imgHolder"><img width="96" height="96" src="/ServiceCatalog/GetRequestOfferingImg/' + e.Id + '"></div>' + e.Title)
			});
		});
	});
});