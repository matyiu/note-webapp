(function() {
	var notes = JSON.parse(localStorage.getItem("notes"));
	var id = localStorage.getItem("noteid");

	function getColumn() {
		var parent = document.getElementsByClassName("row")[0];
		var columns = parent.childNodes;
		var selectedCol = document.getElementsByClassName("col-1")[0];
		columns.forEach(function(column) {
			if (column.nodeType == document.ELEMENT_NODE) {
				var notes = column.childNodes.length;
				selectedCol = (notes < selectedCol.childNodes.length) ? column : selectedCol;
			}
		});

		return selectedCol;
	}

	function autoHeight() {
		this.style.height = 0;
		this.style.height = this.scrollHeight + "px";
	}

	function saveNote(title, content, name, remove) {
		if(!remove) {
			id++;
			localStorage.setItem("noteid", id);

			notes[name] = {
				title: title,
				content: content,
				name: name
			};
		}

		if(remove) {
			this.removeEventListener("click", saveNote);
			delete notes[name];
		}

		localStorage.setItem("notes", JSON.stringify(notes));
	}

	function finishEdit(name) {
		var note = this.parentNode;
		var noteTitle = note.querySelector("h2");
		var noteContent = note.querySelector("p");
		var mainNote = note.querySelector(".main-note");
		var inputTitle = note.querySelector("textarea.title");
		var inputContent = note.querySelector("textarea.content");
		var removeBtn = note.querySelector(".remove");

		noteTitle.textContent = inputTitle.value;
		noteContent.textContent = inputContent.value;
		noteTitle.style.display = "block";
		noteContent.style.display = "block";
		mainNote.style.display = "block";
		removeBtn.style.display = "flex";
		inputTitle.style.display = "none";
		inputContent.style.display = "none";
		this.style.display = "none";

		if(!name)
			name = "note" + id;
		note.setAttribute("data-name", name);
		saveNote(inputTitle.value, inputContent.value, name);
		this.removeEventListener("click", finishEdit);
	}

	function editNote(removeBtn, inputTitle, inputContent, saveBtn, name) {
		console.log(this);
		this.style.display = "none";
		removeBtn.style.display = "none";
		inputTitle.style.display = "block";
		inputContent.style.display = "block";
		saveBtn.style.display = "flex";

		autoHeight.call(inputTitle);
		autoHeight.call(inputContent);

		saveBtn.addEventListener("click", finishEdit.bind(saveBtn, name));
	}

	function restartNotes() {
		var columns = document.getElementsByClassName("col-1");
		columns = Array.prototype.slice.call(columns);
		columns.forEach(function(column) {
			var notes = column.getElementsByClassName("note");
			notes = Array.prototype.slice.call(notes);
			notes.forEach(function(note) {
				column.removeChild(note);
			});
		});

		for(var noteName in notes) {
			var note = notes[noteName];
			addNote(note.title, note.content, note.name);
		}
	}

	function removeNote() {
		var note = this.parentNode;
		var parentNote = note.parentNode;

		saveNote(null, null, note.getAttribute("data-name"), true);
		parentNote.removeChild(note);

		restartNotes();
	}

	function addNote(title, content, name, mode) {
		function createNoteElement(tag, classElement, text) {
			var element = document.createElement(tag);
			element.className = classElement;
			if(text)
				element.textContent = text;

			return element;
		}

		var noteTitle = createNoteElement("h2", "title", title);
		var noteContent = createNoteElement("p", "content", content);
		var mainNote = createNoteElement("div", "main-note");
		mainNote.appendChild(noteTitle);
		mainNote.appendChild(noteContent);

		var inputTitle = createNoteElement("textarea", "title", title);
		var inputContent = createNoteElement("textarea", "content", content);
		inputTitle.addEventListener("keyup", autoHeight);
		inputContent.addEventListener("keyup", autoHeight);

		var removeBtn = createNoteElement("a", "btn remove");
		var removeIcon = createNoteElement("span", "fa fa-remove");
		removeBtn.appendChild(removeIcon);
		removeBtn.addEventListener("click", removeNote);

		var saveBtn = createNoteElement("a", "btn save");
		var saveIcon = createNoteElement("span", "fa fa-check");
		saveBtn.appendChild(saveIcon);

		mainNote.addEventListener("click", editNote.bind(mainNote, removeBtn, inputTitle, inputContent, saveBtn,
			name));

		var note = createNoteElement("div", "note");
		if(name)
			note.setAttribute("data-name", name);
		if(mode == "new") {
			mainNote.style.display = "none";
			removeBtn.style.display = "none";
			inputTitle.style.display = "block";
			inputContent.style.display = "block";
			saveBtn.style.display = "flex";
			saveBtn.addEventListener("click", finishEdit.bind(saveBtn, name));
			note.style.animation = "newNote 0.3s ease-in-out 0s 1";
		}
		note.appendChild(mainNote);
		note.appendChild(inputTitle);
		note.appendChild(inputContent);
		note.appendChild(removeBtn);
		note.appendChild(saveBtn);

		var col = getColumn();
		col.appendChild(note);

		autoHeight.call(inputTitle);
		autoHeight.call(inputContent);
	}

	for(var noteName in notes) {
		var note = notes[noteName];
		addNote(note.title, note.content, note.name);
	}

	var addBtn = document.getElementById("addNote");
	addBtn.addEventListener("click", addNote.bind(this, "Sample Title", "Sample Content", null, "new"));
}());