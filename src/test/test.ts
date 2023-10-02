import Gestjs from "../index";

const gestjs = new Gestjs();

async function main() {
  const testVar = await gestjs.versions()
  console.log("🚀 ~ file: test.ts:7 ~ main ~ testVar:", testVar)
}
await main();
