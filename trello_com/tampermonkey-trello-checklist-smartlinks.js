// ==UserScript==
// @name         Trello copy checklist button
// @namespace    https://trello.com/*
// @version      0.1
// @description  Copies checklist items in a raw format
// @author       Szilard Nemeth
// @include      https://trello.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// ==/UserScript==
(function() {
    'use strict';
    //window.addEventListener('load', <function here>, false);

    var selector = ".button-link.js-card-cover-chooser";
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) {
        if(document.querySelectorAll(selector).length > 0) {
            console.log("Cover button loaded")
            observer.disconnect();
            doStuff();
        }
    }

    function copy(val) {
        var textarea = document.querySelector('.js-copytextarea');
        textarea.value = val
        textarea.focus();
        textarea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    }

    function doStuff() {
        console.log("Executing script...")

        let hiddenInput = document.createElement("textarea");
        hiddenInput.className = "js-copytextarea"
        document.body.appendChild(hiddenInput)

        const coverButton = document.querySelectorAll(selector)[0]
        console.log(coverButton)
        let copyChecklistButton = document.createElement("button");
        copyChecklistButton.innerHTML = "Copy checklist (raw)"
        copyChecklistButton.id = "copy-checklist-raw";
        copyChecklistButton.className = "button-link"
        copyChecklistButton.addEventListener('click', function() {
            copy($(".checklist-item:not(.checklist-item-checked)").map(function() {
                var e = $(this),
                item = e.find(".checklist-item-details-text").text()
                var smartlinks = e.find(".atlaskit-smart-link")

                if (smartlinks.length) {
                    //sanity check
                    if (smartlinks.length != 1) {
                        console.error("length of smartlinks should be 1, but it is: " + smartlinks.length)
                    } else {
                        item = item + "  " + smartlinks.attr("href")
                    }
                }

                if (e.hasClass("checklist-item-state-complete")) {
                    item = item + " (DONE)"
                }

                return item
            }).get().join("\n"))
            console.log("Copied!")
        });
       coverButton.parentNode.appendChild(copyChecklistButton)
    }
})();