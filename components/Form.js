class Form extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  connectedCallback(){
    this.render()
  }
  render() {
    this.innerHTML = `
    <link rel="stylesheet" href="styles/form.css">
        <form id="note-form">
            <div class="form-group">
            <h2>Tambahkan Catatan</h2>
            <section>
                <label for='titleNotes'>Judul Catatan</label>
                <input type="text" name="titleNotes" id="titleNotes" placeholder="Judul Catatan" required>
                <label for='noteBody'>Isi Catatan</label>
                <textarea id="noteBody" placeholder="isi catatan" required></textarea>
                <button>Simpan Catatan</button>
            </section>
            </div>
        </form>
    `;
  }
}

customElements.define("main-form", Form);
