import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts"
import { serveStatic } from "https://deno.land/x/hono@v4.3.11/middleware.ts"
import { streamSSE } from "https://deno.land/x/hono@v4.3.11/helper/streaming/index.ts"

const db = await Deno.openKv();

const app = new Hono()
let i = 0

interface LastVist {
  city: string,
  country: string,
  flag: string,
}

app.get('/',  serveStatic({ path: './index.html' }))

app.post('/counter', async (c) => {
  await db
    .atomic()
    .sum(["visits"], 1n)
    .commit();
  return c.json({ mwss: "ok" })

  // ? Prueba desde terminal con curl en Windows
  // curl.exe -X POST http://localhost:8000/counter
})
app.get('/counter', (c) => {
  return streamSSE(c, async (stream) => {
    const visitKey = ["visits"]
    const listOfKeysToWatch = [visitKey]
    const watcher = db.watch(listOfKeysToWatch)
    for await (const entry of watcher) {
      const { value } = entry[0]
      if(value !== null) {
        await stream.writeSSE( { data: value.toString(), event: 'update', id: String(i++) })
      }
    }
    // while (true) {
    //   const { value } = await db.get(["visits"])
    //   await stream.writeSSE( { data: Number(value).toString(), event: 'update', id: String(i++) })
    //   await stream.sleep(1000) // delay 1 segundo

    //   // const message = `Son las ${new Date().toLocaleTimeString()}`
    //   // await stream.writeSSE( { data: message, event: 'update', id: String(i++) })
    //   // await stream.sleep(1000) // delay 1 segundo
    // }
  })
})


app.post('/visit', async (c) => {
  const { city, country, flag } = await c.req.json<LastVist>()
  await db
    .atomic()
    .set(["lastVisit"], { city, country, flag })
    .sum(["visits"], 1n)
    .commit();
  return c.json({ mwss: "ok" })

  // ? Prueba desde terminal con curl en Windows
  // curl.exe -X POST http://localhost:8000/counter
})
app.get('/visit', (c) => {
  return streamSSE(c, async (stream) => {
    const watcher = db.watch([["lastVisit"]])
    for await (const entry of watcher) {
      const { value } = entry[0]
      if(value !== null) {
        await stream.writeSSE( { data: JSON.stringify(value), event: 'lastvisit', id: String(i++) })
      }
    }
  })
})

Deno.serve(app.fetch)


// Comando para ejecutar el servidor
// deno run --unstable-kv --allow-net --allow-read --watch main.ts