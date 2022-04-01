import app from "./app";
import dotenv from 'dotenv';
import "reflect-metadata"
import './config/db';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));