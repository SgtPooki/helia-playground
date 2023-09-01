import React, {useState, useEffect} from 'react'
import { useHelia } from './hooks/useHelia';
import StatusText from './components/StatusText';
import NodeInfo from './components/NodeInfo';
import EventLog from './components/EventLog';
import FetchContent from './components/userUtils/FetchContent';
import { Box, Button, Code, Heading, VStack, Container, StackDivider, UnorderedList, ListItem } from '@chakra-ui/react'

export default function App() {
  const { helia } = useHelia()

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
    <VStack width="80vw" divider={<StackDivider borderColor='gray.200' />} m="5vw" alignItems="flex-start">
      <Box>
        <Heading as="h1" size="2xl">Helia Playground</Heading>
        <div>
          This page creates an IPFS Helia node in your browser and sets a few other useful components into the
          global Javascript namespace:
          <UnorderedList>
            <ListItem><b><em style={{ backgroundColor: '#d7d6d6' }}>helia</em></b> - A helia instance. You can access the <a href="https://www.npmjs.com/package/libp2p" target="_blank">libp2p</a> instance used by helia with <b><em style={{ backgroundColor: '#d7d6d6' }}>helia.libp2p</em></b></ListItem>
            <ListItem><b><em style={{ backgroundColor: '#d7d6d6' }}>heliaFs</em></b> - A <a href="https://www.npmjs.com/package/@helia/unixfs" target="_blank">@helia/unixFS</a> instance</ListItem>
            <ListItem><b><em style={{ backgroundColor: '#d7d6d6' }}>discoveredPeers</em></b> - A <b><em style={{ backgroundColor: '#d7d6d6' }}>Map&lt;peerIdString, peerDiscoveryEventDetail&gt;</em></b> that is filled as we discover peers</ListItem>
          </UnorderedList>
          Open the console to play around with them.
        </div>
        <p>
          Note that opening two tabs of this page in the same browser won't work
          well, because they will share node configuration. You'll end up trying to
          run two instances of the same node, with the same private key and
          identity, which is a Bad Idea.
        </p>
      </Box>
      <Box textAlign={"left"}>
        <StatusText />
        <Box>
          <Button onClick={startHelia} backgroundColor="green.200">Start Helia</Button>
          <Button onClick={stopHelia} backgroundColor="red.200">Stop Helia</Button>
        </Box>
        <NodeInfo />
      </Box>

    <FetchContent />

    <Box>
      <Heading as='h2'>Some suggestions</Heading>

      <p>Try adding a new file:</p>

      <Code display="block" whiteSpace="pre">{addFileExample}</Code>

      <p>
        You can cat that same file. If you used the exact same string as above
        ('Hello world!') you should have an hash like this:
        'bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi'
      </p>

      <Code display="block" whiteSpace="pre">{catFileExample}</Code>

      <p>
        Display the multiaddrs of the peers you've discovered:
      </p>
      <Code display="block" whiteSpace="pre">{discoveredPeersExample}</Code>

      <p>
        Provide the CIDs you create (once you're connected to a peer)
      </p>
      <Code display="block" whiteSpace="pre">{dhtProvideExample}</Code>
    </Box>

      <EventLog />

    </VStack>
    </>
  )
}

