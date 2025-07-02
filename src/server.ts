import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/todos', todoRoutes);

const PORT = Number(process.env.PORT) || 4001;

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
