class Footer extends HTMLElement {
    constructor() {
        super()
        this.render()
    }

    render(){
        this.innerHTML = `
            <link rel="stylesheet" href="styles/footer.css">
            <footer>
                <p>&copy; 2021 Notes App Irnanda</p>
            </footer>`
    }
}

customElements.define('footer-end', Footer)