
import express from "express";
import {config} from 'dotenv'
config();
import { database_connect } from "./src/db/connection.js";
import cors from 'cors';
import authcontroller from "./src/moduels/auth_moduels/auth_controller.js";
import usercontroller from "./src/moduels/user/user-controller.js";
import postcontroller from "./src/moduels/post-moduels/post-controller.js";
import commentcontroller from "./src/moduels/comment-moduels/comment-controller.js";
import reactscontroller from "./src/moduels/reacts/reacts-controller.js";
import{rateLimit} from 'express-rate-limit';
import{Server} from 'socket.io'
// import helmet from 'helmet';
import { establishIoConnection } from "./src/utils/socket-utils.js";
import { createHandler } from "graphql-http/lib/use/express";
import { mainSchema } from "./src/graphql/main-schema.js";
const limiter=rateLimit({
  windowMs:15 * 60 * 1000,
  limit:100,
  message:"too many requests , please try again later",
  legacyHeaders:false
})

    async function bootstrap() {
         
const whitelist = [process.env.front_end_url, undefined];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
        const app = express();
        app.use(express.json());
        app.use(cors(corsOptions));
        app.use(limiter);
        // app.use(helmet());
        app.use("/graphql",createHandler({schema:mainSchema}));
        app.use("/assets",express.static("assets"))
        app.use('/auth', authcontroller);
        app.use('/user', usercontroller);
        app.use('/post', postcontroller);
        app.use('/comment', commentcontroller);
        app.use('/react',reactscontroller);
        database_connect();

      const server =  app.listen(process.env.PORT, () => {
            console.log(`server is running on port ${process.env.PORT}`);
        });
        const io = new Server(server, {
          cors: {
            origin: '*'
          }
        })
        establishIoConnection(io);
        // io.on('connection',async (socket) => {



        //   // console.log('a user connected', socket.id);
        //   // console.log(socket.handshake);
          
        //   // socket.on("sendMessage",(data)=>{
        //     // console.log(data);

        // //     io.emit("receiveMessage","hello from backend");// هرد علي كلو
        // //  socket   .emit("receiveMessage","hello from backend");// هرد علي بعت بس
        // //  socket.broadcast.emit("receiveMessage","hello from backend");//  ماا عدا ال بعت هرد علي كلو

        // //   })

        // //   socket.join("room1");
        // //   io.to("room1").emit("receiveMessage","hello from backend");  //for ALL
        //   // io.except("room1").emit("receiveMessage","hello from backend");  //for ALL withot room1
        // })
 
      }
    
export default bootstrap;