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
    var selector = 'button[data-testid=' + "card-back-custom-fields-button" + ']';
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

    function copy(val) {
        var textarea = document.querySelector('.js-copytextarea');
        textarea.focus();
        textarea.value = val;
        window.setTimeout(() => {
            console.log("Trying to focus on textarea: " + textarea)
            textarea.focus();
            textarea.select();
            console.log("Currently focused element is: " + document.activeElement);

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }
        }, 100); 
    }

    function getCheckboxCheckedStates() {
        var checkboxes = $('div[data-testid="checklist-check-items-container"]').find('input[type="checkbox"]')
        var checkedStates = checkboxes.map(function() { 
            var e = $(this);
            var checked = e.attr("aria-checked")
            return checked
        });
        return checkedStates;
    }

    function copyEventListener(e) {
            console.log("event: " + e)
            e.preventDefault();
            e.stopPropagation();
            var checkedStates = getCheckboxCheckedStates();
            copy($('div[data-testid="check-item-name"]').map(function(i, val) {
                var text = val.innerText
                var label = val.getAttribute("aria-label")
                var item = label
                if (label !== text) {
                    item = text + ": " + label
                }
                if (checkedStates[i] === "true") {
                    item = item + " (DONE)"
                }

                return item
            }).get().join("\n"))
    }

    function doStuff() {
        console.log("Executing script...")

        let copyTextArea = document.createElement("textarea");
        copyTextArea.className = "js-copytextarea"
        document.body.appendChild(copyTextArea)

        const coverButton = document.querySelectorAll(selector)[0]
        console.log(coverButton)
        let copyChecklistButton = document.createElement("button");
        copyChecklistButton.innerHTML = "Copy checklist (raw)"
        copyChecklistButton.id = "copy-checklist-raw";
        copyChecklistButton.className = "button-link"
        copyChecklistButton.addEventListener('mousedown', copyEventListener);
        coverButton.parentNode.appendChild(copyChecklistButton)
    }
})();

