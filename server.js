import express from 'express'
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config()
const app = express();
const port = 3000;
app.use(cors())
app.use(express.json())


const MONGODB_URI = "mongodb://localhost:27017/test"

mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/',userRoutes)

app.get('/', (req, res) => {
    res.send({
        baseUrl: "http://localhost:3000",
        routes: {
            GET: [
                {
                    route: "/allusers",
                    description: "Fetches list of all users and also show the number of total users"
                },
                {
                    route: "/search",
                    description: "Search for users based on query parameters.Name should be passed in query params"
                },
                {
                    route: "/filter",
                    description: "Filters users based on specific label provided in validation.There are three filters to choice which is (Friend , Family , Work)"
                },
                {
                    route: "/paginateduser",
                    description: "Fetches users in paginated form by passing page and limit in query params"
                }
            ],
            POST: [
                {
                    route: "/user",
                    description: "Creates a new user in the database. There are 5 fileds for adding users . Name , image , adress , label and contact in which name and contact are mandatory fields and contacts must be unique and of 10 digits"
                }
            ],
            PUT: [
                {
                    route: "/edituser/:id",
                    description: "Updates a user's details by their unique id sent in params.and bookmark will be updated by sending the toogleBookmark=true in query params which will help in togglinf of bookmark"
                },
                // {
                //     route: "/bookmark/:id",
                //     description: "Bookmarks a user by their unique id send in params."
                // }
            ],
            DELETE: [
                {
                    route: "/deleteusers/:id",
                    description: "Deletes a user by their unique id sent in params."
                }
            ]
        }
    });
});


app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)

})