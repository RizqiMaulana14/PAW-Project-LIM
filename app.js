import express from 'express';
import 'dotenv/config';
import path from 'path';
import apiRoutes from './routes/apiRoutes.js';
import { getHome } from './controllers/apiControllers.js';

const __dirname = import.meta.dirname;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', getHome);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server LIM running on http://localhost:${PORT}`);
});
