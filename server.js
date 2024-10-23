const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route to render the index page
app.get('/', (req, res) => {
    res.render('index', { data: null, error: null });
});

// Endpoint to check URL with VirusTotal
app.post('/check-url', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.json({ error: 'URL is required' });
    }

    try {
        const response = await axios.get(`https://www.virustotal.com/vtapi/v2/url/report`, {
            params: {
                apikey: 'kdsjfdklsjfklsdjkfljklfjk395889475843758438953456493', // Replace with your actual API key
                resource: url,
            },
        });

        const data = response.data;

        // Extract relevant details
        const result = {
            resource: data.resource,
            last_analysis_date: new Date(data.scan_date * 1000).toLocaleString(),
            positives: data.positives,
            total: data.total,
            scans: data.scans,
            permalink: data.permalink,
            country: data.country || 'N/A',
            ip_address: data.ip || 'N/A',
            domain: data.domain || 'N/A',
            last_http_response_code: data.last_http_response_code || 'N/A',
            last_http_response: data.last_http_response || 'N/A'
        };

        res.json({ data: result });
    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        res.json({ error: 'Error checking URL, please try again.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
