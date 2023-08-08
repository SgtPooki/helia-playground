import React, {useState, useEffect} from 'react'
import { useHelia } from './hooks/useHelia';
import StatusText from './components/StatusText';
import NodeInfo from './components/NodeInfo';

export default function App() {
  const { error, starting, helia } = useHelia()

  const startHelia = async () => {
    if (helia != null) {
      await helia.start();
    }
  }
  const stopHelia = async () => {
    if (helia != null) {
      await helia.stop();
    }
  }

  const addFileExample = `
async function addFile () {
  const textEncoder = new TextEncoder()
  const cid = await heliaFs.addFile({ content: textEncoder.encode('rsd - sgtpooki - 2023-08-07 Hello world!')})
  console.log('successfully stored', cid.toString())
}
await addFile()
`

  const catFileExample = `
async function catFile () {
  const textDecoder = new TextDecoder()
  for await (const data of heliaFs.cat('bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi')) {
    console.log(textDecoder.decode(data))
  }
}
await catFile()
`

  const discoveredPeersExample = `
for (const [peerIdString, peer] of discoveredPeers.entries()) {
  console.log(\`\${peerIdString}: \${peer.multiaddrs.toString()}\`)
}
`

const dhtProvideExample = `
const textEncoder = new TextEncoder()
const cid = await heliaFs.addFile({content: textEncoder.encode('Hello world!')})
for await (const event of helia.libp2p.services.dht.provide(cid)) {
  console.log(event)
}
`

  return (
    <>
      <h1>IPFS in the Browser via Helia</h1>
    <div>
      This page creates an IPFS Helia node in your browser and sets a few other useful components into the
      global Javascript namespace:
      <ul>
        <li><b><em style={{ backgroundColor: '#d7d6d6' }}>helia</em></b> - A helia instance. You can access the <a href="https://www.npmjs.com/package/libp2p" target="_blank">libp2p</a> instance used by helia with <b><em style={{ backgroundColor: '#d7d6d6' }}>helia.libp2p</em></b></li>
        <li><b><em style={{ backgroundColor: '#d7d6d6' }}>heliaFs</em></b> - A <a href="https://www.npmjs.com/package/@helia/unixfs" target="_blank">@helia/unixFS</a> instance</li>
        <li><b><em style={{ backgroundColor: '#d7d6d6' }}>discoveredPeers</em></b> - A <b><em style={{ backgroundColor: '#d7d6d6' }}>Map&lt;peerIdString, peerDiscoveryEventDetail&gt;</em></b> that is filled as we discover peers</li>
      </ul>
      Open the console to play around with them.
    </div>
    <p>
      Note that opening two tabs of this page in the same browser won't work
      well, because they will share node configuration. You'll end up trying to
      run two instances of the same node, with the same private key and
      identity, which is a Bad Idea.
    </p>
    <hr />
    <div>
      <button onClick={startHelia}>Start Helia</button>
      <button onClick={stopHelia}>Stop Helia</button>
    </div>
    {/* <h1 id="status">Node status: <span id="statusValue">Not Started</span></h1> */}
    <StatusText />
    <NodeInfo />

    <hr />

    <h2>Some suggestions</h2>

    <p>Try adding a new file:</p>

    <pre><code className="language-javascript">{addFileExample}</code></pre>

    <p>
      You can cat that same file. If you used the exact same string as above
      ('Hello world!') you should have an hash like this:
      'bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi'
    </p>

    <pre><code className="language-javascript">{catFileExample}</code></pre>

    <p>
      Display the multiaddrs of the peers you've discovered:
    </p>
    <pre><code className="language-javascript">{discoveredPeersExample}</code></pre>

    <p>
      Provide the CIDs you create (once you're connected to a peer)
    </p>
    <pre><code className="language-javascript">{dhtProvideExample}</code></pre>

    <hr />
    <h2>Event Log:</h2>
    <article id="runningLog"></article>

    </>
  )
}

