import { authantication_middelware } from "../middelware/authantication-middelware.js";



const socketConnections = new Map()

export const registerSocketId = async (handshake, id) => {
    // get loggedIn User data
    const accesstoken = handshake.auth.accesstoken

    // verify token
    const user = await authantication_middelware(accesstoken)

    // store socketId
    socketConnections.set(user?._id?.toString(), id)

    console.log('Socket connected', user?._id?.toString());

    return 'Socket connected successfully'
}


export const removeSocketId = async(socket) => {
    return socket.on('disconnect', async() => {
        // get loggedIn User data
        const accesstoken = socket.handshake.auth.accesstoken

        // verify token
        const user = await authantication_middelware(accesstoken)

        socketConnections.delete(user?._id?.toString())

        console.log('socket disconnected', user?._id?.toString());

        return 'socket disconnected successfully'
    })
}

export const establishIoConnection = (io) => {
    return io.on('connection', async(socket) => {

        // register socketId
        await registerSocketId(socket.handshake, socket.id)

        await removeSocketId(socket);
        console.log('socket disconnected', socketConnections);
    })
}