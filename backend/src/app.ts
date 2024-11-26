import express from 'express';
import rideRoutes from './routes/ride.routes';
import sequelize from './config/db';
require('dotenv').config();
import cors from 'cors';

const app = express();
const port = 8080;

app.use(cors());

app.use(express.json());

app.use('/ride', rideRoutes)

sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Error connecting to the database:', err));

sequelize.sync({ force: false }) // Altere para `force: true` se quiser recriar as tabelas
  .then(() => console.log('Database synchronized'))
  .catch((err) => console.error('Error syncing database:', err));


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})