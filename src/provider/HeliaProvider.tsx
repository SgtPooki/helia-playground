/* eslint-disable no-console */
import React, {
  useEffect,
  useState,
  useCallback,
  createContext
} from 'react'

import { type UnixFS, unixfs } from '@helia/unixfs'
import type { Helia } from '@helia/interface'

import getHelia from '../getHelia.ts'

export interface HeliaContext {
  helia: Helia | null,
  fs: UnixFS | null,
  error: boolean | null,
  starting: boolean,
  dhtMode: 'client' | 'server' | 'unknown'
  status: 'Online' | 'Offline',
  nodeId: string | null,
  discoveredPeers: any[],
  connectedPeers: any[],
  multiaddrs: any[]
}

const defaultContextValues: HeliaContext = {
  helia: null,
  fs: null,
  error: false,
  starting: true,
  dhtMode: 'unknown',
  status: 'Offline',
  nodeId: null,
  discoveredPeers: [],
  connectedPeers: [],
  multiaddrs: []
}
export const HeliaContext = createContext(defaultContextValues)

export const HeliaProvider = ({ children }) => {
  const [helia, setHelia] = useState<HeliaContext['helia']>(null)
  const [fs, setFs] = useState<HeliaContext['fs']>(null)
  const [starting, setStarting] = useState<HeliaContext['starting']>(true)
  const [error, setError] = useState<HeliaContext['error']>(null)
  const [dhtMode, setDhtMode] = useState<HeliaContext['dhtMode']>('unknown')
  const [status, setStatus] = useState<HeliaContext['status']>('Offline')
  const [nodeId, setNodeId] = useState<HeliaContext['nodeId']>(null)
  const [discoveredPeers, setDiscoveredPeers] = useState<HeliaContext['discoveredPeers']>([])
  const [connectedPeers, setConnectedPeers] = useState<HeliaContext['connectedPeers']>([])
  const [multiaddrs, setMultiaddrs] = useState<HeliaContext['multiaddrs']>([])

  const startHelia = useCallback(async () => {
    if (helia) {
      console.info('helia already started');
    } else {

    }
  }, [])

  useEffect(() => {
    if (helia != null) {
      return
    }
    async function effect() {
      try {
        console.info('Starting Helia')
        const helia = await getHelia()
        setHelia(helia)
        setFs(unixfs(helia))
        setNodeId(helia.libp2p.peerId.toString())
      } catch (e) {
        console.error(e)
        setError(true)
      }
    }
    effect()
  }, [])

  const updateInfo = useCallback(async () => {
    if (helia == null) {
      return
    }
    // @ts-expect-error - broken types
    setDhtMode(await helia.libp2p.services.dht.getMode())
    setStatus(helia.libp2p.isStarted() ? 'Online' : 'Offline')
    // setConnectedPeers(helia.libp2p.getPeers())

  }, [helia])

  useEffect(() => {
    if (helia == null) {
      return
    }
    (window as any).helia = helia
    let timeoutId: any = null
    const refreshFn = async () => {
      updateInfo()
      timeoutId = setTimeout(refreshFn, 1000)
    }
    refreshFn()

    helia.libp2p.addEventListener("peer:discovery", (evt) => {
      setDiscoveredPeers((prev) => [...prev, evt.detail])
      console.log(`Discovered peer ${evt.detail.id.toString()}`);
    });

    helia.libp2p.addEventListener("peer:connect", (evt) => {
      console.log(`Connected to ${evt.detail.toString()}`);
      setConnectedPeers((prev) => [...prev, evt.detail])
      setMultiaddrs(helia.libp2p.getMultiaddrs())
    });

    helia.libp2p.addEventListener("peer:disconnect", (evt) => {
      console.log(`Disconnected from ${evt.detail.toString()}`);
      setConnectedPeers((prev) => prev.filter((peer) => peer.toString() !== evt.detail.toString()))
      setMultiaddrs(helia.libp2p.getMultiaddrs())
    });

    // cleanup
    return () => {
      clearTimeout(timeoutId)
    }

  }, [helia])


  return (
    <HeliaContext.Provider
      value={{
        helia,
        fs,
        error,
        starting,
        dhtMode,
        status,
        nodeId,
        discoveredPeers,
        connectedPeers,
        multiaddrs
      }}
    >{children}</HeliaContext.Provider>
  )
}
