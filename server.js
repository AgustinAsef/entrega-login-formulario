import express, { Router } from 'express'
import session from 'express-session'
import exphbs from 'express-handlebars'
import path from 'path'
import dotenv from 'dotenv'
import MongoStore from 'connect-mongo'
import ContainerUsers from "./src/container/ContainerUser.js"

dotenv.config()

const app = express()

// midelware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('views'))


//motor de plantillas
app.set('views', 'src/views')
app.engine('.html', exphbs.engine({
    defaultLayout: 'userData', //se me renderiza el archivo que tengo puesto aca en vez del que pongo en el res.render
    layoutsDir: path.join(app.get('views')),
    extname:'.html'
}))
app.set('views engine', '.html')

//session
const sessionRout = new Router() 
app.use('/login', sessionRout)

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

const userDB = new ContainerUsers()

//DB

const usuarios = [
    {
        userName:'pablo',
        userLastName: 'rodrigez',
        userEmail: 'pablitor@gmail.com',
        pasword: "123",
        admin: true,
        count: 0
      }
]
//router y navegacion
sessionRout.get('/', (req, res) => {
    if (!req.session.userEmail) {
        res.render("login.html")
    }else{
        res.redirect('/login/userData')
        } 
})


sessionRout.post('/', (req,res )=>{
    const {userEmail , userPasword} = req.body
    console.log(userEmail , userPasword)
    const dbUser = userDB.getByMail(userEmail)
    if (dbUser.pasword == userPasword) {
            req.session.userName= dbUser.userName //no se por que me dice que los req.session. son parametros indefinidos
            req.session.userLastName = dbUser.userLastName
            req.session.userEmail = dbUser.userEmail
            req.session.isAdmin = dbUser.admin 
            req.session.count = dbUser.count
            res.redirect('/login/userData')    }
        else{
            res.render('loginError.html')
        }
    })

sessionRout.get('/userData', (req, res) => {
    if (!req.session.userEmail) {
        res.render('loginError.html')
    } else {
        const {userEmail} = req.body
        const userData = userDB.getByMail(usuario =>{return usuario.userEmail === userEmail})
        res.render('userData.html',{
            userData : userData
    })}
})

sessionRout.get('/register', (req, res) => {
    res.render('newUserForm.html')
})

sessionRout.post('/register', (req, res) => {
    const {userEmail ,userName, userLastName, userPasword} = req.body
    let newUSer= {
            nombre:userName,
            apellido: userLastName,
            email: userEmail,
            contraseña: userPasword,
    }
    console.log(userDB.save(newUSer))
    res.redirect("/login")
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