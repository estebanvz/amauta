import React from "react";
import Blockies from "react-blockies";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { newKitFromWeb3 } from "@celo/contractkit";
import ABI from "../contract/Marketplace_metadata.json";
import { Context } from "../config/context";

const ERC20_DECIMALS = 18;

// const address = true;
const celoWallet =
  "https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh";
const MPContract = "0x6A3823C91521aDd2EFB09eEf0d8aC3AA973d58f8";
const abiMP = ABI.output.abi;

export default function Navbar() {
  const { kit, web3, walletState, setWalletState, connectWallet } =
    React.useContext(Context);
  const [address, setAddress] = React.useState(null);
  const [balance, setBalance] = React.useState(null);

  React.useEffect(() => {
    const connection = async () => {
      const totalBalance = await kit.getTotalBalance(kit.defaultAccount);
      const cUSDBalance = totalBalance.cUSD
        .shiftedBy(-ERC20_DECIMALS)
        .toFixed(2);
      setBalance(cUSDBalance);
    };
    if (kit) connection();
  }, [kit]);
  return (
    <div>
      <header>
        <nav className="shadow">
          <div className="flex justify-between items-center py-6 px-10 container mx-auto">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-tr from-indigo-600 to-green-600 bg-clip-text text-transparent hover:cursor-pointer">
                CRYPTO AMAUTA
              </h1>
            </div>

            <div>
              <div className="hover:cursor-pointer sm:hidden">
                <span className="h-1 rounded-full block w-8 mb-1 bg-gradient-to-tr from-indigo-600 to-green-600"></span>
                <span className="h-1 rounded-full block w-8 mb-1 bg-gradient-to-tr from-indigo-600 to-green-600"></span>
                <span className="h-1 rounded-full block w-8 mb-1 bg-gradient-to-tr from-indigo-600 to-green-600"></span>
              </div>
              <div className="flex items-center">
                {/* <ul className="sm:flex space-x-4 hidden items-center">
                                    <li><a href="#" className="text-gray-700 hover:text-indigo-600 text-md ">Home</a></li>
                                    <li><a href="#" className="text-gray-700 hover:text-indigo-600 text-md ">About</a></li>
                                    <li><a href="#" className="text-gray-700 hover:text-indigo-600 text-md ">Services</a></li>
                                    <li><a href="#" className="text-gray-700 hover:text-indigo-600 text-md ">Products</a></li>
                                    <li><a href="#" className="text-gray-700 hover:text-indigo-600 text-md ">Contact</a></li>
                                </ul> */}
                {walletState != -1 && (
                  <div className="md:flex items-center hidden space-x-4 ml-8 lg:ml-12">
                    {walletState == 0 ? (
                      <button
                        onClick={() => window.open(celoWallet, "_blank")}
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm 
                                            font-medium text-red-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Install Celo Wallet
                      </button>
                    ) : walletState == 1 ? (
                      <button
                        onClick={connectWallet}
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Connect Celo Wallet
                      </button>
                    ) : (
                      <>
                        <p className="text-left ...">{balance}</p>
                        <p className="text-left ...">cUSD</p>
                        <p className="text-left ...">{address}</p>
                        <div>
                          {kit &&
                            <Blockies seed={kit.defaultAccount}></Blockies>
                          }
                        </div>
                      </>
                    )}
                    {/* <h1 className="text-text-gray-600  py-2 hover:cursor-pointer hover:text-indigo-600">LOGIN</h1> */}
                    {/* <h1 className="text-text-gray-600  py-2 hover:cursor-pointer px-4 rounded text-white bg-gradient-to-tr from-indigo-600 to-green-600 hover:shadow-lg">SIGNUP</h1> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
