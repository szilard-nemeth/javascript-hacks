//=========================================================================

var waitForEl = function(selector, callback, count) {
  //Wait for some element to be loaded
  //SOURCE: https://gist.github.com/chrisjhoughton/7890303
  if (jQuery(selector).length) {
    callback();
  } else {
    setTimeout(function() {
      if(!count) {
        count=0;
      }
      count++;
      console.log("count: " + count);
      if(count<10) {
        waitForEl(selector,callback,count);
      } else {return;}
    }, 100);
  }
};

var selector = $("#Whatevs");

waitForEl(selector, function() {
  // work the magic
  console.log("yay");
});

//=========================================================================


function findLocalStorageItems(query, includeQueryInKeys) {
	//SOURCE: https://gist.github.com/n0m4dz/77f08d3de1b9115e905c
	var i, results = [];
	for (i in localStorage) {
		if (localStorage.hasOwnProperty(i)) {
		  if (i.match(query) || (!query && typeof i === 'string')) {
		    var key = i
		    if (!includeQueryInKeys && key.indexOf(query) == 0) {
		    	key = key.substr(query.length)
		    } 
		    
		    results.push({key:key, val:localStorage.getItem(i)});
		  }
		}
	}
	return results;
}

//=========================================================================

function downloadHandler(evt) {
	function addDownloadHandlers() {
		if (jiraData.links.size > 0) {
			Array.from(jiraData.links.keys()).forEach(gtn => {
				setupDownloadHandler("quantalog", jiraData, gtn)
				setupDownloadHandler("quantabundle", jiraData, gtn)
			})
		}
	}

	function setupDownloadHandler(prefix, jiraData, gtn) {
		var id = `#${prefix}-${jiraData.id}-${gtn}`
		var linkRef = $(id).find("a")
		if (linkRef.length != 0) {
			printError("Link was not found with id: " + id)
		}
		linkRef.click(downloadHandler);
	}

	//Download handler for renaming cross-origin small files: 
	//SOURCE: https://stackoverflow.com/a/33830576/1106893
    evt.preventDefault();
    var name = this.download;
   
    getQuantaURL(this.href)
        .then(res => {printLog("Download complete for URL: " + res.url); return res.blob()})
        .then(blob => {
            $("<a>").attr({
                download: name,
                href: URL.createObjectURL(blob)
            })[0].click();
        });
}

//=========================================================================