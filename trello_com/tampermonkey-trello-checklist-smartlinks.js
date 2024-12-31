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
    const selector = 'button[data-testid=' + "card-back-custom-fields-button" + ']';
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) {
        const customFieldsButton = document.querySelector(selector)
        if (customFieldsButton) {
            console.log("'Custom Fields' button found")
            observer.disconnect();
            doStuff();
        }
    }

    function copy(val) {
        const textarea = document.querySelector('.js-copytextarea');
        textarea.focus();
        textarea.value = val;
        window.setTimeout(() => {
            console.log("Trying to focus on textarea: " + textarea)
            textarea.focus();
            textarea.select();
            console.log("Currently focused element is: " + document.activeElement);

            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }
        }, 100); 
    }

    function getCheckboxCheckedStates() {
        const checkItemsContainer = document.querySelector('div[data-testid="checklist-check-items-container"]')
        const checkboxes2 = checkItemsContainer.querySelectorAll('input[type="checkbox"]')
        console.log(checkboxes2)
        const checkboxes = $('div[data-testid="checklist-check-items-container"]').find('input[type="checkbox"]');
        const checkedStates = checkboxes.map(function () {
            var e = $(this);
            const checked = e.attr("aria-checked");
            return checked
        });
        return checkedStates;
    }

    function copyEventListener(e) {
            console.log("event: " + e)
            e.preventDefault();
            e.stopPropagation();
            const checkedStates = getCheckboxCheckedStates();
            copy($('div[data-testid="check-item-name"]').map(function(i, val) {
                const text = val.innerText;
                const label = val.getAttribute("aria-label");
                let item = label;
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

        const customFieldsButton = document.querySelector(selector)
        let copyChecklistButton = document.createElement("button");
        copyChecklistButton.innerHTML = "Copy checklist (raw)"
        copyChecklistButton.id = "copy-checklist-raw";
        copyChecklistButton.className = "button-link"
        copyChecklistButton.addEventListener('mousedown', copyEventListener);
        customFieldsButton.parentNode.appendChild(copyChecklistButton)
    }
})();

