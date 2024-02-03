import { ArweaveSigner, getTokenTagByEver } from "arseeding-js";
import { createAndSubmitItem } from "arseeding-js/cjs/submitOrder.js";
import { payOrder, newEverpayByRSA } from "arseeding-js/cjs/payOrder.js";
import Everpay from "everpay";
import Arweave from "arweave";
import { Buffer } from "buffer";

const newLatestEverpayByRSA = (arJWK, arAddress) => {
  const everpay = new (Everpay?.default ?? Everpay)({
    account: arAddress,
    chainType: "arweave",
    arJWK: arJWK,
  });
  return everpay;
};

async function getOrder(wallet) {
  const signer = new ArweaveSigner(wallet);
  const options = { tags: [{ name: "Content-Type", value: "text/plain" }] };
  const data = Buffer.from("<need upload data, such as a picture>");
  const arseedUrl = "https://arseed.web3infra.dev";
  const tokenTag = (await getTokenTagByEver("AR"))[0];
  const config = {
    signer,
    path: "",
    arseedUrl,
    tag: tokenTag,
  };
  const order = await createAndSubmitItem(data, options, config);
  return order;
}

async function works(wallet, arAddress) {
  try {
    const order = await getOrder(wallet);
    const everpay = newLatestEverpayByRSA(wallet, arAddress);
    await payOrder(everpay, order);
  } catch (error) {
    console.log(`[works]: ${error}\n`);
  }
}

async function doesnotWork(wallet, arAddress) {
  try {
    const order = await getOrder(wallet);
    const everpay = newEverpayByRSA(wallet, arAddress);
    await payOrder(everpay, order);
  } catch (error) {
    console.log(`[doesnotWork]: ${error}\n`);
  }
}

(async () => {
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });
  const wallet = await arweave.wallets.generate();
  const arAddress = await arweave.wallets.getAddress(wallet);
  works(wallet, arAddress);
  doesnotWork(wallet, arAddress);
})();
