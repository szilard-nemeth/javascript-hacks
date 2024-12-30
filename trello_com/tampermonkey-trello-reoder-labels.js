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

button = getElementByInnerHTML('Show more labels')
if (button) {
    console.log(button)
}


