import { useEffect, useState } from 'react';
import { ConnectionStatus, Network } from '@capacitor/network';

const initialState = {
  connected: false,
  connectionType: 'unknown',
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState(initialState)
  useEffect(() => {
    const handler = Network.addListener('networkStatusChange', handleNetworkStatusChange);
    Network.getStatus().then(handleNetworkStatusChange);
    let canceled = false;
    return () => {
      canceled = true;
      //FIXME: after using networkStatus in ItemProvider
      //when refreshing the page, this causes error for some reason
      //remove function does not exist
      //handler.remove();
    }

    async function handleNetworkStatusChange(status: ConnectionStatus) {
      console.log('[NETWORK STATUS] -> Status change: ', status);
      if (!canceled) {
        setNetworkStatus(status);
      }
    }
  }, [])
  return { networkStatus };
};
