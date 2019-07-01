$.ready(function() {
	$.get('title').innerHTML = $.string.format("Quiz Game {0}", $.getVersion());

	var actionHistory = [];
	var termsContainer = $.get("termsContainer");

	$.get('controlButton').addEventListener("click",
		function() {
			console.log("actionHistory("+ actionHistory.length +"):" + actionHistory);
		}
		,false);

	$.get('undo').addEventListener("click",
		function() {
			console.log("actionHistory("+ actionHistory.length +"):" + actionHistory);
			undo();
		}
		,false);

	function undo() {
		let lastAction = actionHistory.pop(),
		termId = lastAction[0],
		sourceId = lastAction[1],
		destinationId = lastAction[2];
		var term = $.get(termId);

		if (sourceId.includes("termsContainer")) { //A->B
			restoreTerm(term);
			$.get("new_"+termId).remove();
		}
		else if (destinationId.includes("termsContainer")) { //B->A
			$.get(sourceId).appendChild(copyTerm(term));
			hideTerm(term);
		}
		else
		{
			$.get(sourceId).appendChild($.get("new_"+termId));
		}
	}

	function startDragItemFunc(e) {
		//e.target is dragged item
		console.log("drag start:" + e.target.id);
		e.dataTransfer.setData("text", e.target.id);
	}

	function hideTerm(item) {
		item.style.visibility = "hidden";
		item.style.draggable = "false";
	}

	function restoreTerm(item) {
		item.style.visibility = "visible";
		item.style.draggable = "true";
	}

	function copyTerm(item) {
		var newDragEl = item.cloneNode(true);
		newDragEl.id = "new_"+item.id;
		newDragEl.style.draggable = "true";
		newDragEl.addEventListener("dragstart", startDragItemFunc, false);
		return newDragEl;
	}

	function dropItemFunc(e) {
		e.preventDefault();
		if (!e.target.hasChildNodes()) {
			//e.target is receiving item
			console.log("drag end on:" + e.target.id);
			var data = e.dataTransfer.getData("text"); //id of dragged item
			var dragEl = $.get(data);
			//e.target.innerHTML = dragEl.innerHTML;
			//dragEl.innerHTML = "";
			if (dragEl.id.includes("new")) {
				var originalId = data.substring(4);
				actionHistory.push([originalId,dragEl.parentNode.id,e.target.id]);
				e.target.appendChild(dragEl);
			}
			else {
				e.target.appendChild(copyTerm(dragEl));
				hideTerm(dragEl);
				actionHistory.push([data,termsContainer.id,e.target.id]);
			}
		}
	}

	function returnDropItemFunc(e) {
		e.preventDefault();
		var data = e.dataTransfer.getData("text"); //id of dragged item
		var dragEl = $.get(data);
		if (data.includes("new")){
			var original = $.get(data.substring(4));
			actionHistory.push([original.id,dragEl.parentNode.id,termsContainer.id]);
			restoreTerm(original);
			dragEl.remove();
		}
	}

	function dragOverItemFunc(e) {
		e.preventDefault();
	}

	for (var i=1; i<=5; i++) {
		var dragItem = $.get("termWidget"+i);
		dragItem.addEventListener("dragstart", startDragItemFunc, false);

		var dropArea = $.get("definitionWidget"+i);
		dropArea.addEventListener("drop", dropItemFunc, false);
		dropArea.addEventListener("dragover", dragOverItemFunc, false);
	}

	termsContainer.addEventListener("drop", returnDropItemFunc, false);
	termsContainer.addEventListener("dragover", dragOverItemFunc, false);
});
