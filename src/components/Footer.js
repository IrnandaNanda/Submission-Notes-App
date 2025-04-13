class Footer extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = `
            <style>
    footer {
    margin-top: 20px;
    color: black;
    text-align: center;
    padding: 15px;
    font-size: 1em;
    font-weight: 300;
}
</style>
            <footer>
                <p>&copy; 2025 Notes App Irnanda</p>
            </footer>`;
  }
}

customElements.define("footer-end", Footer);
