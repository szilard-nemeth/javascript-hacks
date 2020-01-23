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

//Find localStorage items by string key prefix / query string
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

//Usage
function cleanupStorage() {
	var results = findLocalStorageItems("somekey", true)
	results.forEach(r => {
		printLog("Deleting localStorage item " + r.key);
		window.localStorage.removeItem(r.key);
	})
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
//Copy icon with copy functionality

function makeCopyIcon(idOfItemToCopy) {
	var funcCall = `copyText($('${idOfItemToCopy}').find('a')[0].download)`
	return `<img onclick="${funcCall}" src="${SERVER_URL}/copy-icon.png" alt="copy" style="width:15px;height:15px;cursor: pointer;">`
}

//Invocation: ${makeCopyIcon(`#${quantaTestLogParagraphIdPrefix}-${jiraData.id}-${gtn}`)}

function copyText(str) {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}


//=========================================================================
//Serialize / Deserialize JS Map
//https://2ality.com/2015/08/es6-map-json.html
//https://stackoverflow.com/questions/50153172/how-to-serialize-a-map-in-javascript

function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}

function objToStrMap(obj) {
	var entries = Object.entries(obj)
	if (entries.length > 0) {
		return new Map(entries)
	} else {
		return new Map()
	}
  // return new Map(Object.entries(obj));
  //Alternatively:
  // let strMap = new Map();
  // for (let k of Object.keys(obj)) {
  //   strMap.set(k, obj[k]);
  // }
  // return strMap;
}

//=========================================================================