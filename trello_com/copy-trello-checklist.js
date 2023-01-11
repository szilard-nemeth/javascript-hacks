//Credits: https://gist.github.com/niallsmart/d7138b87b306a1f3bb8a
copy($(".checklist-item:not(.checklist-item-checked)").map(function() {
  var e = $(this),
      item = e.find(".checklist-item-details-text").text()
  
  if (e.hasClass("checklist-item-state-complete")) {
    item = item + " (DONE)"
  }
  
  return item
}).get().join("\n"))