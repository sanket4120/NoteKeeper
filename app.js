window.addEventListener('load', function () {
  const add = document.getElementById('add');
  const notes = document.querySelector('.notes');
  const filter = document.getElementById('filter');
  let updateId;

  let localNotes = localStorage.getItem('localNotes');

  if (localNotes) {
    var allNotes = JSON.parse(localNotes);
  } else {
    let localNotes = [];
    localStorage.setItem('localNotes', JSON.stringify(localNotes));
    var allNotes = JSON.parse(localStorage.localNotes);
  }

  renderNotes();

  add.addEventListener('click', () => {
    const noteType = add.innerText;
    const textarea = document.getElementById('textarea');
    const newNote = textarea.value;
    textarea.value = '';
    add.innerText = 'Create Note';

    if (noteType === 'Create Note') {
      var id = getNewId();
    } else if (noteType === 'Update Note') {
      var id = updateId;
      const index = allNotes.findIndex((note) => note.id === updateId);
      let newNotes = allNotes.filter((note) => note.id !== updateId);
      allNotes = newNotes;
    }
    const { date, time } = getTD();

    const newNoteContent = {
      id,
      note: newNote,
      date,
      time,
    };

    allNotes.unshift(newNoteContent);
    localStorage.setItem('localNotes', JSON.stringify(allNotes));
    renderNotes();
  });

  function getNewId() {
    let dt = new Date().getTime();

    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );

    return uuid;
  }

  function getTD() {
    const today = new Date();
    const date = `${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}`;
    const time = `${today.getHours()}:${today.getMinutes()}`;
    return { date, time };
  }

  function renderNotes(phrase) {
    if (allNotes.length > 1) {
      filter.style.display = 'block';
    } else {
      filter.style.display = 'none';
    }
    notes.innerHTML = allNotes
      .map((note) => {
        if (phrase) {
          if (note.note.toLowerCase().includes(phrase.toLowerCase())) {
            return Note(note);
          }
        } else {
          return Note(note);
        }
      })
      .join('');
  }

  function Note(Note) {
    const { date, time, note, id } = Note;
    return `<div class="note" id=${id}>
              <div class="note_top">
                <p>${date} | ${time}</p>
                <span>
                  <i class="far fa-edit update"></i>
                  <i class="far fa-trash-alt delete"></i>
                </span>
              </div>
              <div>${note}</div>
            </div>`;
  }

  filter.addEventListener('keyup', (e) => {
    renderNotes(e.target.value);
  });

  notes.addEventListener('click', (e) => {
    if (e.target.classList.contains('update')) {
      const id = getCurrentNotId(e);
      const index = allNotes.findIndex((note) => note.id === id);
      const textarea = document.getElementById('textarea');
      textarea.value = allNotes[index].note;
      add.innerText = 'Update Note';
      updateId = id;
    }
    if (e.target.classList.contains('delete')) {
      const id = getCurrentNotId(e);
      let newNotes = allNotes.filter((note) => note.id !== id);
      allNotes = newNotes;
      localStorage.setItem('localNotes', JSON.stringify(allNotes));
      renderNotes();
    }
  });

  function getCurrentNotId(e) {
    const note = e.target.parentNode.parentNode.parentNode;
    const id = note.getAttribute('id');
    return id;
  }
});
