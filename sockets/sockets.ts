import SocketIO from 'socket.io';

export const desconectar = ( cliente: SocketIO.Socket ) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
    })
}

export const mensaje = ( cliente: SocketIO.Socket, io: SocketIO.Server ) => {
    cliente.on('mensaje', ( payload: { de: string, cuerpo: string }, callback ) => {
        console.log('Mensaje recibido', payload);
        io.emit('mensaje-nuevo', payload);
    })
}