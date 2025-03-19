
const db = await Deno.openKv();

// Ejemplo de uso de KV
// const users = "moropm";
// const result = await db.set(["username"], users);
// console.log(result);

// const usernmae = await db.get(["username"]);
// console.log(usernmae);


// ? deno run --unstable-kv main.ts  :: Mostrar en consola el valor de la variable counter

// const result = await db.set(["counter"], 0);
// const counter = await db.get(["counter"]);
// const { value } = await db.get<number>(["counter"]);
// console.log(value);
// const newConuter = value===null ? 0 : value + 1;

// const result = await db.set(["counter"], newConuter);
// console.log(result);


// -> Deno.KvU64

// await db.set(["visits"], new Deno.KvU64(0n)); // 0n -> bigint

// await db
//   .atomic() // Transacción: Para no perder datos y evitar errores (dulpisidad y exactitud)
//   .sum(["visits"], 1n) // Esperamos a que la transacción se complete para continuar
//   .commit();


// const result = await db.get<Deno.KvU64>(["visits"]);
// console.log( result );


// Crear objetos y guardarlos en la BD
/*
const preferences = {
  username: "moropm",
  theme: "dark",
  language: "es-ES",
};

const secondPreferences = {
  username: "perez",
  theme: "light",
  language: "en-US",
};

await db.set(["preferences", "default"], preferences);
await db.set(["preferences", "second"], secondPreferences);
*/

// Recuperar objetos de la BD
/** Recuperación individual de objetos
 * 
 */
// const defaultPreferences = await db.get(["preferences", "default"]);
// const secondPreferences = await db.get(["preferences", "second"]);

/** Recuperación de objetos en un array
 * 
 */
// const [
//   defaultPreferences,
//   secondPreferences,
// ] = await Promise.all([
//   db.get(["preferences", "default"]), // Esto esta mal ❌ : Se estarían realizando dos peticiones inecesarias
//   db.get(["preferences", "second"])
// ])

// Forma correcta ✅
// const [
//   defaultPreferences,
//   secondPreferences,
// ] = await db.getMany([
//   ["preferences", "default"],
//   ["preferences", "second"],
// ]);

// console.log(defaultPreferences);
// console.log(secondPreferences);


// Otra alternativa para recuperar objetos en un array
const entries = db.list({ prefix: ["preferences"] });
for await (const entry of entries) { // <- esto es JavaScript
  console.log(entry);
}

// Eliminar objetos de la BD
// await db.delete(["preferences", "default"]);


