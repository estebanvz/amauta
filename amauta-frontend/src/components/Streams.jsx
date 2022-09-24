import React, { useEffect } from "react";

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import { Context } from "../config/context";
import { useState } from "react";
import ABI from "../contract/Marketplace_metadata.json";
import Blockies from "react-blockies";

const ERC20_DECIMALS = 18;

// const address = true;
const celoWallet =
  "https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh";
const MPContract = "0x6A3823C91521aDd2EFB09eEf0d8aC3AA973d58f8";
const abiMP = ABI.output.abi;

// import marketplaceAbi from '../contract/marketplace.abi.json'
let contract;
export default function Streams() {
  const { kit, web3, walletState, setWalletState, connectWallet } =
    React.useContext(Context);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getContract = async () => {
      const contract = new kit.web3.eth.Contract(abiMP, MPContract);
      let lenStreams = await contract.methods.readLength().call();
      let tmpStreams = [];
      for (let i = 0; i < lenStreams; i++) {
        let tmp = await contract.methods.readStream(i).call();
        tmpStreams.push(tmp);
      }
      setProducts(tmpStreams);
      console.log("Streams called");
      console.log(tmpStreams);
    };
    if (kit) {
      getContract();
    }
  }, [kit]);
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl my-4 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Current Streams
        </h2>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
          {products.map((product, index) => (
            <div key={index} className="group relative">
              <div className="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
                <div className="flex justify-center md:justify-end -mt-16">
                  <Blockies
                    className="w-40 h-40 object-cover rounded-full border-2 border-indigo-500"
                    seed={product.owner}
                  ></Blockies>
                </div>
                <div>
                  <h2 className="text-gray-800 text-3xl font-semibold">
                    {product.name}
                  </h2>
                  <h3 className="text-sm text-gray-700">{product.date}</h3>
                  <p className="mt-2 text-gray-600">{product.description}</p>
                </div>
                <div className="grid grid-cols-2 mt-4">
                  <p className="py-2 text-gray-600 text-sm">
                    Tickets {product.limit_people}
                  </p>
                  <button className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    {product.price / 10 ** 18} cUSD
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
