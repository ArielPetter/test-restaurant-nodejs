const express = require('express')
const uuid = require('uuid')
const port = 3000

const app = express();
app.use(express.json())

//ex: id: "ac3ebf68-e0ad-4c1d-9822-ff1b849589a8", order: "X- Salada, 2 batatas grandes, 1 coca-cola", clientName:"José", price: 44.50, status:"Em preparação" }

const users = []

const checkUserId = (request, response, next) => {
    const {id} = request.params
    const index = users.findIndex(user => user.id === id)

    if (index < 0){
        return response.status(404).json({error: 'User not found'})
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.get('/order', (request, response) => {
    return response.json(users)
})

app.post('/order', (request, response) => {
    const {order, clientName, price, status} = request.body
    const user = {id: uuid.v4(), order, clientName, price, status} 

    users.push(user)
    return response.status(201).json(user)
})

app.put('/order/:id', checkUserId, (request, response) => {
    const {order, clientName, price, status} = request.body
    const id = request.userId
    const index = request.userIndex
    const userUpdate = {id, order, clientName, price, status}

    users[index] = userUpdate

    return response.json(userUpdate)
})

app.delete('/order/:id', checkUserId, (request, response) => {
    const index = request.userIndex
    users.splice(index, 1)

    return response.status(204).json()
})

app.patch('/order/:id', checkUserId, (request, response) => {
    const index = request.userIndex
    const user = users[index]

    user.status = "Seu pedido está pronto"

    return response.json(user)
})

app.listen(port, () => {
    console.log(`👾 Server started on port ${port}`)
})