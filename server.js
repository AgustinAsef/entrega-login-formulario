import express, { Router } from 'express'
import session from 'express-session'
import exphbs from 'express-handlebars'
import path from 'path'
import dotenv from 'dotenv'
import MongoStore from 'connect-mongo'

dotenv.config()

const app = express()

// midelware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('views'))


//motor de plantillas
app.set('views', 'src/views')
app.engine('.html', exphbs.engine({
    defaultLayout: 'session', //se me renderiza el archivo que tengo puesto aca en vez del que pongo en el res.render
    layoutsDir: path.join(app.get('views')),
    extname: '.html'
}))
app.set('views engine', '.html')

//session
const sessionRout = new Router() 
app.use('/login', sessionRout)
/* const mongodb = { 
    cnxStr: 'mongodb+srv://admin:15741806@cluster0.7hch6pf.mongodb.net/ecomerceback?retryWrites=true&w=majority',
    options: { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }
} */

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.cnxStr
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 100000
    }
}))

//DB

const usuarios = [
    {
    name: 'pablo',
    lastName: 'rodrigez',
    pasword: 123,
    admin: true,
    count: 0
      }
]
//router y navegacion
sessionRout.get('/', (req, res) => {
    if (!req.session) {
        res.send('registrate o inicia sessions') //res.render(el formulario de ingreso)
    }else{
        req.session.count ++
        res.send(`bienvenido otra vez ${req.session.name}, ya haz visitado este sitio ${req.session.count} veces`)
        //res.redirect(datos personales del cliente)
        } 
})


sessionRout.post('/', (req,res )=>{
    const {userName , pasword} = req.body
    const dbUser = usuarios.find(usuario => usuario.name === userName && usuario.pasword === pasword)
    console.log(dbUser)
   if (!dbUser) {
        res.send("no se encontro el usuario, prueba ingresar tus datos correctamente o leguearte")
    }else{
        req.session.name= dbUser.name //no se por que me dice que los req.session. son parametros indefinidos
        req.session.pasword = dbUser.pasword
        req.session.count = dbUser.count
        req.session.isAdmin = dbUser.admin
        req.session.count ++
        res.send(`bienvenido otra vez ${req.session.name}, ya haz visitado este sitio ${req.session.count} vez`)
        //res.render de la pagina con la informacion del usuario
    }
})


sessionRout.post('/register', (req, res) => {
    const {userName, userLastName, pasword} = req.body
    let newUSer= {
            userName: userName,
            lastName: userLastName,
            pasword: pasword,
            admin: true,
            count: 0
    }
    usuarios.push(newUSer)
    res.send("login exitoso")//res.redirect(al login para iniciar la session)
})

sessionRout.delete('/logout', (req, res) =>{
    req.session.destroy(err =>{
        if (err) {
            req.send('se ha producido un error')
        }else{
            res.send('logout completado')
        }
    })
})


// servidor
const PORT = process.env.PORT

const server = app.listen(PORT,()=>{
    console.log(`EL PUERTO ${server.address().port} ESTA VIVOO!!`)
})
 
server.on('error', error => console.log(`ocurrio algo inersperado ${error}`))