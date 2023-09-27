import Gest from "../index";

const gest = new Gest();

async function main() {
  const v = await gest.version();
  console.log("🚀 ~ file: main.ts:7 ~ main ~ v:", v);
}
await main();
