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
import { HeliaInstanceType } from '../types'

export interface HeliaContext {
  helia: HeliaInstanceType | null,
  fs: UnixFS | null,
  error: boolean | null,
  starting: boolean,
  dhtMode: 'client' | 'server' | 'unknown'
  status: 'Online' | 'Offline',
  nodeId: string | null,
  discoveredPeers: any[],
  connectedPeers: any[],
  multiaddrs: any[],
  events: string[],
  addToEventLog?: (event: string) => void
}

const defaultContextValues: Omit<HeliaContext, 'addToEventLog'> = {
  helia: null,
  fs: null,
  error: false,
  starting: true,
  dhtMode: 'unknown',
  status: 'Offline',
  nodeId: null,
  discoveredPeers: [],
  connectedPeers: [],
  multiaddrs: [],
  events: []
}
export const HeliaContext = createContext<HeliaContext>(defaultContextValues)

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
  const [events, setEvents] = useState<HeliaContext['events']>([])

  const addToEventLog = useCallback((event: string) => {
    setEvents((prev) => [...prev, event])
  }, [])

  const startHelia = useCallback(async () => {
    if (helia) {
      addToEventLog('helia already started');
    } else {

    }
  }, [])
  const onBeforeUnload = useCallback(async () => {
    if (helia != null) {
      addToEventLog('Stopping Helia')
      await helia.stop()
    }
  }, [helia])

  useEffect(() => {
    if (helia != null) {
      return
    }
    async function effect() {
      try {
        addToEventLog('Starting Helia')
        const helia = await getHelia()
        setHelia(helia)
        setFs(unixfs(helia))
        setNodeId(helia.libp2p.peerId.toString())
        window.addEventListener('beforeunload', onBeforeUnload)
      } catch (e) {
        console.error(e)
        setError(true)
      }
    }
    effect()
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [])

  const updateInfo = useCallback(async () => {
    if (helia == null) {
      return
    }
    setDhtMode(await helia.libp2p.services.dht.getMode())
    setStatus(helia.libp2p.status === "started" ? 'Online' : 'Offline')
    setStarting(false)
  }, [helia])

  useEffect(() => {
    if (helia == null || fs == null) {
      return
    }
    (window as any).helia = helia;
    (window as any).heliaFs = fs;

    let timeoutId: any = null
    const refreshFn = async () => {
      updateInfo()
      timeoutId = setTimeout(refreshFn, 1000)
    }
    refreshFn()

    helia.libp2p.addEventListener("peer:discovery", (evt) => {
      setDiscoveredPeers((prev) => [...prev, evt.detail])
      addToEventLog(`Discovered peer ${evt.detail.id.toString()}`)
    });

    helia.libp2p.addEventListener("peer:connect", (evt) => {
      addToEventLog(`Connected to ${evt.detail.toString()}`)
      setConnectedPeers((prev) => [...prev, evt.detail])
      setMultiaddrs(helia.libp2p.getMultiaddrs())
    });

    helia.libp2p.addEventListener("peer:disconnect", (evt) => {
      addToEventLog(`Disconnected from ${evt.detail.toString()}`)
      setConnectedPeers((prev) => prev.filter((peer) => peer.toString() !== evt.detail.toString()))
      setMultiaddrs(helia.libp2p.getMultiaddrs())
    });

    // cleanup
    return () => {
      clearTimeout(timeoutId)
    }

  }, [helia, fs, updateInfo])


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
        multiaddrs,
        events,
        addToEventLog
      }}
    >{children}</HeliaContext.Provider>
  )
}
