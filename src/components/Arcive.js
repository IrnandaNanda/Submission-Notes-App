import Swal from "sweetalert2";

const baseUrl = "https://notes-api.dicoding.dev/v2";
const proses = document.querySelector(".loading")

class archive extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.notesData = async () => {
      const response = await fetch(`${baseUrl}/notes/archived`);
      if (response.status >= 200 && response.status < 300) {
        const responseJson = await response.json();
        return responseJson.data;
      }
    };
  }
  connectedCallback() {
    this.render();
    this.listenForNewArchived();
  }

  listenForNewArchived() {
    window.addEventListener("note-archive", () => {
      this.render(); // Render ulang setelah catatan baru ditambahkan
    });
  }

  async deleteNote(id) {
    proses.style.display = "block"
    const response = await fetch(`${baseUrl}/notes/${id}`, {
      method: "DELETE",
    });

    // const responseJson = await response.json()
    const responseJson = await response.json();
    if (response.status >= 200 && response.status < 300) {
            Swal.fire({
              position: 'top-end',
              icon: "success",
              title: "Catatan berhasil dihapus",
              text: responseJson.status,
              showConfirmButton: false,
              timer: 1000
            })
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

  async unarciveNote(id) {
    try {
    proses.style.display = "block"
      const response = await fetch(`${baseUrl}/notes/${id}/unarchive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseJson = await response.json();
      if (response.status >= 200 && response.status < 300) {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Catatan berhasil dipulihkan",
            text: responseJson.status,
            showConfirmButton: false,
            timer: 1500,
        })
        window.dispatchEvent(new CustomEvent("note-added"));
        this.render()
      }
      proses.style.display = "none"
    } catch (error) {
      console.error("Error saat mengarsipkan catatan:", error);
              Swal.fire({
                position: 'top-end',
                icon: "error",
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButton: 'false',
                timer: 1000
              })
    }
  }
  async render() {
    const notes = await this.notesData();
    this.shadowRoot.innerHTML = `
      <style>
        .note-list {
            list-style-type: none;
            padding: 0;
            font-family: 'Winky Sans';
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-gap: 10px;
        }
        .note-item {
            border: 1px solidrgb(104, 186, 202);
            padding: 15px;
            border-radius: 5px;
            background:rgb(137, 167, 168);
        }
        .button-container {
            display: flex;
            justify-content: space-between;
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
        h2 {
            font-size: 2em;
            font-weight: bold;
            text-align: center;
        }
        h3 {
            font-size: 1.5em;
            font-weight: bold;
            color: black;
            text-align: center;
        }
      </style>
        <h2>Archived Notes</h2>
      <div class="note-list">
        ${notes
          .map(
            (note) => `
          <div class="note-item" id="${note.id}">
            <h3>${note.title}</h3>
            <p>${note.body}</p>
            <span>${new Date(note.createdAt).toLocaleString()}</span>
            <div class="button-container">
                <button class="delete-button" data-id="${note.id}">Delete</button>
                <button class="unarchive-button" data-id="${note.id}">Unarchive</button>
            </div>
          </div>`
          )
          .join("")}
      </div>`;

      this.shadowRoot
      .querySelectorAll(".delete-button")
      .forEach((button) => {
        button.addEventListener("click", (event) => {
          const id = event.target.dataset.id;
          this.deleteNote(id);
        });
      });
    this.shadowRoot.querySelectorAll('.unarchive-button').forEach((button) => {
        button.addEventListener('click', (event) => this.unarciveNote(event.target.dataset.id))
    })
  }
}

customElements.define("archive-notes", archive);
export default archive;
