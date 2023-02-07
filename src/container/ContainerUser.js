import * as fs from 'fs'

class ContainerUsers{ 

    rout = 'D:/Users/Agustin/Desktop/segundoIntentoLogIn/src/DB/users.json'

    async getAll(){
        try {
            let leer = await fs.readFileSync(this.rout, "utf-8")
            let data = JSON.parse(leer)
            return JSON.stringify(data)
        } catch (error) {
            return error
        }
    }

    async getByMail(userEmail){
        try {
            let leer = await fs.readFileSync(this.rout, "utf-8")
            let data = JSON.parse(leer)
            let dataFind = data.find(usuario => usuario.email == userEmail)
            console.log(dataFind);
            return JSON.stringify(dataFind)
        } catch (error) {
            console.error(error)
        }
    }

    async save (user){
        try {
            let leer = await fs.readFileSync(this.rout, "utf-8")
            let data = JSON.parse(leer)
            console.log(data)
            data.push(user)
            console.log(data)
            await fs.writeFileSync(this.rout, JSON.stringify(data, null, 2), "utf-8")
            return JSON.stringify(data)
        } catch (error) {
            console.error(error);
        } 
    } 
}

export default ContainerUsers