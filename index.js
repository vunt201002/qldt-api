// index.js
import app from './src/app.js';
import {connect} from './src/database/connect.js';

const PORT = process.env.PORT || 3000;

connect();

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
