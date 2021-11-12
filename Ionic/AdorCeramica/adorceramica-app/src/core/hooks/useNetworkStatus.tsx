import { useEffect, useState } from 'react';
import { ConnectionStatus, Network } from '@capacitor/network';

const initialState = {
  connected: false,
  connectionType: 'unknown',
}

export const CurrentNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState(initialState)
  useEffect(() => {
    const handler = Network.addListener('networkStatusChange', handleNetworkStatusChange);
    Network.getStatus().then(handleNetworkStatusChange);
    let canceled = false;
    return () => {
      canceled = true;
      handler.remove();
    }

    async function handleNetworkStatusChange(status: ConnectionStatus) {
      console.log('[Network Status] -> Status change: ', status);
      if (!canceled) {
        setNetworkStatus(status);
      }
    }
  }, [])
  return { networkStatus };
};
