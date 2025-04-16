import Swal from "sweetalert2";
import { animate, press } from "motion";


const baseUrl = 'https://notes-api.dicoding.dev/v2'
const proses = document.querySelector(".loading")
class List extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Ambil data dari localStorage atau gunakan default dari notesData
    this.notesData = async () => {
      const response = await fetch(`${baseUrl}/notes`)
      if(response.status >= 200 && response.status < 300) {
        const responseJson = await response.json()
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
    proses.style.display = "block"
    const response = await fetch(`${baseUrl}/notes/${id}`, {
      method: 'DELETE'
    })

    const responseJson = await response.json()
    Swal.fire({
      position: 'top-end',
      icon: "success",
      title: "Catatan berhasil dihapus",
      text: responseJson.status,
      showConfirmButton: false,
      timer: 1000
    })
    if(response.status >= 200 && response.status < 300) {
      this.render();
    } else {
      console.error("Error saat menghapus catatan:", responseJson.message);
      Swal.fire({
        position: 'top-end',
        title: 'Error!',
        text: responseJson.status,
        icon: 'error',
        confirmButton: 'false',
        timer: 1000
      })
    }
    proses.style.display = "none"
  }

  async arciveNote(id) {
    try{
      proses.style.display = "block"
      const response = await fetch(`${baseUrl}/notes/${id}/archive`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const responseJson = await response.json()
      if(response.status >= 200 && response.status < 300) {
        Swal.fire({
          position: 'top-end',
          icon: "success",
          title: "Catatan berhasil diarsipkan",
          text: responseJson.status,
          showConfirmButton: false,
          timer: 1000
        })
        window.dispatchEvent(new CustomEvent("note-archive"));
        this.render()
      } else {
        console.error("Error saat menghapus catatan:", responseJson.message);
        Swal.fire({
          position: 'top-end',
          icon: "error",
          title: 'Error!',
          text: responseJson.status,
          icon: 'error',
          confirmButton: 'false',
          timer: 1000
        })
      }
      proses.style.display = "none"
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

h2 {
    font-size: 2em;
    font-weight: bold;
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
      <h2>Notes</h2>
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
      press(button, (element) => {
        animate(element, { scale: 0.8 }, { type: "spring", stiffness: 1000 })
        return () =>
            animate(element, { scale: 1 }, { type: "spring", stiffness: 500 })
    })
    });
    this.shadowRoot.querySelectorAll('.arcive').forEach(button => {
      button.addEventListener('click', (e) => this.arciveNote(e.target.dataset.id));
      press(button, (element) => {
        animate(element, { scale: 0.8 }, { type: "spring", stiffness: 1000 })
        return () =>
            animate(element, { scale: 1 }, { type: "spring", stiffness: 500 })
    })
    })
  }
}

customElements.define("note-list", List);
export default List;
