import { https } from 'firebase-functions';
import { spawn } from 'child_process';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res) => {
    const pythonProcess = spawn('python', ['../server.py']);

    pythonProcess.stdout.on('data', (data) => {
        res.send(data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

export const app = https.onRequest(app);