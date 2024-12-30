function getShowMoreLabelsButtonJQuery() {
    var button = $("button:contains(Show more labels)")[0]
    return button
}

function getElementByInnerHTML(text) {
    const elements = document.getElementsByTagName('button'); // Select all elements in the document
    console.log("Found " + elements.length + " buttons.");

    for (const element of elements) {
        if (element.innerHTML === text) {
            return element;
        }
    }

    return null; // Return null if no element is found
}

(function clickButtonLoop() {
    setTimeout(function() {
        button = getElementByInnerHTML('Show more labels')
        if (button) {
            console.log("clicking button: " + button)
            button.click()
            clickButtonLoop()
        }

    }, 100)
})()

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
        console.log(aText)
        console.log(bText)
        if (aText > bText) return 1;
        if (aText < bText) return -1;
        return 0;
    });
    return [listItemsArray, parentNode];
}

function start() {
    let [labelsArray, parentNode] = getOrderedLabels();
    console.log("labels: ")
    console.log(labelsArray)

    console.log("parent node: ")
    console.log(parentNode)

    labelsArray.forEach((label) => parentNode.removeChild(label));
    labelsArray.forEach((label) => parentNode.appendChild(label));
}

start()



