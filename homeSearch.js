app.events.subscribe('homeWidgetsReady', function(data,homeWidgets){	
	homeWidgets.add('homeSearch', function(widget, index){
		var type,url,pm,onSelect,template;
		type = $(widget).hasClass('ro') ? 'ro' : $(widget).hasClass('kb') ? 'kb' : '';
		
		switch (type) {
			case "ro": {
				url = "/api/V3/ServiceCatalog/Search";
				pm = function(data, type) {
					if (type == "read") {
						return {
							searchText: data.filter.filters[0].value,
							searchType: "Requests",
							skipCount: 0,
							takeCount: 10
						}
					}
					else {
						return data;
					}
				};
				onSelect = function(select){
					window.open('/ServiceCatalog/RequestOffering/' + select.dataItem.Id + ',' + select.dataItem.ServiceOfferingId, '_self');
				};
				ktemplate = '<div class="homeListResult"><img class="listImage" src="/ServiceCatalog/GetRequestOfferingImg/#: data.Id #" ></img><span class="k-state-default"><h3>#: data.Title #</h3></span></div>';
				break;
			}
			case 'kb': {
				url = "/api/V3/ArticleList",
				pm = function(data, type) {
					if (type == "read") {
						return {
							searchText: data.filter.filters[0].value,
						}
					}
					else {
						return data;
					}
				};
				onSelect = function(select) {
					window.open('/KnowledgeBase/View/' + select.dataItem.ArticleId, '_self');
				};
				ktemplate = '<div class="homeListResult"><img class="listImage" src="/Content/Images/Icons/Drawer/kb-black.svg" ></img><span class="k-state-default"><h3>#: data.Title #</h3></span></div>';
				break;
			}
			default: {
				url = "/Search/GetFacetedSearchJsonResult";
				pm = function(data, type) {
					if (type == "read") {
						return {
							searchText: data.filter.filters[0].value,
						}
					}
					else {
						return data;
					}
				};
				onSelect= function (select){
					var surl;
					switch (select.dataItem.Type) {
						case 'KnowledgeArticle': {
							surl = '/KnowledgeBase/View/' + select.dataItem.Id;
							break;
						}
						case 'RequestOffering': {
							surl = '/ServiceCatalog/RequestOffering/' + select.dataItem.Id + ',' + select.dataItem.ServiceOfferingId;
							break;
						}
					}
					window.open(surl, '_self');
				};
				ktemplate = '<div class="homeListResult"><img class="listImage" src="#: data.Type == "RequestOffering" ? "/ServiceCatalog/GetRequestOfferingImg/" + data.Id : "/Content/Images/Icons/Drawer/kb-black.svg" #"></img>' +
			'<span class="k-state-default"><h3>#: data.Title #</h3></span></div>';
			}
		}
		
		$(widget).empty();
		$(widget).append('<input type="text" id="homeSearch' + index.toString() + '"></input>');
		$('#homeSearch' + index.toString()).kendoAutoComplete({
			dataTextField: "Title",
			filter: "contains",
			minLength: 3,
			clearButton: true,
			dataSource: {
				serverFiltering: true,
				type: "json",
				transport: {
					read: {url: url}, 
					parameterMap: pm
				}
			},
			select: onSelect,
			template: ktemplate
		});
	
	});
});
	