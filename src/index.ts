require("dotenv-safe").config();
import { app } from './app';
const port = process.env.PORT;

app.listen(port, () => {
    console.log('app is listening on ' + port);
})