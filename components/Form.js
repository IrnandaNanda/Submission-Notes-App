class Form extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    this.render();
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

  attachEventListener() {
    const form = this.querySelector('#note-form');
    form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
    const title = this.querySelector('#titleNotes').value;
    const body = this.querySelector('#noteBody').value;

    const newNote = {
      id: generateId(),
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    };

    const errorMessage = validateNote(title, body);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    addNote(newNote);


    this.querySelector('#titleNotes').value = '';
    this.querySelector('#noteBody').value = '';
    alert('Catatan berhasil ditambahkan!');
  }
}

customElements.define("main-form", Form);
export default Form;