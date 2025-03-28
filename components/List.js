import notesData from "../scripts/data.js";

class List extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notesData = [...notesData]; // Menyimpan salinan data di dalam class
  }

  connectedCallback() {
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

    // Tambahkan event listener setelah render
    this.shadowRoot.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', (e) => this.deleteNote(e.target.dataset.id));
    });
  }

  deleteNote(id) {
    this.notesData = this.notesData.filter(note => note.id !== id);
    this.render(); // Render ulang setelah menghapus data
  }
}

customElements.define('note-list', List);