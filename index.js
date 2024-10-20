import app from './src/app.js';
import {connect, reSync} from './src/database/connect.js';
import {setupAssociations} from './src/model/association.js';

const PORT = process.env.PORT || 3000;

connect();
setupAssociations();
reSync();

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
