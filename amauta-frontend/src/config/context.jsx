import React, { useState } from "react";
import { newKitFromWeb3 } from "@celo/contractkit";
import Web3 from "web3";
import ABI from "../contract/Marketplace_metadata.json";
import ABICUSD from "../contract/IERC20Token_metadata.json";

export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
  const MPContract = "0x43E99EEADcE685eC8207F8506e144b45A57cE35F";
  const cUSD = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  const abicCUSD = ABICUSD.output.abi;
  const abiMP = ABI.output.abi;
  const [update, setUpdate] = useState(0);
  const [web3, useWeb3] = useState(null);
  const [kit, useKit] = useState(null);
  const [contract, setContract] = useState(null);
  const [cCUSD, setCUSD] = useState(null);
  const [walletState, setWalletState] = useState(-1); // 0: no celo wallet, 1: celo wallet installed, 2: celo wallet connected
  const connectWallet = async (provider) => {
    if (provider) {
      try {
        const result = await provider.enable();
        const tmpWeb3 = new Web3(provider);
        const tmpkit = newKitFromWeb3(tmpWeb3);
        console.warn("Antes");
        console.warn(kit);
        console.warn("Despues");
        console.warn(kit);
        console.warn(tmpkit);
        const accounts = await tmpkit.web3.eth.getAccounts();
        tmpkit.defaultAccount = accounts[0];
        setContract(new tmpkit.web3.eth.Contract(abiMP, MPContract));
        setCUSD(new tmpkit.web3.eth.Contract(abicCUSD, cUSD));
        setWalletState(2);
        useWeb3(tmpWeb3);
        useKit(tmpkit);
      } catch (error) {
        setWalletState(1);
        console.warn(`⚠️ ${error}.`);
      }
    } else {
      setWalletState(0);
    }
  };
  const connection = async () => {
    await connectWallet(window.celo);
  };
  React.useEffect(() => {
    connection();
  }, []);

  React.useEffect(() => {
    if (window.celo) {
      window.celo.on("chainChanged", () => {
        window.location.reload();
        // connection().then(
        //   setUpdate(update+1)
        // );
      });
      window.celo.on("accountsChanged", () => {
        window.location.reload();
        // connection().then(
        //   setUpdate(update+1)
        // );
      });
    }
  });
  return (
    <Context.Provider
      value={{
        kit,
        web3,
        contract,
        walletState,
        cCUSD,
        update,
        MPContract,
        setUpdate,
        setWalletState,
        setContract,
        connectWallet,
      }}
    >
      {children}
    </Context.Provider>
  );
};
