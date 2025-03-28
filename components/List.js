import notesData from "../scripts/data.js";

class List extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Ambil data dari localStorage atau gunakan default dari notesData
    this.notesData = JSON.parse(localStorage.getItem("notes")) || [...notesData];
  }

  connectedCallback() {
    this.render();
    this.listenForNewNote();
  }

  listenForNewNote() {
    window.addEventListener("note-added", (event) => {
      this.addNote(event.detail);
    });
  }

  addNote(note) {
    this.notesData.push(note);
    localStorage.setItem("notes", JSON.stringify(this.notesData)); // Update localStorage
    this.render();
  }

  deleteNote(id) {
    this.notesData = this.notesData.filter(note => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(this.notesData)); // Update localStorage
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles/notes-list.css">
      <div class="note-list">
        ${this.notesData.map(item => `
          <div class="note-item">
            <h3>${item.title}</h3>
            <p>${item.body}</p>
            <span>${new Date(item.createdAt).toLocaleString()}</span>
            <div class="note-actions">
            <button class="edit" data-id="${item.id}">Edit</button>
              <button class="delete" data-id="${item.id}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    this.shadowRoot.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', (e) => this.deleteNote(e.target.dataset.id));
    });
  }
}

customElements.define("note-list", List);
export default List;
