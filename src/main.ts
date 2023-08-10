import { app } from './app';
import  http from 'http';

const server = http.createServer(app);
server.listen(process.env.PORT);
server.on('listening', async () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}/docs `);
});