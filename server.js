const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// OpenAI API setup
const configuration = new Configuration({
    apiKey: 'your-openai-api-key', // Replace with your OpenAI API key
});
const openai = new OpenAIApi(configuration);

// Endpoint for investment insights
app.post('/api/investment-insight', async (req, res) => {
    const { investmentType } = req.body;

    try {
        const aiResponse = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Provide detailed investment insights, current news, and a recommendation (buy/sell) for ${investmentType}.`,
            max_tokens: 150,
        });

        res.json({ message: aiResponse.data.choices[0].text.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching investment insights.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});