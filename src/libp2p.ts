import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { ipniContentRouting } from '@libp2p/ipni-content-routing'
import { type DualKadDHT, kadDHT } from '@libp2p/kad-dht'
import { mplex } from '@libp2p/mplex'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { ipnsSelector } from 'ipns/selector'
import { ipnsValidator } from 'ipns/validator'
import { autoNAT } from '@libp2p/autonat'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { identify } from '@libp2p/identify'
import type { PubSub } from '@libp2p/interface-pubsub'
import type { Libp2pOptions } from 'libp2p'
import { dcutr } from '@libp2p/dcutr'

export function libp2pDefaults (): Libp2pOptions<{ dht: DualKadDHT, pubsub: PubSub, identify: unknown, autoNAT: unknown }> {
  return {
    addresses: {
      listen: [
        '/webrtc'
      ]
    },
    transports: [
      webRTC(),
      webRTCDirect(),
      webTransport(),
      webSockets(),
      circuitRelayTransport({
        discoverRelays: 1
      })
    ],
    connectionEncryption: [
      noise()
    ],
    streamMuxers: [
      yamux(),
      mplex()
    ],
    peerDiscovery: [
      bootstrap({
        list: [
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
          '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ'
        ]
      })
    ],
    contentRouters: [
      ipniContentRouting('https://cid.contact')
    ],
    services: {
      // @ts-expect-error - types are borked...
      dcutr: dcutr(),
      identify: identify(),
      autoNAT: autoNAT(),
      // pubsub: gossipsub(),
      // dht: kadDHT(),
      dht: kadDHT({
        // pingTimeout: 2000,
        // pingConcurrency: 3,
        // kBucketSize: 20,
        clientMode: true,
        validators: {
          ipns: ipnsValidator
        },
        selectors: {
          ipns: ipnsSelector
        }
      })
    }
  }
}
