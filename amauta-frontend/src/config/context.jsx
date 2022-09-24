import React, { useState } from "react";
import { newKitFromWeb3 } from "@celo/contractkit";
import Web3 from "web3";

export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
  const [web3, useWeb3] = useState(null);
  const [kit, useKit] = useState(null);
  const [walletState, setWalletState] = useState(-1); // 0: no celo wallet, 1: celo wallet installed, 2: celo wallet connected
  const connectWallet = async (provider) => {
    if (provider) {
      try {
        const result = await provider.enable();
        const tmpWeb3 = new Web3(provider);
        const tmpkit = newKitFromWeb3(tmpWeb3)
        console.warn("Antes");
        console.warn(kit);
        console.warn("Despues");
        console.warn(kit);
        console.warn(tmpkit);
        const accounts = await tmpkit.web3.eth.getAccounts();
        tmpkit.defaultAccount = accounts[0];
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
  React.useEffect(() => {
    const connection = async () => {
      await connectWallet(window.celo);
    };
    connection();
  }, []);
  return (
    <Context.Provider
      value={{
        kit,
        web3,
        walletState,
        setWalletState,
        connectWallet,
      }}
    >
      {children}
    </Context.Provider>
  );
};
