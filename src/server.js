import express from 'express';
import path from 'path';

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static('./dist'));

app.get('/', (request, response) => {
  response.sendfile(path.join(__dirname, 'dist/index.html'));
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
