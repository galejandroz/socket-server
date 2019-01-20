import SocketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = ( cliente: SocketIO.Socket ) => {
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );

    
}

export const desconectar = ( cliente: SocketIO.Socket, io: SocketIO.Server ) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuariosConectados.eliminarUsuario( cliente.id );
        io.emit('usuarios-activos', usuariosConectados.getLista() );
    })
}

export const mensaje = ( cliente: SocketIO.Socket, io: SocketIO.Server ) => {
    cliente.on('mensaje', ( payload: { de: string, cuerpo: string }, callback: Function ) => {
        console.log('Mensaje recibido', payload);
        io.emit('mensaje-nuevo', payload);
    })
}


export const configurarUsuario = ( cliente: SocketIO.Socket, io: SocketIO.Server ) => {
    cliente.on('configurar-usuario', ( payload: { nombre: string }, callback: Function ) => {
        
        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );

        io.emit('usuarios-activos', usuariosConectados.getLista() );

        callback( {
            ok: true,
            mensaje: `Usuario ${payload.nombre} configurado`
        } )
    })
}


export const obtenerUsuarios = ( cliente: SocketIO.Socket, io: SocketIO.Server ) => {
    cliente.on('obtener-usuarios', () => {        
        // to( cliente.id ) solo emite al cliente q lo solicita para no hacerlo a todos
        io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista() );

    })
}