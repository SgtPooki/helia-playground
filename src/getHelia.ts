import { createHelia } from 'helia';
import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { LevelDatastore } from "datastore-level";
import { LevelBlockstore } from 'blockstore-level';
import { HeliaInstanceType } from './types';

let heliaInstance: HeliaInstanceType | null = null;
export default async () => {
  // application-specific data lives in the datastore
  const datastore = new LevelDatastore(`helia-example-datastore`);
  const blockstore = new LevelBlockstore(`helia-example-blockstore`);
  // const datastore = new LevelDatastore(`helia-example-datastore-${Math.random()}`);
  // const blockstore = new LevelBlockstore(`helia-example-blockstore-${Math.random()}`);

  if (heliaInstance != null) {
    return heliaInstance;
  }
  heliaInstance = await createHelia({
    // datastore,
    // blockstore,
    // libp2p: libp2pDefaults()
  });
  // addToLog("Created Helia instance");

  return heliaInstance;
};
