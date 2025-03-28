import notesData from "../scripts/data.js"

class List extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="styles/notes-list.css">
    
    <div class="note-list">
        ${notesData.map(item => `
            <div class="note-item">
                <h3>${item.title}</h3>
                <p>${item.body}</p>
                <span>${item.createdAt}</span>
            </div>
        `).join('')}
    </div>`
  }
}

customElements.define('note-list', List)