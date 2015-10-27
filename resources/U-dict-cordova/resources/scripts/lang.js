/// dictionary.js
/// 11/10/2013		Laura Gabler		Created
///
/// These variables may vary for different languages


var CopyrightInfo = '&copy; 2014 SIL Philippines';
var Language = 'Ibatan';

//ALT_CHARS: used so that when searching, English characters will cover similar non-english characters
//as some devices may not have those characters, or they may not be easy to access
var ALT_CHARS = [{ letterRegex: /a/ig, replaceRegex: '[aāâ]' }, { letterRegex: /i/ig, replaceRegex: '(i|ī|í)' }, { letterRegex: /e/ig, replaceRegex: '(e|ē)' }, { letterRegex: /o/ig, replaceRegex: '(ō|ó)' }];

