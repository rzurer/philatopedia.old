function addCollectionTag(collection) {
	cloned = $('.collectionlabeltemplate').clone();
	cloned.removeClass('collectionlabeltemplate').addClass('collectionlabel')
	cloned.children('label').text(collection);
	cloned.appendTo('.collectionlabels');
}

function addCategoryTag(category) {
	cloned = $('.categorylabeltemplate').clone();
	cloned.removeClass('categorylabeltemplate').addClass('taglabel')
	cloned.children('label').text(category);
	cloned.appendTo('.categorylabels');
}

function addCategoryTags(categories) {
	categories.forEach(addCategoryTag);
}

function leaveCollection(obj) {
	$(obj).val($(obj).val());
	$('#addCollection').focus();
}

function addCollectionTags(collections) {
	collections.forEach(addCollectionTag);
}

function collectionsContain(source) {
	var collection;
	for (var i = 0; i < stamp.collections.length; i += 1) {
		collection = stamp.collections[i];
		if (collection.toLowerCase() === source.toLowerCase()) {
			return true;
		}
	};
	return false;
}


function categoriesContain(source) {
	var category;
	for (var i = 0; i < stamp.categories.length; i += 1) {
		category = stamp.categories[i];
		if (category.toLowerCase() === source.toLowerCase()) {
			return true;
		}
	};
	return false;
}


function addCategory() {
	var category, cloned;
	category = $('#categorysource').val().trim();
	if (category.length === 0 || categoriesContain(category)) {
		$('#collectionsource').val('').focus();
		return;
	}
	addCategoryTag(category);
	stamp.categories.push(category);
	upsertStamp(function () {
		picklists.setCategoriesAutocomplete();
		$('#categorysource').val('').focus();	
	});
}

function deleteCategory(obj) {
	var source;
	source = $(obj).prev().text();
	$(obj).parent().remove();
	stamp.categories = jQuery.grep(stamp.categories, function(value) {
		return value != source;
	});
	upsertStamp();
}

function addCollection() {
	var collection, cloned;
	collection = $('#collectionsource').val().trim();
	if (collection.length === 0 || collectionsContain(collection)) {
		$('#collectionsource').val('').focus();
		return;
	}
	addCollectionTag(collection);
	stamp.collections.push(collection);
	upsertStamp(function () {
		picklists.setCollectionsAutocomplete(true);
		$('#collectionsource').val('').focus();	
	});
}

function deleteCollection(obj) {
	var source;
	source = $(obj).prev().text();
	$(obj).parent().remove();
	stamp.collections = jQuery.grep(stamp.collections, function(value) {
		return value != source;
	});
	upsertStamp(function () {
		picklists.setCollectionsAutocomplete(true);
		removeCollectionFromQuery(source);
	});
}
