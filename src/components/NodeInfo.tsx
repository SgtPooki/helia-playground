import React, {useMemo} from 'react';
import { useHelia } from '../hooks/useHelia.ts';
import { Peer } from 'libp2p/dist/src/circuit-relay/pb';
// import type { PeerId } from '@multiformats/multiaddr-matcher';
type PeerId = any

export default function NodeInfo() {
  const {nodeId, discoveredPeers, connectedPeers, multiaddrs } = useHelia();

  return (
    <div id="nodeInfo">
      <h3>ID: <span id="nodeId">{nodeId}</span></h3>
      <h3>Discovered Peers: <span id="discoveredPeerCount">{discoveredPeers.length}</span></h3>
      <h3>Connected Peers: <span id="connectedPeerCount">{connectedPeers.length}</span></h3>
      <ul id="connectedPeersList">
        {connectedPeers.map((peer, i) => (
          <li key={peer.toString()}>{peer.toString()}</li>
        ))}
      </ul>
      <h3>Helia node (this node's) Multiaddrs:</h3>
      <ul id="helia-multiaddrs">
        {multiaddrs.map((multiaddr, i) => (
          <li key={multiaddr.toString()}>{multiaddr.toString()}</li>
        ))}
      </ul>
    </div>
  )
}
