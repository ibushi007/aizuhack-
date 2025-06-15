const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const apiKey = 'cce1bac73b81afde50666a5778830228';
const city = 'otera,Fukushima,JP';

app.post('/api/calc-diff', async (req, res) => {
    let { userTemp } = req.body;
    userTemp = parseFloat(userTemp);
    if (isNaN(userTemp)) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (!data.main || typeof data.main.temp !== 'number') {
            return res.status(500).json({ error: 'Weather API error', data });
        }
        const temp = data.main.temp;
        const diff = Math.abs(temp - userTemp);
        res.json({ diff, temp });
    } catch (err) {
        res.status(500).json({ error: 'API error', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 