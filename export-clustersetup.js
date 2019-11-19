resultStr = ""

function logMapElements(value, key, map) {
  resultStr +=(`${key} = ${value}\n`);
}

function importJquery() {
    //https://www.quora.com/How-can-I-import-JQuery-into-my-js-file
    var s = document.createElement("script");
    s.src = "https://code.jquery.com/jquery-3.4.1.min.js";
    s.onload = function(e){ /* now that its loaded, do something */ }; 
    document.head.appendChild(s); 
}

function printForm() {
    var settingNames = jQuery('.setting-name')
    var settingInputs = jQuery('.setting-main input')
    var result = new Map();

    i = 0
    settingInputs.each(function () {
        var $input = jQuery(this);
        var value = $input.val()
        if ($input.is(':radio,:checkbox')) {
            if (this.checked) {
                value = 'true'
            }
        }
        result.set(jQuery(settingNames[i]).html(), value)
        i++
    });

    result.forEach(logMapElements) 
    return resultStr  
}

importJquery()
printForm()