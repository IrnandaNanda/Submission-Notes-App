import notesData from "../scripts/data/data.js";

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
      <style>
        .note-list {
    font-family: 'Winky Sans';
    display: grid;
    /* margin-top: 80px; */
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 10px;
}

.note-item{
    border: 1px solid #19c9ec;
    padding: 15px;
    border-radius: 5px;
    background: #f9f9f9;
}

h3 {
    font-size: 1.5em;
    font-weight: bold;
    color: #19c9ec;
    text-align: center;
}

p {
    font-size: 0.8em;
    color: black;
    text-align: center;
}

span {
    font-size: 0.8em;
    color: orange;
    text-align: center;
}

.note-actions {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
}

button {
    width: 20%;
    padding: 5px;
    background-color: #b2f7ef;
    color: black;
    border: 1px solid black;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Winky Sans';
    font-weight: bold;
}

button:hover {
    background-color: #73efe1;
}
      </style>
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
