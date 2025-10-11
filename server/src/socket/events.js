import { addMessage } from "../services/message.service.js";

export const setupSocketEvents = (io) => {
 
    io.on('connections' , (socket)=>{
        console.log('user connected ', socket.id);

        socket.on('chat' , async(message) => {
            try{
                const groupId = message.groupId || message.channelId;
                if(!groupId){
                    socket.emit('error' , {message:'GroupId is required'});
                    return ;
                }
                const result = await addMessage({
                    text: message.text,
                    images: message.images || [],
                    channelId: groupId,
                    userId: message.userId
                });

                if(result.statusCode === '201'){
                    const broadcastMessage = {
                        ...message,
                        id: result.data?.id,
                        createdAt: result.data?.createdAt || new Date(),
                        groupId,
                        channelId: groupId
                    }
                    io.to(groupId).emit('chat', broadcastMessage);
                    console.log('Message broadcasted to room: ', groupId);
                }
                else {
                    console.error('Failed to save message: ', result);
                    socket.emit('error', {message: 'Failed to save message'});
                }
                
            }
            catch (error){
                console.error('Error handling chat: ',error);
                socket.emit('error', { 
                    message: 'Failed to save message',
                    error: error.message
                });
            }
        });
        
        socket.on('join-group', (groupId) =>{
            socket.join(groupId);
            console.log(`Socket ${socket.id} joined group ${groupId}`);
            socket.emit('joined-group',{groupId});
        });

        socket.on('leave-group', (groupId) =>{
            socket.leave(groupId);
            console.log(`Socket ${socket.id} left group ${groupId}`);
            socket.emit('left-group',{groupId});
        });

        socket.on('typing', (data) =>{
            socket.to(data.groupId).emit('user-typing',{
                userId: data.userId,
                username: data.username,
                groupId: data.groupId
            });
        });

        socket.on('stop-typing', (data) =>{
             socket.to(data.groupId).emit('user-stop-typing',{
                userId: data.userId,
                groupId: data.groupId
            });
        });

        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
        });
    });
};