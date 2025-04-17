import { validateNote } from "../scripts/data/utils.js";
import Swal from "sweetalert2";

const proses = document.querySelector(".loading")

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

      // Simulasi pengiriman data ke server
      try {
        proses.style.display = "block"
        const response = await fetch("https://notes-api.dicoding.dev/v2/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNote),
        })

        if(!response.ok) {
          Swal.fire({
            position: 'top-end',
            title: 'Error!',
            text: ErrorresponseJson.message,
            icon: 'error',
            confirmButton: 'false',
            timer: 1000
          })
          const ErrorresponseJson = await response.json()
          throw new Error("Gagal mengirim catatan ke server");
        } else {
          const responseJson = await response.json()
          Swal.fire({
            position: 'top-end',
            icon: "success",
            title: "Catatan berhasil ditambahkan",
            text: responseJson.message,
            showConfirmButton: false,
            timer: 1000
          })
        }
        proses.style.display = "none"
      }

      catch (error) {
        console.error("Error saat mengirim catatan:", error);
        return;
      }

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
