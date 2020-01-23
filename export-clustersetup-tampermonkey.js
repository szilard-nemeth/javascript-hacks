// ==UserScript==
// @name         Clustersetup param import/export
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://master-01.jenkins.cloudera.com/job/Cluster-Setup/*/parameters/
// @match        https://master-01.jenkins.cloudera.com/job/Cluster-Setup/build*
// @grant        none
// ==/UserScript==

(function() {
    resultStr = ""

function addStyle() {
     var style = document.createElement('style');
  style.innerHTML = `
  .textboxdiv {
  display: none;
  position: absolute;
  top: 50px;
  left: 800px;
  background: black;
  opacity: 0.5;
  height: 300px;
  width: 300px;
  color: blue;
}

#textbox {
    height:200px;
    width:300px;
    margin-top:50px;
}
  `;
  document.head.appendChild(style);
}

window.showImportParamsTextbox = function() {
    appendTextBox()
    jQuery("#textboxdiv").toggle();
}

window.importParams = function() {
    var valueJson = jQuery("#textbox").val()
    importFormValues(valueJson)
    jQuery("#textboxdiv").toggle();
}

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function logMapElements(value, key, map) {
  resultStr +=(`${key} = ${value}\n`);
}

function createButton(title, funcToCall) {
    if (title === undefined || title == "") {
        throw "Title should be defined!"
    }

    if (funcToCall === undefined || funcToCall == "") {
        throw "funcToCall should be a valid function!"
    }

    var href = `javascript:${funcToCall}();`
    var anchor = jQuery(`<div class="smallfont"><a href="${href}" title="${title}">${title}</a></div>`)
    anchor.appendTo(jQuery('#right-top-nav'));
}

function appendTextBox() {
    var textbox = jQuery(`<div id="textboxdiv" class="textboxdiv">
        <textarea id="textbox" cols=10 rows=3></textarea>
        <button onclick="window.importParams()">Import</button>
        </div>`)
    textbox.appendTo(jQuery('#main-panel'));
}

window.exportAndCopyParams = function() {
    const el = document.createElement('textarea');
    el.value = exportParams()
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function exportParams() {
    var map = getFormValues()
    var mapJson = JSON.stringify(strMapToObj(map))
    console.log("JSON: " + mapJson)
    return mapJson
}

function importJquery() {
    //https://www.quora.com/How-can-I-import-JQuery-into-my-js-file
    var s = document.createElement("script");
    s.src = "https://code.jquery.com/jquery-3.4.1.min.js";
    s.onload = function(e){ /* now that its loaded, do something */ };
    document.head.appendChild(s);
}

function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}

function objToStrMap(obj) {
    var entries = Object.entries(obj)
    if (entries.length > 0) {
        return new Map(entries)
    } else {
        return new Map()
    }
}

function getParamInputsMap() {
    var settingNames = jQuery('.setting-name')
    var settingInputs = jQuery("input[name='value'],select[name='value']")

    //TODO reuse this Map in other methods
    //put param names and inputs to a Map
    var paramInputsMap = new Map();
    i = 0
    settingInputs.each(function () {
        var $input = jQuery(this);
        paramInputsMap.set(jQuery(settingNames[i]).html(), $input)
        i++
    });

    return paramInputsMap
}

function getFormValues() {
    var paramInputsMap = getParamInputsMap()

    var result = new Map();
    for (const [inputName, input] of paramInputsMap) {
        var value = input.val()
        if (input.is(':radio,:checkbox')) {
            if (input.is(':checked')) {
                value = 'true'
            } else {
                value = 'false'
            }
        }
        result.set(inputName, value)
    }
    result.forEach(logMapElements)
    return result
}

function importFormValues(valueJson) {
    var paramInputsMap = getParamInputsMap()

    var valueObj = JSON.parse(valueJson)
    for (const [name, value] of Object.entries(valueObj)) {
        var input = paramInputsMap.get(name)
        if (input.is(':radio,:checkbox')) {
            if (value === "true") {
                input.prop("checked", true)
            } else {
                input.prop("checked", false)
            }
        } else {
            input.val(value)
        }
    }
}

window.clearFormValues = function() {
    var paramInputsMap = getParamInputsMap()
    for (const [inputName, input] of paramInputsMap) {
        input.val("")
        if (input.is(':radio,:checkbox')) {
            input.prop("checked", false)
        }
    }
}

importJquery()
addStyle()
createButton("Export params", "window.exportAndCopyParams")
createButton("Import params", "window.showImportParamsTextbox")
createButton("Clear params", "window.clearFormValues")
jQuery('.behavior-loading').hide()
})();