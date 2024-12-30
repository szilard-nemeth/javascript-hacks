function getShowMoreLabelsButtonJQuery() {
    var button = $("button:contains(Show more labels)")[0]
    return button
}

function getElementByInnerHTML(text) {
    const elements = document.getElementsByTagName('button'); // Select all elements in the document
    //console.log("Found " + elements.length + " buttons.");

    for (const element of elements) {
        if (element.innerHTML === text) {
            return element;
        }
    }

    return null; // Return null if no element is found
}

function clickButtonLoop(innerHTML) {
    setTimeout(function() {
        var showMoreLabelsButton = getElementByInnerHTML(innerHTML)
        if (showMoreLabelsButton) {
            console.log("clicking button: " + showMoreLabelsButton)
            showMoreLabelsButton.click()
            clickButtonLoop(innerHTML)
        }

    }, 100)
    console.log("clickButtonLoop ended")
}

function waitForButtonDisappear(callback) {
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) {
        var button = getElementByInnerHTML('Show more labels')
        if (button) {
            console.log("waitForButtonDisappear:: button found")
        } else {
            console.log("waitForButtonDisappear:: button NOT FOUND")
            observer.disconnect()
            callback()
        }
    }

}

function getElementsByProperty(name, value) {
    selector = `[${name}="${value}"]`
    console.log(selector)
    const elements = document.querySelectorAll(selector);
    return elements
}

function getListItems(parent) {
    const listItems = parent.querySelectorAll("li");
    let listItemParent = listItems[0].closest('ul')
    return [listItems, listItemParent]
}

function getOrderedLabels() {
    var elements = getElementsByProperty("data-testid", "labels-popover-labels-screen")
    let [listItems, parentNode] = getListItems(elements[0])
    console.log("parent: ");
    console.log(parentNode)
    console.log("list items: ");
    console.log(listItems)

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

function start() {
    clickButtonLoop("Show more labels")
    console.log("AFTER CLICKBUTTONLOOP...")
    waitForButtonDisappear(executeDOMOperations)
}

function executeDOMOperations() {
    console.log("Executing DOM Operations")
    let [labelsArray, parentNode] = getOrderedLabels();
    // console.log("labels: ")
    // console.log(labelsArray)
    //
    // console.log("parent node: ")
    // console.log(parentNode)

    labelsArray.forEach((label) => parentNode.removeChild(label));
    labelsArray.forEach((label) => parentNode.appendChild(label));
}

start()



