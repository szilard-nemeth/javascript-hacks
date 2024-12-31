// ==UserScript==
// @name         Trello convert Evernote links
// @namespace    https://trello.com/*
// @version      0.1
// @description  Convert evernote links (e.g. evernote:///view/...) to normal anchors
// @author       Szilard Nemeth
// @include      https://trello.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// ==/UserScript==
(function() {
    'use strict';
    //window.addEventListener('load', <function here>, false);
    var selector = 'button[data-testid=card-back-custom-fields-button]';
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) {
        var refButton = $(selector)
        if(refButton.length > 0) {
            console.log("Reference button found")
            observer.disconnect();
            doStuff();
        } else {
            console.log("Cannot find button with selector: " + selector)
        }
    }


    function doStuff() {
        console.log("Executing script: 'Trello convert Evernote links'...")
        var descriptionArea = $('div[data-testid="description-content-area"]')[0]
        var origHTML = descriptionArea.innerHTML
        //$('div[data-testid="description-content-area"]')[0].innerHTML = "bla"
        var newHTML = ""

        const regex = /evernote:\/\/\/view\/[a-zA-Z0-9/-]+/g
        const matches = origHTML.matchAll(regex);
        for (const match of matches) {
            console.log(`Found ${match[0]} start=${match.index} end=${match.index + match[0].length}.`,);
            console.log("Replacement: " + `<a href="${match[0]}">${match[0]}</a>`)
            newHTML += origHTML.replace(match[0], `<a href="${match[0]}">${match[0]}</a>`)
        }
        console.log("Modified HTML: " + newHTML)


        descriptionArea.innerHTML = newHTML
        //'<div class="ibk99ptVTfUfda"><div style="max-height: 440px;"><div><div class="TTb5N2DgAn9VHs"><div class="ak-renderer-wrapper is-full-width css-1jke4yk"><div style="display: block; width: 100%; position: absolute;"></div><div class="css-1efogno"><div class="ak-renderer-document"><p data-renderer-start-pos="1">evernote:///view/5801403/s52/4638765c-7732-7384-073b-6a0075744c8b/14bad46f-ecb6-ff1d-8c66-5a2d1f5313de</p></div></div></div></div></div></div></div>'
    }
})();

