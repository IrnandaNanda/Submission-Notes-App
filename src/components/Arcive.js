const baseUrl = "https://notes-api.dicoding.dev/v2";

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
    this.listenForArchivedNote();
  }

  listenForArchivedNote() {
    window.addEventListener("note-arcive", () => {
      this.render(); // Render ulang setelah catatan baru ditambahkan
    });
  }

  async deleteNote(id) {
    const response = await fetch(`${baseUrl}/notes/${id}`, {
      method: "DELETE",
    });

    // const responseJson = await response.json()
    if (response.status >= 200 && response.status < 300) {
      this.render();
    }
  }

  async unarciveNote(id) {
    try {
      const response = await fetch(`${baseUrl}/notes/${id}/unarchive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const responseJson = await response.json();
        console.log(responseJson.data);
      }
    } catch (error) {
      console.error("Error saat mengarsipkan catatan:", error);
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
            border: 1px solid #19c9ec;
            padding: 15px;
            border-radius: 5px;
            background: #f9f9f9;
        }
      </style>
      <ul class="note-list">
        ${notes
          .map(
            (note) => `
          <li class="note-item" id="${note.id}">
            <div>
              <h3>${note.title}</h3>
              <p>${note.body}</p>
            </div>
            <button class="delete-button" data-id="${note.id}">Delete</button>
            <button class="unarchive-button" data-id="${note.id}">Unarchive</button>
          </li>`
          )
          .join("")}
      </ul>`;

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
