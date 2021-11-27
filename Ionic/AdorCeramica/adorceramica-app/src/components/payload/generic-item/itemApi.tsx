import axios from 'axios';
import { Storage } from "@capacitor/storage"
import { authConfig, baseUrl, getLogger, withLogs } from '../../../core';
import { ItemProps } from './ItemProps';

const itemUrl = `http://${baseUrl}/api/item`;

export const getItems: (token: string) => Promise<ItemProps[]> = token => {
  return withLogs(axios.get(itemUrl, authConfig(token)), 'getItems');
}

export const createItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token, item) => {
  return withLogs(axios.post(itemUrl, item, authConfig(token)), 'createItem');
}

export const updateItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token, item) => {
  return withLogs(axios.put(`${itemUrl}/${item._id}`, item, authConfig(token)), 'updateItem');
}

const different = (item1: any, item2: any) => {
  if (item1.text === item2.text)
    return false;
  return true;
}

export const syncData: (token: string) => Promise<ItemProps[]> = async token => {
  try {
    const { keys } = await Storage.keys();
    var result = axios.get(`${itemUrl}`, authConfig(token));
    result.then(async result => {
      keys.forEach(async i => {
        if (i !== 'auth' && i !== 'items') {
          const itemOnServer = result.data.find((each: { _id: string; }) => each._id === i);
          const itemLocal = await Storage.get({key: i});

          console.log('[ITEM API] - syncData, item on server: ' + JSON.stringify(itemOnServer));
          console.log('[ITEM API] - syncData, item locally: ' + itemLocal.value!);

          if (itemOnServer !== undefined && different(itemOnServer, JSON.parse(itemLocal.value!))) {
            console.log('[ITEM API] - syncData, update: ' + itemLocal.value);
            axios.put(`${itemUrl}/${i}`, JSON.parse(itemLocal.value!), authConfig(token));
            Storage.remove({key: i});
          } else if (itemOnServer === undefined){
            console.log('[ITEM API] - syncData, create: ' + itemLocal.value!);
            axios.post(`${itemUrl}`, JSON.parse(itemLocal.value!), authConfig(token));
            Storage.remove({key: i});
          }
        }
      })
    }).catch(err => {
      if (err.response) {
        console.log('[ITEM API] - Client received an error response');
      } else if (err.request) {
        console.log('[ITEM API] - Client never received a response, or request never left');
      } else {
        console.log('[ITEM API] - Error occured');
      }
  })
    return withLogs(result, 'syncItems');
  } catch (error) {
    throw error;
  }    
}

interface MessageData {
  type: string;
  payload: ItemProps;
}

const log = getLogger('ws');

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${baseUrl}`);
  ws.onopen = () => {
    log('web socket onopen');
    ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
  };
  ws.onclose = () => {
    log('web socket onclose');
  };
  ws.onerror = error => {
    log('web socket onerror', error);
  };
  ws.onmessage = messageEvent => {
    log('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}
