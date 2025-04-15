// import notesData from "../scripts/data/data.js";

const baseUrl = 'https://notes-api.dicoding.dev/v2'
class List extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Ambil data dari localStorage atau gunakan default dari notesData
    this.notesData = async () => {
      const response = await fetch(`${baseUrl}/notes`)
      if(response.status >= 200 && response.status < 300) {
        const responseJson = await response.json()
        console.log(responseJson.data)
        return responseJson.data
      }
    }
  }

  connectedCallback() {
    this.render();
    this.listenForNewNote();
  }

  listenForNewNote() {
    window.addEventListener("note-added", () => {
      this.render(); // Render ulang setelah catatan baru ditambahkan
    });
  }

  // addNote(note) {
  //   this.notesData.push(note);
  //   localStorage.setItem("notes", JSON.stringify(this.notesData)); // Update localStorage
  //   this.render();
  // }

  async deleteNote(id) {
    const response = await fetch(`${baseUrl}/notes/${id}`, {
      method: 'DELETE'
    })

    // const responseJson = await response.json()
    if(response.status >= 200 && response.status < 300) {
      this.render();
    }

  }

  async arciveNote(id) {
    try{
      const response = await fetch(`${baseUrl}/notes/${id}/archive`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if(response.status >= 200 && response.status < 300) {
        const responseJson = await response.json()
        window.dispatchEvent(new CustomEvent("note-archive"));
        this.render()
      }

    } catch(error) {
      console.error("Error saat mengarsipkan catatan:", error);
      return;
    }
  } 

  async render() {
    const notes = await this.notesData();

    this.shadowRoot.innerHTML = `
      <style>
        .note-list {
    font-family: 'Winky Sans';
    display: grid;
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
        ${notes.map((item) => `
          <div class="note-item">
            <h3>${item.title}</h3>
            <p>${item.body}</p>
            <span>${new Date(item.createdAt).toLocaleString()}</span>
            <div class="note-actions">
            <button class="arcive" data-id="${item.id}">Arcive</button>
              <button class="delete" data-id="${item.id}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    this.shadowRoot.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', (e) => this.deleteNote(e.target.dataset.id));
    });
    this.shadowRoot.querySelectorAll('.arcive').forEach(button => {
      button.addEventListener('click', (e) => this.arciveNote(e.target.dataset.id));
    })
  }
}

customElements.define("note-list", List);
export default List;
