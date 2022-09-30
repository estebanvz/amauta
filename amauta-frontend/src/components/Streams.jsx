import React, { useEffect } from "react";
import BigNumber from "bignumber.js";
import { Context } from "../config/context";
import { useState } from "react";
import Blockies from "react-blockies";
import moment from "moment";
const ERC20_DECIMALS = 18;

// const address = true;
const celoWallet =
  "https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh";

// import marketplaceAbi from '../contract/marketplace.abi.json'
export default function Streams() {
  const {
    kit,
    web3,
    contract,
    walletState,
    cCUSD,
    update,
    setUpdate,
    MPContract,
    setWalletState,
    setContract,
    connectWallet,
  } = React.useContext(Context);
  const [products, setProducts] = useState([]);
  const [loading, setloading] = useState(false);
  const buyStream = async (index) => {
    setloading(true);
    try {
      let validation = await cCUSD.methods
        .approve(MPContract, products[index].price)
        .send({ from: kit.defaultAccount });
      let tmp = await contract.methods
        .buyStreams(index)
        .send({ from: kit.defaultAccount });
      setUpdate(update + 1);
    } catch (error) {}
    setloading(false);
  };
  const getContract = async () => {
    let tmpMyStreams = await contract.methods.getMyStreams().call();
    let lenStreams = await contract.methods.readLength().call();
    let tmpStreams = [];
    console.log("####");
    console.log(tmpMyStreams);
    console.log("####");
    for (let i = 0; i < lenStreams; i++) {
      if (tmpMyStreams.includes(String(i))) continue;
      let tmp = await contract.methods.readStream(i).call();
      // if(tmp.owner !== kit.defaultAccount || tmp.ticks){
      tmpStreams.push(tmp);
      // }
    }
    setProducts(tmpStreams);
    console.log("Streams called");
    console.log(tmpStreams);
  };
  useEffect(() => {
    if (kit) {
      getContract();
    }
  }, [kit, update]);

  return (
    <div className="bg-white">
      <div className=" mx-auto max-w-2xl my-4 px-6 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl  my-6 text-center font-bold tracking-tight text-gray-900">
          Current Streams
          <div className="inline-block ml-2">
            <button className=" peer inline-block peer rounded-full border-2 border-gray-400  w-6 h-6 text-sm text-gray-500">
              ?
            </button>
            <div className="absolute peer-hover:inline-flex hidden">
              <p className=" right-48 top-10 w-40 text-gray-300 text-xs mb-5 relative bg-black bg-opacity-90 rounded-xl p-4 m-1 z-10">
                These are private Streams. If you want to enter to them you have
                to pay some quantity of cUSD.
              </p>
            </div>
          </div>
        </h2>

        <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product, index) => (
            <div key={index} className="group relative">
              <div className="max-w-md h-full py-4 px-1 bg-white shadow-lg rounded-lg  ">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-60 pb-10 shadow-xs rounded-t-lg"
                />
                <div className="flex justify-center md:justify-end -mt-16">
                  <Blockies
                    size={10}
                    className="w-40 h-40 object-cover rounded-full border-2 border-indigo-500"
                    seed={product.owner}
                  ></Blockies>
                </div>
                <div>
                  <h2 className="text-gray-800 text-3xl font-semibold">
                    {product.name}
                  </h2>

                  {product.date && (
                    <h3 className="text-sm text-gray-700">
                      {moment(product.date)
                        .format("MM/DD/yy hh:mm A")
                        .toString()}
                    </h3>
                  )}

                  <p className="mt-2 text-gray-600 h-28 text-ellipsis overflow-y-auto ">
                    {product.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 mt-4">
                  <p
                    className={`py-2 ${
                      product.limit_people > 2
                        ? "text-gray-600"
                        : "text-red-700 animate-pulse"
                    } text-sm`}
                  >
                    Tickets {product.limit_people}
                  </p>
                  {product.owner == kit.defaultAccount ? (
                    <button className="inline-flex bg-gray-100 justify-center items-center rounded-md border border-gray-300 px-2 py-2 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      Owner
                    </button>
                  ) : loading ? (
                    <button className="inline-flex bg-gray-100 justify-center items-center rounded-md border border-gray-300 px-2 py-2 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="animate-spin">|</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => buyStream(index)}
                      className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {BigNumber(product.price)
                        .shiftedBy(-ERC20_DECIMALS)
                        .toString()}{" "}
                      cUSD
                    </button>
                  )}
                  {}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
