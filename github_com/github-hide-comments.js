// ==UserScript==
// @name         GitHub Apache Hide comments
// @namespace    https://github.infra.cloudera.com/CDH/dex/
// @version      0.1
// @description  Hides all comments from Jenkins
// @author       Szilard Nemeth
// @include      /https?:\/\/github\.infra\.cloudera\.com.*\/CDH\/dex\/.*/
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    const comments = document.querySelectorAll(".timeline-comment")
    let selectedComments = [];
    for (let i = 0; i < comments.length; ++i) {
        let comment = comments[i]
        comment.querySelectorAll("a").forEach(link => {
            if (link.textContent.includes("jenkins")) {
                selectedComments.push(comment.querySelector(".edit-comment-hide"));
            }
        });
    }

    let visible = true;
    const sidebar = document.querySelector('#partial-discussion-sidebar')
    let toggleButton = document.createElement("button");
    toggleButton.innerHTML = "Toggle Jenkins comments"
    toggleButton.id = "toggle-comments";
    toggleButton.className = "btn btn-block btn-sm"
    toggleButton.addEventListener('click', function() {
        visible = !visible;
        selectedComments.forEach(div => div.style.display = (visible ? "block" : "none"));
    });
    sidebar.appendChild(toggleButton)
})();