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
    return listItems
}

elements = getElementsByProperty("data-testid", "labels-popover-labels-screen")
parent = elements[0]

console.log(getListItems(parent))



