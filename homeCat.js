app.events.subscribe('homeWidgetsReady', function(data, homeWidgets){
	var settings = homeWidgets.getSettings();
	homeWidgets.add('homeCat', function(widget, index){
		var that = this;
		var id = "catBrowse" + index.toString();
		
		function buildRoList(data, index, widgetId, soId) {
			$(widget).find('.widgetFooter').remove();
			if (data.length > settings.homeCatPageSize) {
				$(widget).append(homeWidgets.util.buildFooter(id));	
			}
			
			$('#' + widgetId).find('.cardArea').empty();
			var cardsToRender = data.slice(index, index + settings.homeCatPageSize);
			$.each(cardsToRender, function(ix, ro){
				var roIcon = '<img width="96" height="96" src="/ServiceCatalog/GetRequestOfferingImg/' + ro.RequestOfferingId + '">';
				var roCard = '<div class="cardBody"><div class="headerRow">' + roIcon;
				roCard += '<span class="roLabel">' + ro.RequestOfferingTitle + '</span></div></div>';
				$('#' + widgetId).find('.cardArea').append('<a href="/SC/ServiceCatalog/RequestOffering/' + ro.RequestOfferingId + ',' + soId + '"><li class="homePageLi">' + roCard + "</li></a>");
			});
			
			homeWidgets.util.pageSetup(data, index, widgetId, settings.homeCatPageSize);
			homeWidgets.util.pageX(data, widgetId, buildRoList, soId, settings.homeCatPageSize);
		}
		
		function buildSoList(data, index, widgetId) {
			$(widget).find('.widgetFooter').remove();
			if (data.length > settings.homeCatPageSize) {
				$(widget).append(homeWidgets.util.buildFooter(id));
			}
			
			$('#' + widgetId).find('.cardArea').empty();
			var cardsToRender = data.slice(index, index + settings.homeCatPageSize);
			$.each(cardsToRender, function(ix, s){
				$('#' + id).find('.cardArea').append('<div class="serviceCard homePageLi"><img width="96" height="96" src="/ServiceCatalog/GetServiceOfferingImg/' + s.ServiceOfferingId + '" />' + s.Service + '</div>');
			});
			
			$('.serviceCard').each(function(i,e){
				$(e).click(function(el){
					//add to breadcrumb
					$('#' + widgetId).find('.browseTop').append('<span class="bcSeparator">></span><span class="bc so">' + $(el.target).text() + '</span>');
					var selectedCategory = data.filter(function(c){return c.Category == $('#' + id).find('.browseTop').text()})[0];
					var selectedSO = data.filter(function(s){return s.Service == $(el.target).text()})[0];
					
					buildRoList(selectedSO.requestofferings,0,id, selectedSO.ServiceOfferingId);
					
					//handle breadcrumb clicks
					$('.bc').each(function(x,so){
						$(so).click(function(e) {
						if ($(e.target).hasClass('so')) {
							$(so).prev().remove();
							$(so).remove();
							buildSoList(data, index, widgetId, settings.homeCatPageSize);
						}
					})
				
			})
				})
			})
			homeWidgets.util.pageSetup(data, index, widgetId, settings.homeCatPageSize);
			homeWidgets.util.pageX(data, widgetId, buildSoList, null, settings.homeCatPageSize)
		}
		
		function buildCategoryList(data, index, widgetId) {
			$(widget).find('.widgetFooter').remove();
			if (data.length > settings.homeCatPageSize) {
				$(widget).append(homeWidgets.util.buildFooter(id));
			}
			$('#' + widgetId).find('.cardArea').empty();
			var cardsToRender = data.slice(index, index + settings.homeCatPageSize);
			$.each(cardsToRender, function(i, e) {
				$('#' + widgetId).find('.cardArea').append('<div class="catCard">' + e.Category + '</div>');
			})
			$('.catCard').each(function(x, o) {
				$(o).click(function(el){
					
					//start breadcrumb
					$('#' + widgetId).find('.browseTop').append('<span class="bc cat">' + $(el.target).text() + '</span>');
					var selectedCategory = data.filter(function(f){return f.Category == $(el.target).text()})[0];
					buildSoList(selectedCategory.services, 0, widgetId);
					
					//handle breadcrumb clicks
					$('.bc').each(function(i,e){
						$(e).click(function(el){
							if ($(el.target).hasClass('cat')) {
								that.callback(widget, index);
							}
						})
					})
				})
			})
			homeWidgets.util.pageSetup(data, index, widgetId, settings.homeCatPageSize);
			homeWidgets.util.pageX(data, widgetId, buildCategoryList, null, settings.homeCatPageSize);
			
		}
		
		var url = "/ServiceCatalog/GetServiceCatalogWithCatGroup";
		$(widget).empty();
		$(widget).append('<div id="' + id + '"><div class="browseTop"></div><div class="cardArea"></div></div>');

		$.get(url, function(data){
			buildCategoryList(data.Data, 0, id)	
		})
	});
});