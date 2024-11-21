import express from 'express';
import rideRoutes from './routes/ride.routes';
require('dotenv').config();

const app = express();
const port = 8080;

app.use(express.json());

app.use('/ride', rideRoutes)

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})