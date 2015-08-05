var basePath='/quiz/';
var jsonData;
var currentItemsn;
var currentPartsn;
var currentPageIndex = 0;

$(document).ready(function(){
	
	jsonData = initJsonData();
	
	renderJsonData(jsonData, currentPageIndex);
	
	$(document).on("keyup", "textarea#title-input" , function(e) {
		   proname = $(this).val();
		   console.log('proname='+proname)
		   updateTitle(proname, jsonData);
		   renderJsonData(jsonData, currentPageIndex);
	});
	$(document).on("change", "input#randomized-question-input" , function(e) {
		if(this.checked) {
			jsonData.setup.randomizedQuestion = true;
		} else {
			jsonData.setup.randomizedQuestion = false;
		}
		console.log(JSON.stringify(jsonData))
		
	});
	$(document).on("click", "input#randomized-answer-input" , function(e) {
		if(this.checked) {
			jsonData.setup.randomizedAnswer = true;
		} else {
			jsonData.setup.randomizedAnswer = false;
		}
		console.log(JSON.stringify(jsonData))
	});
	$(document).on("click", "input#show-answer-input" , function(e) {
		if(this.checked) {
			jsonData.setup.showAnswer = true;
		} else {
			jsonData.setup.showAnswer = false;
		}
		console.log(JSON.stringify(jsonData))
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
	
	$(document).on("mouseover", "div.question-box" , function(e) {
		$(this).addClass('border-dashed')
	});
	
	$(document).on("mouseout", "div.question-box" , function(e) {
		$(this).removeClass('border-dashed')
	});
	
	$(document).on("click", "button#newPage" , function(e) {
		var page = createNewPage(jsonData);
		currentPageIndex = jsonData.pages.length - 1;
		renderJsonData(jsonData, currentPageIndex)
		activaTab('tab_1');
	});
	
	$(document).on("click", "span.page" , function(e) {
		currentPageIndex = parseInt($(this).attr('pageindex'));
		renderJsonData(jsonData, currentPageIndex)
		activaTab('tab_1');
	});
	
	$(document).on("click", "button#questionMultiple" , function(e) {
		var itemType = 'radio';
		var values = new Array(0);
		values.push('Your Option 1')
		values.push('Your Option 2')
		values.push('Your Option 3')
		commonQuestionTemplate(itemType, values, currentPageIndex)
	});
	
	$(document).on("click", "button#questionCheckbox" , function(e) {
		var itemType = 'checkbox';
		var values = new Array(0);
		values.push('Your Option 1')
		values.push('Your Option 2')
		values.push('Your Option 3')
		commonQuestionTemplate(itemType, values, currentPageIndex)
	});
	
	$(document).on("click", "button#questionTrueFalse" , function(e) {
		var itemType = 'truefalse';
		var values = new Array(0);
		values.push('True')
		values.push('False')
		commonQuestionTemplate(itemType, values, currentPageIndex)
		
	});
	
	$(document).on("click", "button#questionTextbox" , function(e) {
		var itemType = 'textbox';
		var values = new Array(0);
		values.push('')
		commonQuestionTemplate(itemType, values, currentPageIndex)
		
	});
	
	$(document).on("click", "button#questionEssay" , function(e) {
		var itemType = 'textarea';
		var values = new Array(0);
		values.push('')
		commonQuestionTemplate(itemType, values, currentPageIndex)
	});
	
	$(document).on("click", "button#questionImageOnly" , function(e) {
		var itemType = 'imageOnly';
		var values = new Array(0);
		commonQuestionTemplate(itemType, values, currentPageIndex)
	});
	
	$(document).on("click", "button#questionTextOnly" , function(e) {
		var itemType = 'textOnly';
		var values = new Array(0);
		values.push('Some text here')
		commonQuestionTemplate(itemType, values, currentPageIndex)
	});
	
	$(document).on("click", "div.question-box" , function(e) {
		activaTab('tab_2');
		currentItemsn = $(this).closest('li.question').attr('itemsn');
		renderJsonData(jsonData, currentPageIndex);
		$('div.question-box').each(function (e){
			$(this).removeClass('bg-maroon'); 
		});
		$(this).addClass('bg-maroon');
	});
	
	$(document).on("click", "button#addNewOption" , function(e) {
		var itemsn = $(this).attr('itemsn');
		addPartOption(itemsn, jsonData, currentPageIndex)
		
		renderJsonData(jsonData, currentPageIndex);
	});
	
	$(document).on("click", "button.remove-part" , function(e) {
		var partsn = $(this).attr('partsn');
		removePart(currentItemsn, partsn, jsonData, currentPageIndex);
		renderJsonData(jsonData, currentPageIndex);
	});
	
	$(document).on("click", "button.action-remove-item" , function(e) {
		
		var itemsn = $(this).attr('itemsn');
		removeItem(itemsn, jsonData, currentPageIndex);
		renderJsonData(jsonData, currentPageIndex);
		activaTab('tab_1');
	});
	
	$(document).on("click", "button.action-remove-page" , function(e) {
		var pageindex = $(this).attr('pageindex');
		if (jsonData.pages.length <= 1) {
			currentPageIndex = 0;
			alert('The quiz MUST at least one page.');
		} else {
			removePage(pageindex, jsonData);
			currentPageIndex = (pageindex==0)?0:pageindex - 1; 
		}
		renderJsonData(jsonData, currentPageIndex);
		activaTab('tab_1');
	});
	
	$(document).on("click", "button.action-edit-item" , function(e) {
		activaTab('tab_2')
		renderJsonData(jsonData, currentPageIndex);
		$(this).parent('div.question-editbar').prev().addClass('bg-maroon')
	});
	
	$(document).on("click", "button.action-duplicate-item" , function(e) {
		var itemsn = $(this).closest('li.question').attr('itemsn');
		duplicateItem(itemsn, jsonData, currentPageIndex);
		renderJsonData(jsonData, currentPageIndex);
	});
	
	$(document).on("keyup", "input.textarea-row" , function(e) {
		var itemsn = $(this).closest('div.form-group').attr('itemsn');
		var row = $(this).val();
		if (row < 100){
			updateItemWithRow(itemsn, row, jsonData, currentPageIndex);
			renderJsonData(jsonData, currentPageIndex);
		} else {
			alert('Number MUST be less then 100.');
			$(this).val('')
		}
		var temp = $('input.textarea-row').val();
		$('input.textarea-row').val(temp).focus();
	});
	
	$(document).on("keyup", "div#question-input" , function(e) {

		   var proname = $(this).html();
		   currentItemsn = $(this).closest('.form-group').attr('itemsn');
		   console.log('proname='+proname)
		   updateItem(currentItemsn, proname, jsonData, currentPageIndex);
		   console.log(JSON.stringify(jsonData))
		   renderForm(jsonData, currentPageIndex);
		   
	});
	
	$(document).on("keyup", "input.part-input, textarea.part-input" , function(e) {
		   var proname = $(this).val();
		   currentPartsn = $(this).attr('partsn');
		   currentItemsn = $(this).closest('.form-group').attr('itemsn');
		   console.log('proname='+proname)
		   updatePart(currentItemsn, currentPartsn, proname, jsonData, currentPageIndex);
		   console.log(JSON.stringify(jsonData))
		   renderForm(jsonData, currentPageIndex);
	});
	
	$(document).on("click", "button.action-wysiwyg" , function(e) {
		$('#myModal').modal()
	
	});
	
	$(document).on("click", "button.upload-part-photo" , function(e) {
	    $(this).next("input.filePartInput").trigger('click');
	});
	   
	$(document).on("change", "input.filePartInput" , function(e) {
		var partsn = $(this).attr('partsn');
		var itemsn = $(this).closest('div.form-group').attr('itemsn');
	    var oFReader = new FileReader();
	    var file = this.files[0];
	    oFReader.readAsDataURL(file);
	    oFReader.onload = function (oFREvent) {
	    	var imgSrc = oFREvent.target.result;
	    	updatePartWithImg(itemsn, partsn, imgSrc, jsonData, currentPageIndex);
	    	renderForm(jsonData, currentPageIndex);
	    };
	    //uploadFile(file)
	});
	
	$(document).on("click", "button.uploadItemPhoto" , function(e) {
	    $(this).next("input.fileItemInput").trigger('click');
	});
	   
	
	$(document).on("change", "input.fileItemInput" , function(e) {
		var itemsn = $(this).attr('itemsn');
	    var oFReader = new FileReader();
	    var file = this.files[0];
	    oFReader.readAsDataURL(file);
	    oFReader.onload = function (oFREvent) {
	    	var imgSrc = oFREvent.target.result;
	    	updateItemWithImg(itemsn, imgSrc, jsonData, currentPageIndex);
	    	renderForm(jsonData, currentPageIndex);
	    };
	});
	$(document).on("click", "button.action-remove-item-img" , function(e) {
		var itemsn = $(this).closest('li.question').attr('itemsn');
		updateItemWithImg(itemsn, '', jsonData, currentPageIndex)
		renderForm(jsonData, currentPageIndex);
	});
	
	$(document).on("click", "button.action-remove-part-img" , function(e) {
		var itemsn = $(this).closest('li.question').attr('itemsn');
		var partsn = $(this).attr('partsn');
		updatePartWithImg(itemsn, partsn, '', jsonData, currentPageIndex)
		renderForm(jsonData, currentPageIndex);
	});
	
	$(document).on("mouseover", "div.thumbnail" , function(e) {
		$(this).find('div').removeClass('hide');
	});
	$(document).on("mouseout", "div.thumbnail" , function(e) {
		$(this).find('div').addClass('hide');
	});
	
	$(document).on("click", "a.action-save" , function(e) {
		var s = syntaxHighlight(JSON.stringify(jsonData, undefined, 4));
		
		$('#modal-result').html('<div class="print-json">'+s+'</div>')
		$('#myModal').modal();
	});
	
	$(document).on("click", "select.optionColumn" , function(e) {
		var col = $(this).val();
		var itemsn = $(this).closest('div.form-group').attr('itemsn');
		updateItemWithCol(itemsn, col, jsonData, currentPageIndex);
		renderForm(jsonData, currentPageIndex);
	});
	
	
});


function commonQuestionTemplate(itemType, values, pageIndex){
	var question = 'Question here?';
	var item = createItem(question, itemType);
	item.parts = new Array(0);
	for (var i = 0; i < values.length; i++) {
		var part = createPartOptionMultiple(values[i]);
		item.parts.push(part);
	}

	currentItemsn = item.itemsn;
	if (jsonData.pages[pageIndex].items == null){
		jsonData.pages[pageIndex].items = new Array(0);
	}
	jsonData.pages[pageIndex].items.push(item);
	
	console.log(JSON.stringify(jsonData))
	
	renderJsonData(jsonData, pageIndex);
	
//	/$("html, body").animate({ scrollTop: $(document).height() }, 1000);
}

function reorderParts(newParts, itemsnThis, data, pageIndex){
	var items = data.pages[pageIndex].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			var parts = item.parts;
			for (var j = 0; j < parts.length; j++) {
				var part = parts[j];
				for (var k = 0; k < newParts.length; k++) {
					if (newParts[k].partsn == part.partsn) {
						newParts[k].img = part.img;
						newParts[k].value = part.value;
					}
				}
			}
			item.parts = newParts.slice();
			break;
		}
	}
}

function reorderItems(newItems, data, pageIndex){
	data.pages[pageIndex].items = newItems.slice();
}

function addPartOption(itemsnThis, data, pageIndex){
	var items = data.pages[pageIndex].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			var parts = item.parts;
			parts.push(createPartOptionMultiple('your new option'));
		}
	}
}

function removePart(itemsnThis, partsnThis, data, pageIndex){
	var items = data.pages[pageIndex].items;
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

function duplicateItem(itemsnThis, data, pageIndex){
	var items = data.pages[pageIndex].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			var newItem = createItem(item.question, item.type);
			newItem.parts = new Array(0);
			var parts = item.parts;
			for (var j = 0; j < parts.length; j++) {
				var part = parts[j];
				var newPart = createPartOptionMultiple(part.value);
				newPart.img = part.img;
				newItem.parts.push(newPart);
			}
			data.pages[pageIndex].items.splice(i, 0, newItem);
			break;
		}
	}
}

function removeItem(itemsnThis, data, pageIndex){
	var items = data.pages[pageIndex].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			data.pages[pageIndex].items.splice(i,1);
			console.log('removeItem='+ JSON.stringify(data))
			break;
		}
	}
}

function removePage(pageindexTHis, data){
	data.pages.splice(pageindexTHis,1);
}

function  updateTitle(proname, data){
	data.setup.title = proname;
}

function updatePart(itemsnThis, partsnThis, valueThis, data, pageIndex){
	var items = data.pages[pageIndex].items;
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

function updatePartWithImg(itemsnThis, partsnThis, imgThis, data, pageIndex){
	var items = data.pages[pageIndex].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			var parts = item.parts;
			for (var j = 0; j < parts.length; j++) {
				var part = parts[j];
				var partsn = part.partsn;
				if (partsnThis == partsn){
					part.img = imgThis;
					break;
				}
			}
		}
	}
}

function updateItem(itemsnThis, questionThis, data, pageIndex){
	var items = data.pages[pageIndex].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			item.question = questionThis;
			break;
		}
	}
}

function updateItemWithImg(itemsnThis, imgThis, data, pageIndex){
	var items = data.pages[pageIndex].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			items[i].img = imgThis;
			break;
		}
	}
}

function updateItemWithRow(itemsnThis, rowThis, data, pageIndex){
	var items = data.pages[pageIndex].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			items[i].row = rowThis;
			break;
		}
	}
}

function updateItemWithCol(itemsnThis, colThis, data, pageIndex){
	var items = data.pages[pageIndex].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsnThis == itemsn){
			item.col = colThis;
			break;
		}
	}
}

function activaTab(tab){
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};

function doSortParts(pageIndex){
    $("#parts").sortable({
    	handle:'button.move-part',
    	cancel: '',
    	update: function(event, ui) {
    		var newParts = new Array(0);
			var formGroup = $(this).closest('div.form-group');
			var itemsn = formGroup.attr('itemsn');
			console.log('itemsn='+itemsn);
    		$('li.part').each(function(i) { 
    			var partsn = $(this).attr('partsn');
        		
        		var part = new Object();
        		part.partsn = partsn;
        		newParts.push(part);
    		});

    		reorderParts(newParts, itemsn, jsonData, pageIndex);
    		renderJsonData(jsonData, pageIndex);

    	}
    });
}

function doSortItems(pageIndex){
    $("#questions").sortable({
    	handle:'button.action-move-item',
    	cancel: '',
    	update: function(event, ui) {
    		var newItems = new Array(0);
			
    		$('li.question').each(function(i) { 
    			var itemsn = $(this).attr('itemsn');
    			console.log('itemsn='+itemsn);
    			var item = getItemObject(itemsn, jsonData);
    			newItems.push(item);
    		});
    		reorderItems(newItems, jsonData);
    		renderJsonData(jsonData, pageIndex);

    	}
    });
}

function getItemObject(itemsnThis, data, pageIndex){
	var items = data.pages[pageIndex].items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemsn = item.itemsn;
		if (itemsn == itemsnThis){
			return item;
		}
	}
	return null;}

function renderJsonData(data, pageIndex){
	
	renderQuestionSetting(data, pageIndex);
	renderQuizSetting(data, pageIndex);
	renderForm(data, pageIndex);
	renderPagination(data, currentPageIndex);
	renderNavQuestion(data.pages[pageIndex])

	doSortParts(pageIndex);
	doSortItems(pageIndex);
	
	$(".nano").nanoScroller();
}

function renderNavQuestion(data){
	var msg = '';
	msg += new EJS({url: basePath+'template/nav_questions.ejs'}).render(data);
	$('#nav-question').html(msg);
}

function renderQuizSetting(data){
	var msg = '';
	msg += new EJS({url: basePath+'template/quiz_setting.ejs'}).render(data);
	$('#tab_3').html(msg);
}

function renderQuestionSetting(data, pageIndex){
	
	$('#tab_2').children().remove();
	var items = data.pages[pageIndex].items;
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

function renderForm(data, pageIndex){
	
	$('#questions').children().remove();
	var title = data.setup.title;
	$('#title').text(title);
	var items = data.pages[pageIndex].items;
	for (var i = 0; items != null && i < items.length; i++) {
		var item = items[i];
		console.log(JSON.stringify(item));
		
		var editbar = new EJS({url: basePath+'template/question-editbar.ejs'}).render(item);
		
		var msg = '';
		if (item.type == 'radio') {
			msg += new EJS({url: basePath+'template/question_multiple.ejs'}).render(item);
		} else if (item.type == 'checkbox'){
			msg += new EJS({url: basePath+'template/question_multiple.ejs'}).render(item);
		} else if (item.type == 'truefalse'){
			msg += new EJS({url: basePath+'template/question_truefalse.ejs'}).render(item);
		} else if (item.type == 'textbox'){
			msg += new EJS({url: basePath+'template/question_textbox.ejs'}).render(item);
		} else if (item.type == 'textarea'){
			msg += new EJS({url: basePath+'template/question_textarea.ejs'}).render(item);
		} else if (item.type == 'imageOnly'){
			msg += new EJS({url: basePath+'template/imageOnly.ejs'}).render(item);
		} else if (item.type == 'textOnly'){
			msg += new EJS({url: basePath+'template/textOnly.ejs'}).render(item);
		} 
		
		
		$('#questions').append(msg);
		$('li[itemsn='+item.itemsn+']').append(editbar)
	}
}

function renderPagination(data, currentPageIndex) {
	
	var obj = new Object();
	obj = data;
	obj.currentPageIndex = currentPageIndex;
	var msg = '';
	msg += new EJS({url: basePath+'template/page.ejs'}).render(obj);
	$('#pages').html(msg);
}

function initJsonData(){
	var data = new Object();
	data.formid = uuid();
	var setup = new Object();
	setup.title = 'YOUR TITLE';
	setup.randomizedQuestion = false;
	setup.randomizedAnswer = false;
	setup.showAnswer = false;
	data.setup = setup;
	
	data.pages = new Array(1);
	var page = new Object();
	page.pagesn = uuid();
	data.pages[0] = page;
	data.pages[0].items = new Array(0);
	return data;
}

function createNewPage(data){
	var page = new Object();
	page.pagesn =  uuid();
	data.pages.push(page);
	
	return page;
}

function createItem(question, type){
	var item = new Object();
	item.itemsn = uuid();
	item.type = type;
	item.question = question;
	item.img = '';
	item.col = 1;
	if (type == 'textarea') {
		item.row = 5;
	}
	
	return item;
}

function createPartOptionMultiple(value){
	var part = new Object();
	part.partsn = uuid();
	part.value = value;
	part.img = '';
	
	return part;
}



function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
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