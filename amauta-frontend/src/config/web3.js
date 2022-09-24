import { newKitFromWeb3 } from "@celo/contractkit";
import Web3 from "web3";

const getLibrary = async (provider) => {
  const result = await provider.enable()
  return new Web3(provider), newKitFromWeb3(web3);
};
export { getLibrary };