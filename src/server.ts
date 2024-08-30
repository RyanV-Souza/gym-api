import { app } from "./app";

app.listen({
  port: 3000,
  host: '0.0.0.0'
}).then(() => {
  console.log('Server listening on port 3000');
})