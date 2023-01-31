const usuarioApi = {
    get: () => {
        return fetch('/session/login')
            .then(data => console.log(data))
    },
    post: (name, pasword) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: name, pasword
        }
        return fetch('/session/login', options, console.log('esto es un post'))
    }
}

function actualizarUsuario(User) {
    return usuarioApi.get()
    .then(user => formLogInner(user))
}

function formLogInner(user) {
    if (user) {
        document.getElementById().innerHTML = `bienvenido ${user.name}, has ingresado a esta pagina ${user.count} veces.` 
    } else {
        document.getElementById().innerHTML = `
            <form method="post" id="postUSerForm">
                <div>
                    <input type="text" placeholder="nombre" id="name" required>
                    <input type="text" placeholder="contraseña" id="pasword">
                    <button id="submitUserButton">enviar</button>
                </div>
            </form>`        
    }
}

const newUser =  document.getElementById("postUSerForm")
newUser.addEventListener('submit', e =>{
    e.preventDefault()
    let name = document.getElementById('name')
    let pasword = document.getElementById('pasword')
    usuarioApi.post(name, pasword)
})