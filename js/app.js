$.ready(function() {
	$.get('title').innerHTML = $.string.format("Quiz Game {0}", $.getVersion());

	$.get('controlButton').addEventListener("click",
		function() {
			console.log("controlButton clicked");
		}
		,false);

	function startDragItemFunc(e) {
		//e.target is dragged item
		console.log("drag start:" + e.target.id);
		e.dataTransfer.setData("text", e.target.id);
	}

	function dropItemFunc(e) {
		//e.target is receiving item
		e.preventDefault();
		console.log("drag end on:" + e.target.id);
		var data = e.dataTransfer.getData("text");
		var dragEl = $.get(data);
		//e.target.innerHTML = dragEl.innerHTML;
		//dragEl.innerHTML = "";
		var newDragEl = dragEl.cloneNode(true);
		newDragEl.id = "new_"+data;
		e.target.appendChild(newDragEl);
		dragEl.style.visibility = "hidden";
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
});
