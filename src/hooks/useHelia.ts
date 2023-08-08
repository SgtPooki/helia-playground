import { useContext } from 'react'
import { HeliaContext } from '../provider/HeliaProvider'

export const useHelia = () => {
  return useContext(HeliaContext)
  // return { helia, fs, error, starting, dhtMode, status, discoveredPeers, nodeId, connectedPeers }
}
