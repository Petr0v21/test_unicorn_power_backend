import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import dbConnect from './dbConnect';
import authRoutes from './routes/auth';
import refreshTokenRoutes from './routes/refreshToken';
import user from './routes/users';

const app = express();
dotenv.config();

dbConnect();

app.use(express.json());
app.use(cors());

app.use('/api', authRoutes);
app.use('/api/refreshToken', refreshTokenRoutes);
app.use('/api/user', user);

app.get('/', async (req, res) => {
  try {
    res.send('auth');
  } catch (e) {
    throw e;
  }
});

const port = process.env.PORT || 4040;
app.listen(port, () => console.log(`Server is running on port: ${port}`));
