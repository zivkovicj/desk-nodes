const express = require('express');
const app = express();

module.exports = app;

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});