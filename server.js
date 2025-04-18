const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Endpoint for investment insights
app.post('/api/investment-insight', (req, res) => {
    const { investmentType } = req.body;

    // Spawn a Python process to run the Hugging Face model
    const pythonProcess = spawn('python3', ['huggingface_model.py', investmentType]);

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.json({ message: result.trim() });
        } else {
            res.status(500).json({ message: 'Error generating investment insights.' });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});