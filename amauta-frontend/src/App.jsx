import Navbar from './components/Navbar'
import { CeloProvider } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';
import CreateStream from './components/CreateStream';
import Streams from './components/Streams';

function App() {
  return (
    <CeloProvider
      dapp={{
        name: 'My awesome dApp',
        description: 'My awesome description',
        url: 'https://example.com',
      }}
    >
      <Navbar></Navbar>
      <div class="grid grid-cols-2 grid-flow-col gap-1 px-10">
        <div><Streams></Streams></div>
        <div><CreateStream></CreateStream></div>
      </div>
      
    </CeloProvider>
  )
}

export default App
