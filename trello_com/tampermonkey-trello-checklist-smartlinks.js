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
        textarea.value = val;
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

    function getCheckboxCheckedStates() {
        var checkboxes = $('div[data-testid="checklist-check-items-container"]').find('input[type="checkbox"]')
        var checkedStates = checkboxes.map(function() {
            var e = $(this);
            var checked = e.attr("aria-checked")
            return checked
        });
        return checkedStates;
    }

    function copyEventListener() {
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
            //console.log("Copied!")
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
        copyChecklistButton.addEventListener('click', copyEventListener);
        coverButton.parentNode.appendChild(copyChecklistButton)
    }
})();

