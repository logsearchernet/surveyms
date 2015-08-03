var basePath='/quiz/';
var jsonData;
var currentItemsn;
var currentPartsn;

$(document).ready(function(){
	
	jsonData = createJsonData();
	renderJsonData(jsonData);
	
	$(document).on("keyup", "textarea#title-input" , function(e) {
		

		   proname = $(this).val();
		   console.log('proname='+proname)
		   updateTitle(proname, jsonData);
		   renderJsonData(jsonData);
	});
	
	$(document).on("click", "div#title-edit" , function(e) {
		activaTab('tab_3')
	});
	
	$(document).on("mouseover", "div#title-edit" , function(e) {
		$('#title-editbar').removeClass('hide');
	});
	$(document).on("mouseout", "div#title-edit" , function(e) {
		$('#title-editbar').addClass('hide');
	});
	
	$(document).on("mouseover", "li.question" , function(e) {
		$(this).find('div.question-editbar').removeClass('hide');
	});
	$(document).on("mouseout", "li.question" , function(e) {
		$(this).find('div.question-editbar').addClass('hide');
	});
	
	$(document).on("click", "button#questionMultiple" , function(e) {
		var itemType = 'radio';
		var values = new Array(0);
		values.push('Your Option 1')
		values.push('Your Option 2')
		values.push('Your Option 3')
		commonQuestionTemplate(itemType, values)
		activaTab('tab_2');
	});
	
	$(document).on("click", "button#questionCheckbox" , function(e) {
		var itemType = 'checkbox';
		var values = new Array(0);
		values.push('Your Option 1')
		values.push('Your Option 2')
		values.push('Your Option 3')
		commonQuestionTemplate(itemType, values)
		activaTab('tab_2');
	});
	
	$(document).on("click", "button#questionTrueFalse" , function(e) {
		var itemType = 'truefalse';
		var values = new Array(0);
		values.push('True')
		values.push('False')
		commonQuestionTemplate(itemType, values)
		activaTab('tab_2');
		
	});
	
	$(document).on("click", "button#questionTextbox" , function(e) {
		var itemType = 'textbox';
		var values = new Array(0);
		values.push('')
		commonQuestionTemplate(itemType, values)
		activaTab('tab_2');
	});
	
	$(document).on("click", "div.question-box" , function(e) {
		activaTab('tab_2');
		currentItemsn = $(this).closest('li.question').attr('itemsn');
		renderJsonData(jsonData);
	});
	
	$(document).on("click", "button#addNewOption" , function(e) {
		var itemsn = $(this).attr('itemsn');
		addPartOption(itemsn, jsonData)
		
		renderJsonData(jsonData);
	});
	
	$(document).on("click", "button.removePart" , function(e) {
		var partsn = $(this).attr('partsn');
		removePart(currentItemsn, partsn, jsonData);
		renderJsonData(jsonData);
	});
	
	$(document).on("click", "button.action-remove-item" , function(e) {
		
		var itemsn = $(this).closest('li.question').attr('itemsn');
		removeItem(itemsn, jsonData);
		renderJsonData(jsonData);
	});
	
	$(document).on("click", "button.action-edit-item" , function(e) {
		activaTab('tab_2')
	});
	
	$(document).on("click", "button.action-duplicate-item" , function(e) {
		var itemsn = $(this).closest('li.question').attr('itemsn');
		duplicateItem(itemsn, jsonData);
		renderJsonData(jsonData);
	});
	
	
	
	$(document).on("keyup", "div#question-input" , function(e) {

		   var proname = $(this).html();
		   currentItemsn = $(this).closest('.form-group').attr('itemsn');
		   console.log('proname='+proname)
		   updateItem(currentItemsn, proname, jsonData);
		   console.log(JSON.stringify(jsonData))
		   renderForm(jsonData);
		   
	});
	
	$(document).on("keyup", "input.part-input" , function(e) {
		   var proname = $(this).val();
		   currentPartsn = $(this).attr('partsn');
		   currentItemsn = $(this).closest('.form-group').attr('itemsn');
		   console.log('proname='+proname)
		   updatePart(currentItemsn, currentPartsn, proname, jsonData);
		   console.log(JSON.stringify(jsonData))
		   renderForm(jsonData);
	});
	
	$(document).on("click", "button.action-wysiwyg" , function(e) {
		$('#myModal').modal()
	
	});
	
	    
});

function commonQuestionTemplate(itemType, values){
	var question = 'Question here?';
	var item = createItem(question, itemType);
	item.parts = new Array(0);
	
	for (var i = 0; i < values.length; i++) {
		var part = createPartOptionMultiple(values[i]);
		item.parts.push(part);
	}

	currentItemsn = item.itemsn;
	jsonData.pages[0].items.push(item);
	
	console.log(JSON.stringify(jsonData))
	
	renderJsonData(jsonData);
}

function reorderParts(newParts, itemsnThis, data){
	var items = data.pages[0].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			item.parts = newParts.slice();
			break;
		}
	}
}

function reorderItems(newItems, data){
	data.pages[0].items = newItems.slice();
}

function addPartOption(itemsnThis, data){
	var items = data.pages[0].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			var parts = item.parts;
			parts.push(createPartOptionMultiple('your new option'));
		}
	}
}

function removePart(itemsnThis, partsnThis, data){
	var items = data.pages[0].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			var parts = item.parts;
			if (parts.length <= 1){
				break;
			}
			for (var j = 0; j < parts.length; j++) {
				var part = parts[j];
				var partsn = part.partsn;
				if (partsnThis == partsn){
					parts.splice(j, 1);
					break;
				}
			}
		}
	}
}

function duplicateItem(itemsnThis, data){
	var items = data.pages[0].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			var newItem = createItem(item.question, item.type);
			newItem.parts = new Array(0);
			var parts = item.parts;
			for (var j = 0; j < parts.length; j++) {
				var part = parts[j];
				newItem.parts.push(part);
			}
			data.pages[0].items.splice(i, 0, newItem);
			break;
		}
	}
}

function removeItem(itemsnThis, data){
	var items = data.pages[0].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			data.pages[0].items.splice(i,1);
			console.log('removeItem='+ JSON.stringify(data))
			break;
		}
	}
}

function  updateTitle(proname, data){
	data.setup.title = proname;
}

function updatePart(itemsnThis, partsnThis, valueThis, data){
	var items = data.pages[0].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			var parts = item.parts;
			for (var j = 0; j < parts.length; j++) {
				var part = parts[j];
				var partsn = part.partsn;
				if (partsnThis == partsn){
					part.value = valueThis;
					break;
				}
			}
		}
	}
}

function updateItem(itemsnThis, questionThis, data){
	var items = data.pages[0].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			item.question = questionThis;
			break;
		}
	}
}

function activaTab(tab){
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};

function doSortParts(){
    $("#parts").sortable({
    	handle:'button.movePart',
    	cancel: '',
    	update: function(event, ui) {
    		var newParts = new Array(0);
			var formGroup = $(this).closest('div.form-group');
			var itemsn = formGroup.attr('itemsn');
			console.log('itemsn='+itemsn);
    		$('li.part').each(function(i) { 
    			var partsn = $(this).attr('partsn');
    			var partInput = $(this).find('input.part-input');
    			var value = partInput.val();
        		console.log('partsn='+partsn+', value='+value);
        		
        		var part = new Object();
        		part.partsn = partsn;
        		part.value = value;
        		newParts.push(part);
    		});

    		reorderParts(newParts, itemsn, jsonData);
    		renderJsonData(jsonData);

    	}
    });
}

function doSortItems(){
    $("#questions").sortable({
    	handle:'button.action-move-item',
    	cancel: '',
    	update: function(event, ui) {
    		var newItems = new Array(0);
			
    		$('li.question').each(function(i) { 
    			var itemsn = $(this).attr('itemsn');
    			console.log('itemsn='+itemsn);
    			var item = getItemObject(itemsn, jsonData);//new Object();
    			/*item.itemsn = itemsn;
    			item.type = getItemType(itemsn);
    			item.question = getItemQuestion(itemsn);*/
    			newItems.push(item);
    			/*var partsn = $(this).attr('partsn');
    			var partInput = $(this).find('input.part-input');
    			var value = partInput.val();
        		console.log('partsn='+partsn+', value='+value);
        		
        		var part = new Object();
        		part.partsn = partsn;
        		part.value = value;
        		newParts.push(part);*/
    		});
    		reorderItems(newItems, jsonData);
    		renderJsonData(jsonData);

    	}
    });
}

function getItemObject(itemsnThis, data){
	var items = data.pages[0].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsn == itemsnThis){
			return item;
		}
	}
	return null;}

function renderJsonData(data){
	
	renderQuestionSetting(data);
	renderQuizSetting(data);
	renderForm(data);

	doSortParts();
	doSortItems();
}

function renderQuizSetting(data){
	var title = data.setup.title;
	$('textarea#title-input').val(title);
}

function renderQuestionSetting(data){
	$('#tab_2').children().remove();
	var items = data.pages[0].items;
	for (var i = 0; items!=null && i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;

		if (itemsn == currentItemsn){
			var msg = '';
			msg += new EJS({url: basePath+'template/question_setting.ejs'}).render(item);
			$('#tab_2').append(msg);
			break;
		}
	}
	
	//var proname;
	//var requestDelay;
	/*var editor_id = 'question-input'; // ID no need #
	if (tinymce.EditorManager.execCommand('mceRemoveEditor',true, editor_id)){
		//tinymce.EditorManager.execCommand('mceAddEditor',true, editor_id);
		tinymce.init({
	        selector: "#question-input",
	        toolbar:false,
	        menubar : false,
	        statusbar : false,
	        setup: function(ed) {
	            ed.on('keyup', function(e) {

		      		   proname = ed.getContent()
		      		   console.log('proname='+proname)
	      			   updateItem(currentItemsn, proname, data);
	      			   console.log(JSON.stringify(data))
	      			   renderJsonData(data);
	      			   
	      			   tinymce.execCommand('mceFocus',false,editor_id);
	      			   
	            });
	        }
	    });
		
	}*/
	
}

function renderForm(data){
	$('#questions').children().remove();
	var title = data.setup.title;
	$('#title').text(title);
	var items = data.pages[0].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		console.log(JSON.stringify(item));
		
		var msg = '';
		if (item.type == 'radio') {
			msg += new EJS({url: basePath+'template/question_multiple.ejs'}).render(item);
		} else if (item.type == 'checkbox'){
			msg += new EJS({url: basePath+'template/question_checkbox.ejs'}).render(item);
		} else if (item.type == 'truefalse'){
			msg += new EJS({url: basePath+'template/question_truefalse.ejs'}).render(item);
		} else if (item.type == 'textbox'){
			msg += new EJS({url: basePath+'template/question_textbox.ejs'}).render(item);
		}
		
		$('#questions').append(msg);
	}
}

function createJsonData(){
	var data = new Object();
	data.formid = uuid();
	//data.title = dict['formTitle'];
	//data.desc = dict['formDesc'];
	
	var setup = new Object();
	setup.title = 'YOUR TITLE';
	setup.status = 1;
	setup.filterTraffic = 2;
	setup.jumpTo = 1;
	setup.jumpToYourMainpage = 'http://';
	data.setup = setup;
	
	data.pages = new Array(1);
	var page = new Object();
	page.pagesn = uuid();
	data.pages[0] = page;
	data.pages[0].items = new Array(0);
	return data;
}

function createItem(question, type){
	var item = new Object();
	item.itemsn = uuid();
	item.type = type;
	item.question = question;
	
	return item;
}

function createPartOptionMultiple(value){
	var part = new Object();
	part.partsn = uuid();
	part.value = value;
	
	return part;
}

function setCursorToEnd(ele)
{
  var range = document.createRange();
  var sel = window.getSelection();
  range.setStart(ele, 1);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  ele.focus();
}

var uuid = (function () {
    var a = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    return function (b, f) {
        var h = a,
            e = [],
            d = Math.random;
        f = f || h.length;
        if (b) {
            for (var c = 0; c < b; c++) {
                e[c] = h[0 | d() * f];
            }
        } else {
            var g;
            e[8] = e[13] = e[18] = e[23] = "-";
            e[14] = "4";
            for (var c = 0; c < 36; c++) {
                if (!e[c]) {
                    g = 0 | d() * 16;
                    e[c] = h[(c == 19) ? (g & 3) | 8 : g & 15];
                }
            }
        }
        return e.join("").toLowerCase();
    }
})();