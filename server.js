const express = require('express');
const socket = require('socket.io');

const app = express();

let tasks =[];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', socket => {
    console.log('New client! Its id - ' + socket.id);

    io.to(socket.id).emit('updateData', tasks);

    socket.on('addTask', task => {
        tasks.push({id: task.id, name: task.name});
        socket.broadcast.emit('addTask', task);
    });

    socket.on('removeTask', id => {
        tasks = tasks.filter(task => task.id !== id)
        socket.broadcast.emit('removeTask', id);
    });
});