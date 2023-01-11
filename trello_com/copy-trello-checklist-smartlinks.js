copy($(".checklist-item:not(.checklist-item-checked)").map(function() {
  var e = $(this),
  item = e.find(".checklist-item-details-text").text()
  var smartlinks = e.find(".atlaskit-smart-link")
  
  if (smartlinks.length) {
  	//sanity check
  	if (smartlinks.length != 1) {
  		console.error("length of smartlinks should be 1, but it is: " + smartlinks.length)	
  	} else { 
  		item = item + "  " + smartlinks.attr("href")
  	}
  }
  
  if (e.hasClass("checklist-item-state-complete")) {
    item = item + " (DONE)"
  }
  
  return item
}).get().join("\n"))