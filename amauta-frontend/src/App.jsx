import Navbar from "./components/Navbar";
import { CeloProvider } from "@celo/react-celo";
import "@celo/react-celo/lib/styles.css";
import CreateStream from "./components/CreateStream";
import Streams from "./components/Streams";
import { ContextProvider } from "./config/context";

function App() {
  return (
    <CeloProvider
      dapp={{
        name: "My awesome dApp",
        description: "My awesome description",
        url: "https://example.com",
      }}
    >
      <ContextProvider>
        <Navbar></Navbar>
        <div className="grid  grid-cols-6  gap-1 px-5">

          <div className="col-span-6 lg:col-span-2 shadow-2xl">
            <CreateStream></CreateStream>
          </div>
          <div className="col-span-6 lg:col-span-4">
            <Streams> </Streams>
          </div>
        </div>
      </ContextProvider>
    </CeloProvider>
  );
}

export default App;
