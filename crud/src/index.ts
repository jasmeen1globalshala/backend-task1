// Import the 'express' module
import express,{Request,Response} from 'express';
import bodyParser from "body-parser";
import router from "./routes";
// import { addCourse } from "./controllers/courseController";
import cors from "cors";
// Create an Express application
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", router);
// Set the port number for the server
const port = 3000;
// Routesapp.post("/add-course",(req,res)=>{addCourse(req,res)} );
// // Define a route for the root path ('/')
app.get('/', (req:Request, res:Response):void => {
  // Send a response to the client
  res.send('Hello, TypeScript + Node.js + Express!');
});

// Start the server and listen on the specified port
app.listen(port, ():void => {
  // Log a message when the server is successfully running
  console.log(`Server is running on ${port}`);
});