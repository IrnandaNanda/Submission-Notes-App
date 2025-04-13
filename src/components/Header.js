class Navbar extends HTMLElement {
    constructor() {
        super()
        this.render()
    }

    render(){
        this.innerHTML = `
            <style>
    nav {
    /* background-color: #7bdff2; */
    color: #19c9ec;
    text-align: center;
    padding: 15px;
    font-size: 1.5em;
    font-weight: 300;
}
</style>
            <nav>
                <h2>Notes App</h2>
            </nav>
        `
    }
}

customElements.define('header-navbar', Navbar)