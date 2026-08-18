const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/sync-scores', (req, res) => {
    console.log('Received synced scores:', req.body);
    res.status(200).json({ message: 'Scores synced successfully', data: req.body });
});

app.listen(PORT, () => {
    console.log(`Sahayak backend simulator listening on port ${PORT}`);
});
