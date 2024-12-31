// ==UserScript==
// @name         Trello copy checklist button
// @namespace    https://trello.com/*
// @version      0.1
// @description  Copies checklist items in a raw format
// @author       Szilard Nemeth
// @include      https://trello.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    //window.addEventListener('load', <function here>, false);
    const customFieldsButtonSelector = 'button[data-testid=' + "card-back-custom-fields-button" + ']';
    const copyTextAreaClassName = "js-copytextarea"

    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) {
        const customFieldsButton = document.querySelector(customFieldsButtonSelector)
        if (customFieldsButton) {
            console.log("'Custom Fields' button found")
            observer.disconnect();
            start();
        }
    }

    function copy(val) {
        const textarea = document.querySelector('.' + copyTextAreaClassName);
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

    function findElements(parentSelector, childrenSelector) {
        const parents = document.querySelectorAll(parentSelector);

        let found = [];
        for (let i = 0; i < parents.length; i++) {
            let children = parents[i].querySelectorAll(childrenSelector);
            children = Array.prototype.slice.call(children);
            found = found.concat(children);
        }
        return found
    }

    function getCheckboxCheckedStates() {
        const checkboxes = findElements('div[data-testid=checklist-container]', 'input[type="checkbox"]')
        return checkboxes.map((value, index) => {
            return value.checked
        });
    }

    function copyEventListener(e) {
            console.log("event: " + e)
            e.preventDefault();
            e.stopPropagation();
            const checkedStates = getCheckboxCheckedStates();
            if (checkedStates.length === 0) {
                console.error("Invalid checked states, length is 0!")
            }
        let checkItemNodeList = document.querySelectorAll('div[data-testid="check-item-name"]');
        let checkItemArray = Array.prototype.slice.call(checkItemNodeList, 0);
        copy(checkItemArray.map((value, index) => {
                const text = value.innerText;
                const label = value.getAttribute("aria-label");
                let item = label;
                if (label !== text) {
                    item = text + ": " + label
                }
                if (checkedStates[index] === true) {
                    item = item + " (DONE)"
                }

                return item
            }).join("\n"))
    }

    function start() {
        console.log("Executing script...")

        let copyTextArea = document.createElement("textarea");
        copyTextArea.className = copyTextAreaClassName
        document.body.appendChild(copyTextArea)

        const customFieldsButton = document.querySelector(customFieldsButtonSelector)
        let copyChecklistButton = document.createElement("button");
        copyChecklistButton.innerHTML = "Copy checklist (raw)"
        copyChecklistButton.id = "copy-checklist-raw";
        copyChecklistButton.className = "button-link"
        copyChecklistButton.addEventListener('mousedown', copyEventListener);
        customFieldsButton.parentNode.appendChild(copyChecklistButton)
    }
})();

