import { app } from "./app";
import { env } from "./env";
console.log(env)
app.listen({
  port: env.PORT,
  host: '0.0.0.0'
}).then(() => {
  console.log('Server listening on port ' + env.PORT)
})