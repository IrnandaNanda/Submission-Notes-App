class Navbar extends HTMLElement {
    constructor() {
        super()
        this.render()
    }

    render(){
        this.innerHTML = `
            <link rel="stylesheet" href="styles/navbar.css">
            <nav>
                <h2>Notes App</h2>
            </nav>
        `
    }
}

customElements.define('header-navbar', Navbar)