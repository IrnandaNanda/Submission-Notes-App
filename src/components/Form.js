import { validateNote } from "../scripts/data/utils.js";

class Form extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    this.render();
    this.addSubmitEvent();
  }

  addSubmitEvent() {
    const form = this.querySelector("#note-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = this.querySelector("#titleNotes").value.trim();
      const body = this.querySelector("#noteBody").value.trim();

      validateNote(title, body);

      const newNote = {
        title,
        body,
      };

      console.log("Mengirim event note-added:", newNote);
      // Simulasi pengiriman data ke server
      try {
        const response = await fetch("https://notes-api.dicoding.dev/v2/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNote),
        })
      }

      catch (error) {
        console.error("Error saat mengirim catatan:", error);
        return;
      }

      // Simpan ke localStorage
      // const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
      // storedNotes.push(newNote);
      // localStorage.setItem("notes", JSON.stringify(storedNotes));

      // Dispatch event agar List.js menangkapnya
      window.dispatchEvent(new CustomEvent("note-added", { detail: newNote }));

      form.reset();
    });
  }

  render() {
    this.innerHTML = `
      <style>
    label {
    display: block;
    font-weight: bold;
}

input, textarea {
    width: 80%;
    padding: 10px;
    border: 2px solid #b2f7ef;
    border-radius: 5px;
}

button {
    display: block;
    width: 80%;
    padding: 10px;
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

form {
    display: flex;
    /* width: 80%; */
    justify-content: center;
    align-items: center;
    /* background-color: red; */
}
</style>
      <form id="note-form">
          <div class="form-group">
          <h2>Tambahkan Catatan</h2>
          <section>
              <label for='titleNotes'>Judul Catatan</label>
              <input type="text" name="titleNotes" id="titleNotes" placeholder="Judul Catatan" required>
              <label for='noteBody'>Isi Catatan</label>
              <textarea id="noteBody" placeholder="Isi catatan" required></textarea>
              <button type="submit">Simpan</button>
          </section>
          </div>
      </form>
    `;
  }
}

customElements.define("main-form", Form);
export default Form;
