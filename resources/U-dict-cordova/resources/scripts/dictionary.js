/// dictionary.js
/// 2013-10-11		Laura Gabler		Created
///
/// This is the main code base for the dictionary app. Variables that need to be changed for different languages
/// are in lang.js
/// There is a local web converter to create the javascript file data.js from the SIL Philippines XML format.
/// There are a set of XSLTs to create the the javascript file data.js from the main.xhtml exported from FLEX via Pathway. See 


//Enumerations

//Viewing modes:
//browse: reached by the browse letter menu
//search: reached through English or language search
//singleWord: reached by clicking a link from another word
var MODE = { browse: 0, search: 1, singleWord: 2 };

//Language options:
//The search modes used. Either language of the dictionary (search on start of word) or English (search definitions).
var LANGUAGE_OPT = { Language: 0, English: 1 };

//For creating html nodes with JQuery
var Span = '<span></span>';
var Div = '<div></div>';
var Link = '<a></a>';
var List = '<ul></ul>';

var BtnSelectedClasses = 'ui-btn-active ui-state-persist';	/* CSS classes that make a button look selected */
var RegexEng = '([(-]*\\b{0}(ies|es|ed|s|er|or|ing|\'s)?\\b[)-]*)';	/* Format string for creating Regex for English searches */
var RegexLang = '(^{0})';	/* Format string for creating Regex for Language searches */
var HighlightSpan = '<span class="highlight">$1</span>'; /* Regex string for inserting highlight span in html output */

//Data
var Data;	/* Dictionary data array */
var SearchResults;	/* Stores search results */
var MoreResults;	/* Stores the search results that have not yet been displayed */
var Letters;	/* List of initial letters */




///INITIATE AND LOAD DATA


//Runs when page document is ready
//Loads data and opens browse page.
$(document).ready(load);


function load() {
	//Show wait gif while page loads
	$.mobile.showPageLoadingMsg("a", "Please wait a moment", false);

	try {
		//Add the language in placeholders on page
		$('.language').each(function () {
			$(this).html(Language);
		});

		//Get the data
		Data = getData();
		//Load letters into browse page
		loadLetters();
		//Show the browse page
		showBrowse();


		//Add handling for swiping during display (scrolls through current list)
		$(function () {
			// Bind the swipeleftHandler callback function to the swipe event on div.box
			$('#divWordContent').on('swiperight', swipeRightHandler);
			$('#divWordContent').on('swipeleft', swipeLeftHandler);

			function swipeRightHandler(event) {
				$('#btnPrev').click();
			}

			function swipeLeftHandler(event) {
				$('#btnNext').click();
			}
		});
	} catch (ex) {
		//Closing loading Gif
		$.mobile.hidePageLoadingMsg();
		console.log(ex);
	}


	$(document).delegate('#pgSearch', 'pageshow', function () {
		//Add listener to keyup event
		$('#search-mini').keyup(function (event) {
			//Ignore enter, down and up as they are dealt with globally in the keydown function
			//All the rest, search
			switch (event.keyCode) {
				case 13:
				case 40:
				case 38:
					break;
				default:
					//Default (ie not enter or up down arrow)
					//Search words matching search entry
					search();
					break;
			}
		});

		//Add listener to clear button
		$('.ui-input-clear').live('tap', function () {
			//Search words matching search entry
			search();
		});
	});
}


//Keydown handler
//Handles all key presses
$(document).keydown(function (e) {
	var returnVal = false;

	//Handle per active page
	switch ($.mobile.activePage.attr("id")) {
		case 'pgDisplayWord':
			//If displaying a word, left and right arrows trigger previous and next buttons
			switch (e.keyCode) {
				case 37:
					//Left
					$('#btnPrev').click();
					break;
				case 39:
					//Right
					$('#btnNext').click();
					break;
			}
			break;
		case 'pgBrowse':
			//Handle up, down and enter
			returnVal = ListItemSelection(e, 'lsBrowse');
			break;
		case 'pgSearch':
			//Handle up, down and enter
			returnVal = ListItemSelection(e, 'lsWords');
			break;
	}
	return returnVal;
});


//function: ListItemSelection(event e, string listId)
//Handles list item selection using the down, up and enter keys for the list with the given listId
function ListItemSelection(e, listId) {
	var returnVal = true;

	switch (e.keyCode) {
		case 13:
			//Enter
			var listItems = $('#' + listId).children('li');
			var focusItems = listItems.filter('.ui-focus');

			//If there is an item selected
			if (focusItems.length > 0) {
				//click on the link inside it
				focusItems.first().find('a').click();
			} else {
				//if no items selected, select first item in list
				changeListItemFocus(listItems.first());
			}
			returnVal = false;
			break;
		case 40:
			//Down
			var listItems = $('#' + listId).children('li');
			var focusItems = listItems.filter('.ui-focus');

			//If item selected
			if (focusItems.length > 0) {
				//select the next item
				changeListItemFocus(focusItems.first().next());
			} else {
				//If no item selected, select first item
				changeListItemFocus(listItems.first());
			}
			returnVal = false;
			break;
		case 38:
			//Up
			var listItems = $('#' + listId).children('li');
			var focusItems = listItems.filter('.ui-focus');

			//If there is an item in focus
			if (focusItems.length > 0) {
				//select the previous item
				changeListItemFocus(focusItems.first().prev());
			}
			returnVal = false;
			break;
	}
	return returnVal;
}


//function: changeListItemFocus(HTMLNode[] itemList)
//Sets the focus (highlight using ui-focus class) of a list item
function changeListItemFocus(itemList) {
	//If there is an item to focus on
	if (itemList.length > 0) {
		//Focus on item and scroll to it (presumably there is one item to focus on)
		$('.ui-focus').removeClass('ui-focus');
		itemList.addClass('ui-focus');
		scrollToSelectedItem();
	}
}

//function: scrollToSelectedItem()
//Scrolls to the selected list item (with ui-focus class)
function scrollToSelectedItem() {
	var selectedItem = $('li.ui-focus');

	//If there is an item selected (with ui-focus class)
	if (selectedItem.length > 0 && selectedItem.offset()) {
		//Scroll to the item
		$('html, body').animate({ scrollTop: selectedItem.offset().top - 100 }, 200);
	}
}



//function: loadLetters()
//Loads the list of letters from the data.js file and populates the browse list
function loadLetters() {
	//Detach browse list
	var lsBrowse = $('#lsBrowse').detach();
	//Retrieve letter list
	Letters = getLetters();

	//Stop loading message and unhid the body (must be done before adding list items for formatting to work)
	$.mobile.hidePageLoadingMsg();
	$('body').attr('style', '');

	//Add each of the lestters to the list
	$(Letters).each(function () {
		$(lsBrowse).append('<li><a onclick="selectByIndex(' + this.index + ', ' + MODE.browse + ')">' + this.letter + '<span class="count">' + this.count + '</span></a></li>');
	});

	//Add browse list back to the page and refresh
	$('#divBrowse').append(lsBrowse);
	$(lsBrowse).listview("refresh");
}



///HISTORY

//function: window.onpopstate(Event event)
//Displays word from previous state.
window.onpopstate = function (event) {
	//If there is a state
	if (event.state) {
		if (typeof event.state == 'object') {
			selectByIndex(event.state.index, event.state.mode, true);
		}
	}
};


//function: searchBack()
//Go back to previous "page"
function searchBack() {
	back();
}

//function: wordBack()
//Go back to previous "page" and remove the highlight on the button
function wordBack() {
	back();
}


//function: back()
//Handles when back button is hit. Goes back to last history state.
function back() {
	history.go(-1);
}




///CHANGE PAGE

//function: showSearch(bool noHistory)
//Go to search page. If noHistory then don't add to history (don't change hash).
function showSearch(noHistory) {
	//Change to search
	var changeHash = (noHistory) ? false : true;
	$.mobile.changePage('#pgSearch', { transition: "none", reverse: true, changeHash: changeHash });

	//Set focus to search box
	$('#search-mini').focus();
}

//function: showBrowse(bool noHistory)
//Prepare and show the browse page. If noHistory then don't add to history (don't change hash).
function showBrowse(noHistory) {
	//Change to browse page
	var changeHash = (noHistory) ? false : true;
	$.mobile.changePage('#pgBrowse', { transition: "none", reverse: true, changeHash: changeHash });
	clearMenuSelection();

	//Select browse button to show mode
	$('.browse').addClass(BtnSelectedClasses);
	//Clear the heading
	$('.dispHeading').html('');
}



///SEARCH


//function: changeSearchType(HtmlNode searchTypeBtn)
//Change the selected search type button. Only research if the selection if different from the current
//AND they are already on the search page (to minimize re-searching unecessarily).
function changeSearchType(language, noHistory) {
	//Check if we are currently on the search page
	var currentPageSearch = ($.mobile.activePage.attr("id") == 'pgSearch');

	//Show the search page
	showSearch();

	//Clear menu selection buttons
	clearMenuSelection();

	//Add active class to selected button
	if (language == LANGUAGE_OPT.English) {
		$('.languageOptEnglish').addClass(BtnSelectedClasses);
	} else {
		$('.languageOptLanguage').addClass(BtnSelectedClasses);
	}

	//If already on search page and the language selection has changed
	if (currentPageSearch && SearchResults && SearchResults.search_type != language) {
		//Re-run the search (may have accidentally started typing in the wrong search type)
		search();
	} else if (SearchResults && SearchResults.search_type != language) {
		//If the search type has changed (and not already on search page)
		//Clear search box and run search (to clear list)
		$("#search-mini").val('');
		search();
	} else {
		//If not changing language type selection, scroll to any selected items
		//Eg. if we are switching back from viewing a word from a search, we want that word to still be selected
		//Note: without the delay, it goes back to the top. Not sure if there is a better way to fix this.
		setTimeout(function () { scrollToSelectedItem(); }, 300);
	}
}



//function: search()
//Search data array for words based on search box input and language selected (language will search on words OR English search on English definition)
function search() {
	//Get search input
	var searchInput = $.trim($("#search-mini").val());

	//Detach the word list and clear
	var lsWords = $('#lsWords').detach();
	$(lsWords).html('');

	//Clear more results list
	MoreResults = null;

	//If search isn't blank
	if (searchInput != "") {
		//Search according to search type (selected English or language button)
		var english = $('#langEnglish').hasClass('ui-btn-active');
		if (english) {
			SearchResults = englishSearch(searchInput);
		} else {
			SearchResults = languageSearch(searchInput);
		}

		//Set the search input on the results (for future highlighting)
		SearchResults.searchInput = searchInput;

		//Set the indexes for each word search results
		$(SearchResults).each(function (i) {
			this.originalIndex = this.index;
			this.index = i;
		});

		//Display the search results
		displaySearchResults(SearchResults, lsWords);
	}

	//Add html list back to page
	$('#divSearchContent').append(lsWords);

	//Refresh the search result list
	$(lsWords).listview("refresh");
}


//function: loadMore()
//Loads more of the words which matched the search
function loadMore() {
	//If there are more results to load
	if (MoreResults) {
		var lsWords = $('#lsWords');

		//Create a temporary list
		var temp = $(List);
		
		//Remove the last item in html list ('...')
		$('li', lsWords).last().detach();
		var lastItem = $('li', lsWords).last();

		//Add the additional results
		displaySearchResults(MoreResults, temp);
		lsWords.append(temp.html());

		//Refresh the search result list
		$(lsWords).listview("refresh");
		changeListItemFocus(lastItem.next());
	}
}


//function: languageSearch(string searchInput)
//Find words with input string at beginning of word
function languageSearch(searchInput) {
	//Create a regualar expression to test the words
	var regx = new RegExp(String.format(RegexLang, regexNonEngCharOpt(escapeRegex(searchInput))), 'i');

	//Filter list to one which the "word" attribute begins with the search input
	var searchResults = $.extend(true, [], $.grep(Data, function (obj) { return regx.test(obj.word); }));

	//For each word object, highlight the search input in the wordd for display
	$(searchResults).each(function () {
		this.displayWord = this.word.replace(regx, HighlightSpan);
	});

	//Set the search type language
	searchResults.search_type = LANGUAGE_OPT.Language;

	return searchResults;
}


//function: englishSearch(string searchInput)
//Filters words down to ones which definitions contain the search input string
function englishSearch(searchInput) {
	var searchResults = [];

	//Create regular expression fo match words in definitions to search input
	var regx = new RegExp(String.format(RegexEng, escapeRegex(searchInput)), 'i');

	//For each word in Data array
	for (var i = 0; i < Data.length; i++) {
		var wordObj = Data[i];

		//Test each definitions of the word to determine whether it contains the search term
		for (var j = 0; j < wordObj.definitions.length; j++) {
			var def = wordObj.definitions[j];
			if (regx.test(def)) {
				//If it is a match, make a copy of the object with just that definition
				var obj = $.extend(true, {}, wordObj);
				obj.definitions = [];
				var def2 = def.replace(regx, HighlightSpan);
				obj.definitions.push(def2);
				obj.displayWord = obj.word;
				obj.sense = j + 1;

				//Add word to results
				searchResults.push(obj);
			}
		}
	}
	searchResults.search_type = LANGUAGE_OPT.English;
	return searchResults;
}

//function: displaySearchResults(SQLTransaction tx, SQLResultSet rs)
//Display top 30 results of search (from result set)
//Callback function for dictionary.webdb.matchWords
function displaySearchResults(arr, lsWords) {
	if (arr) {
		//Append result items up to a maximum of 30
		var max = 30;
		var lots = (max < arr.length);
		max = (lots) ? max : arr.length;

		for (var i = 0; i < max; i++) {
			var wordObj = arr[i];

			$(lsWords).append(renderListItem(wordObj));
		}
		//If there were more than 30 items, append '..." so you know there are more results
		if (lots) {
			MoreResults = arr.slice(max);
			$(lsWords).append($("<li></li>").append($(Link).attr('onclick', 'loadMore()').append('...')));
		}
	} else if (rs.message) {
		console.log(rs.message);
	}
}


//function: getHtmlHighlights(HTMLNode node, RegExp regx)
//Gets the html of the node with highlights from the regex
function getHtmlHighlights(node, regx) {
	var resultSpan = $(Span);
	for (var i = 0; i < node.childNodes.length; i++) {
		var child = node.childNodes[i];
		//If the child is text
		if (child.nodeType == 3) {
			//Highlight matches to regex and add to result span
			var temp = '<span>' + child.textContent.replace(regx, HighlightSpan) + '</span>';
			$(resultSpan).append($(temp));
		} else {
			//If not text node, copy node (with attributes, without children)
			//Note: tried to use some other clonging methods but had a lot of trouble with them
			var childCopy = $('<' + child.tagName + '></' + child.tagName + '>');
			for (var j = 0; j < child.attributes.length; j++) {
				var att = child.attributes[j];
				childCopy.attr(att.nodeName, att.nodeValue);
			}

			//Add the highlighted HTML of the children (recursive call) to the child node and add child node to result span
			$(resultSpan).append(childCopy.html(getHtmlHighlights(child, regx)));
		}
	}
	//Get the html from the result span
	return resultSpan.html().trim();
}


//function: regexNonEngCharOpt(string text)
//Insert regex in (search) text to allow english characters to cover similar non-english characters.
//eg. "a" might cover "a", "ā" and "â"
//This ALT_CHARS list can be modified in lang.js
function regexNonEngCharOpt(text) {
	//For each of the alternating chars, replace with appropriate regex
	$(ALT_CHARS).each(function () {
		text = text.replace(this.letterRegex, this.replaceRegex);
	});
	return text;
}



//function: renderListItem(Obj wordObj)
//Return list item for word from word object
function renderListItem(wordObj) {
	var word = wordObj.displayWord;
	if (wordObj.rootWord) {
		word = word + '(' + wordObj.rootWord + ')';
	}
	return '<li><a onclick="selectByIndex(' + wordObj.index + ', ' + MODE.search + ')"><span class="dropdownWord">' + getWordHtml(word) + '</span><span class="dropdownDefinition">: ' + wordObj.definitions.join('; ') + '</span></a></li>';
}



///DISPLAY WORD

//function: selectWord(Obj word, Boolean noHistory)
//Select word from dictionary and display. Add history entry if not "back". Change page to display page.
function selectWord(word, noHistory) {
	setupDisplayWordPage(word);
	viewWord(word, noHistory);
}


//function: getList(MODE mode)
//Gets the list of words based on the current mode. If in search mode, the search results are returned,
//Otherwise (browse), return the entire data list.
function getList(mode) {
	return ((mode == MODE.search) ? SearchResults : Data);
}


//function: selectByIndex(Int i, MODE mode, Bool noHistory)
//Select and view a word based on the index in the list.
function selectByIndex(i, mode, noHistory) {
	//Select the item that was clicked on in the list so it will be highlighted upon return
	$('.ui-focus').removeClass('ui-focus');
	$('#lsWords li:nth-child(' + (i + 1) + ')').addClass('ui-focus');

	var ls = getList(mode); /* Get the word list based on the current mode */
	var wordObj = ls[i]; /* Select the word object */
	wordObj.mode = mode; /* Set the current mode on the word selected */

	highlightSearchTerms(wordObj, ls); /* Highlight any search terms */
	setHeader(wordObj, ls); /* Set the header on the word display page (word and count) */
	selectWord(wordObj, noHistory); /* Display the word */
}


//function: setHeader(Obj wordObj, [] ls)
//Sets the header (word and count) dependant on the search type
function setHeader(wordObj, ls) {
	$('#headingTtl').html(getWordHtml(wordObj.word)); /* Put the word in the heading */

	if (wordObj.mode == MODE.search) {
		//If the mode is search: set the count out of the number of words returned in the search
		$('#headingI').html('"' + SearchResults.searchInput +'" ' + (wordObj.index + 1));
		$('#headingCount').html('/' + ls.length);
	} else if (wordObj.mode == MODE.browse) {
		//If the mode is browse: set the count out of the count of the current letter
		var letter = Letters[wordObj.letterIndex];
		$('#headingI').html('"' + letter.letter + '" ' + ((wordObj.index - letter.index) + 1));
		$('#headingCount').html('/' + letter.count);
	} else {
		//Else, clear
		$('#headingI').html('');
		$('#headingCount').html('');
	}
}


//function: highlightSearchTerms(Obj wordObj, [] ls)
//If in search mode, highlights the search input
//For language searches, this will be in the 
function highlightSearchTerms(wordObj, ls) {
	//If the word was selected through search mode
	if (wordObj.mode == MODE.search) {
		//If the search type is English
		if (ls.search_type == LANGUAGE_OPT.English) {
			//Create RegExp to find the search input
			var regx = new RegExp(String.format(RegexEng, escapeRegex(ls.searchInput)), 'i');

			//Find each definition, wrap search input in span with "highlight" class
			var xml = wordObj.html,
				xmlDoc = $.parseXML(xml),
				$xml = $(xmlDoc),
				$word = $xml.find('#word');
			$word.each(function () {
				$(this).parent().parent().find('.definition').each(function () {
					var inner = getHtmlHighlights(this, regx);
					$(this).text('');
					$(this).append($(inner));
				});
			});
			//Set the xml back to the object and add object to array
			wordObj.html = serializeXmlNode(xmlDoc);
		} else {
			//Else (if language search): 
			//Create RegExp to find the search input
			var regx = new RegExp(String.format(RegexLang, regexNonEngCharOpt(escapeRegex(ls.searchInput))), 'i');

			//Find word, wrap search input in span with "highlight" class
			var xml = wordObj.html,
			xmlDoc = $.parseXML(xml),
			$xml = $(xmlDoc),
			$word = $xml.find('#word');
			$word.each(function () {
				var inner = getHtmlHighlights(this, regx);
				$(this).text('');
				$(this).append($(inner));
			});
			//Set the xml back to the object and add object to array
			wordObj.html = serializeXmlNode(xmlDoc);
		}
	}
}



//function: setupDisplayWordPage(Obj wordObj)
//Sets actions and enable or disable previous and next buttons
//Make appropriate buttons glow depending on mode
//Add appropriate header icon based on mode
//Add word html content and copyright info
function setupDisplayWordPage(wordObj) {
	$('#divWordContent').html(''); /* Clear content on display page */

	var btnPrev = $('#btnPrev');
	var btnNext = $('#btnNext');

	//Previous buttons

	//If not single word mode (ie. search or browse) and the index of the word is greater than zero
	if (wordObj.mode != MODE.singleWord && wordObj.index > 0) {
		//Enable previous button and set index selection for click action
		$(btnPrev).removeClass("ui-disabled");
		$(btnPrev).attr('onclick', 'selectByIndex(' + (wordObj.index - 1) + ', ' + wordObj.mode + ')');
	} else {
		//If single word mode (ie. a word reached by a link) OR index of word is zero
		//Disable previous button
		$(btnPrev).addClass("ui-disabled");
	}


	//Next Button

	//Get length of list
	var length = (getList(wordObj.mode)).length;

	//If not single word mode (ie. search or browse) and index less than the highest index
	if (wordObj.mode != MODE.singleWord && wordObj.index < length - 1) {
		//Enable next button and set index selection for click action
		$(btnNext).removeClass("ui-disabled");
		$(btnNext).attr('onclick', 'selectByIndex(' + (wordObj.index + 1) + ', ' + wordObj.mode + ')');
	} else {
		//If single word mode (ie. a word reached by a link) OR index is for last list item
		//Disable next button
		$(btnNext).addClass("ui-disabled");
	}


	//Glowing Buttons

	if (wordObj.mode == MODE.singleWord) {
		//If single word mode: make back button glow
		$('#btnBack').addClass('glow');
	} else if (wordObj.mode == MODE.search) {
		//If search mode: remove glow from back button
		$('#btnBack').removeClass('glow');

		//If English search
		if (SearchResults.search_type == LANGUAGE_OPT.English) {
			//Make Eng search button glow
			$('#showEngSearchDisp').addClass('glow');
			$('#showLangSearchDisp').removeClass('glow');
		} else {
			//If language search, make lang search button glow
			$('#showLangSearchDisp').addClass('glow');
			$('#showEngSearchDisp').removeClass('glow');
		}
	} else {
		//Else (browse button): remove glow from back button
		$('.glow').removeClass('glow');
	}


	//Add appropriate header icon based on mode
	if (wordObj.mode == MODE.search) {
		$('#icMode').find('.ui-icon').addClass('ui-icon-search').removeClass('ui-icon-grid');
	} else if (wordObj.mode == MODE.browse) {
		$('#icMode').find('.ui-icon').addClass('ui-icon-grid').removeClass('ui-icon-search');
	}

	//Add copyright info
	$('#divWordContent').append(wordObj.html).append($(Div).addClass('copyright').html(CopyrightInfo));
}


//function: viewWord(Obj wordObj, Bool noHistory)
//Adds the word to the history unless history not required
//Change to display page and scroll to word (may be a variation)
function viewWord(wordObj, noHistory) {
	//If push state is required - add into history
	//This will not be the case if it is a "back" action
	if (!noHistory) {
		window.history.pushState(wordObj, wordObj.word, '#' + wordObj.word);
	}

	//If the active page is not the display page, change to display page
	if ($.mobile.activePage.attr('id') != 'pgDisplayWord') {
		$.mobile.changePage('#pgDisplayWord', { transition: "none", changeHash: false });
	}

	//Scroll to current word (may be a derivitave and not at top)
	if (!wordObj.sense || wordObj.sense == 1) {
		$('html, body').animate({ scrollTop: $('#word').offset().top - 100 }, 500);
	} else if ($('#sense' + wordObj.sense).length > 0) {
		$('html, body').animate({ scrollTop: $('#sense' + wordObj.sense).offset().top - 100 }, 500);
	}
}


//function: getWordHtml(string word)
//Makes digits at end of word subscript
function getWordHtml(word) {
	var rgx = new RegExp('(\\w+)\\s?(\\d+)');
	return word.replace(rgx, '$1<sub>$2</sub>');
}


//function: clearMenuSelection()
//Removes the css selected classes from all menu selection buttons
function clearMenuSelection() {
	//Remove active class from buttons
	$('.menuSelection').removeClass(BtnSelectedClasses);
}




///MISC

//function: escapeRegex(string text)
//Escape the input for using in a regex test
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


//function: serializeXmlNode(XmlNode xmlNode)
//Serializes XML node to string
function serializeXmlNode(xmlNode) {
	if (typeof window.XMLSerializer != "undefined") {
		return (new window.XMLSerializer()).serializeToString(xmlNode);
	} else if (typeof xmlNode.xml != "undefined") {
		return xmlNode.xml;
	}
	return "";
}



//function: $.fn.outerHTML
//Get the xml of the whole node ie. inner xml plus the surrounding tags
$.fn.outerHTML = function () {
	// IE, Chrome & Safari will comply with the non-standard outerHTML, all others (FF) will have a fall-back for cloning
	return (!this.length) ? this : (this[0].outerHTML || (
		function (el) {
			var div = document.createElement('div');
			div.appendChild(el.cloneNode(true));
			var contents = div.innerHTML;
			div = null;
			return contents;
		})(this[0]));
}


//function: String.format()
//Format the string using .Net type formatting. ie. '{0}' in the string indicate a place to be replaced by argument item.
//https://gist.github.com/bux578/4386965/raw/8e880912ee664cacc27be042f5bdc2c57f33ea6d/string.format.js
String.format = function () {
	// The string containing the format items (e.g. "{0}")
	// will and always has to be the first argument.
	var theString = arguments[0];

	// start with the second argument (i = 1)
	for (var i = 1; i < arguments.length; i++) {
		// "gm" = RegEx options for Global search (more than one instance)
		// and for Multiline search
		var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
		theString = theString.replace(regEx, arguments[i]);
	}

	return theString;
}

