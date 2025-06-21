const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const apiKey = 'cce1bac73b81afde50666a5778830228';
const city = 'otera,Fukushima,JP';

app.post('/api/calc-diff', async (req, res) => {
    console.log('Received request:', req.body);
    
    let { userTemp } = req.body;
    userTemp = parseFloat(userTemp);
    if (isNaN(userTemp)) {
        console.error('Invalid input:', req.body);
        return res.status(400).json({ error: 'Invalid input' });
    }
    
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    console.log('Fetching weather data from:', apiUrl);
    
    try {
        const response = await fetch(apiUrl);
        console.log('Weather API response status:', response.status);
        
        const data = await response.json();
        console.log('Weather API response data:', data);
        
        if (!data.main || typeof data.main.temp !== 'number') {
            console.error('Weather API error:', data);
            return res.status(500).json({ error: 'Weather API error', data });
        }
        
        const temp = data.main.temp;
        const diff = Math.abs(temp - userTemp);
        console.log('Calculation result:', { userTemp, temp, diff });
        
        res.json({ diff, temp });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: 'API error', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 