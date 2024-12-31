// ==UserScript==
// @name         Trello sort labels button
// @namespace    https://trello.com/*
// @version      0.1
// @description  Sort labels A-Z
// @author       Szilard Nemeth
// @include      https://trello.com/*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';

    function getElementByInnerHTML(text) {
        const elements = document.getElementsByTagName('button'); // Select all elements in the document
        for (const element of elements) {
            if (element.innerHTML === text) {
                return element;
            }
        }

        return null; // Return null if no element is found
    }

    function clickButtonLoop(innerHTML) {
        setTimeout(function () {
            var showMoreLabelsButton = getElementByInnerHTML(innerHTML)
            if (showMoreLabelsButton) {
                console.log("Clicking button: " + showMoreLabelsButton)
                showMoreLabelsButton.click()
                clickButtonLoop(innerHTML)
            }

        }, 100)
    }

    function waitForButtonDisappear(innerHTML, callback) {
        (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

        function check(changes, observer) {
            var button = getElementByInnerHTML(innerHTML)
            if (button) {
                console.log("waitForButtonDisappear:: button found")
            } else {
                console.log("waitForButtonDisappear:: button NOT FOUND")
                observer.disconnect()
                callback()
            }
        }
    }

    function waitForTrelloLabelsToAppear(callback) {
        var selector = 'section[data-testid=' + "labels-popover-labels-screen" + ']';
        (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

        function check(changes, observer) {
            var refElement = document.querySelector(selector)
            if (refElement) {
                console.log("waitForTrelloLabelsToAppear:: Labels menu found with selector: " + selector)
                console.log(refElement)
                observer.disconnect();
                callback()
            } else {
                console.log("waitForTrelloLabelsToAppear:: Labels menu NOT FOUND with selector: " + selector)
            }
        }
    }

    function getElementsByProperty(name, value) {
        let selector = `[${name}="${value}"]`
        return document.querySelectorAll(selector)
    }

    function getListItems(parent) {
        const listItems = parent.querySelectorAll("li");
        let listItemParent = listItems[0].closest('ul')
        return [listItems, listItemParent]
    }

    function getOrderedLabels() {
        var elements = getElementsByProperty("data-testid", "labels-popover-labels-screen")
        let [listItems, parentNode] = getListItems(elements[0])

        var listItemsArray = Array.prototype.slice.call(listItems, 0);
        listItemsArray.sort(function (a, b) {
            var aText = a.innerText;
            var bText = b.innerText;
            if (aText > bText) return 1;
            if (aText < bText) return -1;
            return 0;
        });
        return [listItemsArray, parentNode];
    }

    function main() {
        waitForTrelloLabelsToAppear(function () {
            addSortLabelsButton()
            clickButtonLoop("Show more labels")
            waitForButtonDisappear("Show more labels", function () {})
        })
    }

    function addSortLabelsButton() {
        let createNewLabelButton = getElementByInnerHTML("Create a new label")
        let sortLabelsButton = document.createElement("button");
        sortLabelsButton.innerHTML = "Sort labels (A-Z)"
        sortLabelsButton.id = "sort-labels-button";
        sortLabelsButton.className = "button-link"
        sortLabelsButton.addEventListener('mousedown', sortLabels);
        createNewLabelButton.parentNode.appendChild(sortLabelsButton)
    }

    function sortLabels() {
        console.log("Sorting labels...")
        let [labelsArray, parentNode] = getOrderedLabels();
        labelsArray.forEach((label) => parentNode.removeChild(label));
        labelsArray.forEach((label) => parentNode.appendChild(label));
    }

    main()

})()


