const express = require ('express')
const session = require ('express-session')
const FileStore = require ('session-file-store')(session)
const { Router } = express

const app = express()

const sessionRout = new Router() 
const MongoStore = require('connect-mongo')

const mongodb = { 
    cnxStr: 'mongodb+srv://admin:15741806@cluster0.7hch6pf.mongodb.net/ecomerceback?retryWrites=true&w=majority',
    options: { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }
}

app.use(session({
    store: MongoStore.create({
        mongoUrl: mongodb.cnxStr
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 100000
    }
}))

sessionRout.get('/', (req, res) => {
    if (req.session.count) {
    req.session.count ++
    res.send(`bienvenido otra vez ${req.session.usuario}, ya haz visitado este sitio ${req.session.count} veces`)
    }else{
        res.send('debes loguearte en /login') 
        }
})

sessionRout.post('/login', (req, res) => {
   const {username , pasword} = req.body
    req.session.usuario = username
    req.session.pasword = pasword
    req.session.count = 1
    req.session.admin = true
    console.log(req.session.usuario, req.session.pasword, req.session.count, req.session.admin)
    res.send("login exitoso")
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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('views'))

 app.use('/session', sessionRout)

 const PORT = 8090

 const server = app.listen(PORT,()=>{
     console.log(`EL PUERTO ${server.address().port} ESTA VIVOO!!`)
 })
 
 server.on('error', error => console.log(`ocurrio algo inersperado ${error}`))