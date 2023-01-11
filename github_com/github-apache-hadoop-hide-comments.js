// ==UserScript==
// @name         GitHub Apache Hadoop Hide comments
// @namespace    https://github.com/apache/hadoop/
// @version      0.1
// @description  Hides all comments from Apache Yetus
// @author       Szilard Nemeth
// @include      /https?:\/\/github\.com.*\/apache\/hadoop\/.*/
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    const comments = document.querySelectorAll(".timeline-comment")
    let yetusComments = [];
    for (let i = 0; i < comments.length; ++i) {
        let comment = comments[i]
        comment.querySelectorAll("a").forEach(link => {
            if (link.textContent.includes("hadoop-yetus")) {
                yetusComments.push(comment.querySelector(".edit-comment-hide"));
            }
        });
    }

    let visible = true;
    const sidebar = document.querySelector('#partial-discussion-sidebar')
    let toggleButton = document.createElement("button");
    toggleButton.innerHTML = "Toggle comments"
    toggleButton.id = "toggle-comments";
    toggleButton.className = "btn btn-block btn-sm"
    toggleButton.addEventListener('click', function() {
        visible = !visible;
        yetusComments.forEach(div => div.style.display = (visible ? "block" : "none"));
    });
    sidebar.appendChild(toggleButton)
})();