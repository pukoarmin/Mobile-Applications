import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../../../core';
import { ItemProps } from './ItemProps';
import { createItem, getItems, newWebSocket, syncData, updateItem } from './itemApi';
import { AuthContext } from '../../authentication';
import { LocalStorage } from '../../../core/local-storage/LocalStorage';
import { useNetworkStatus } from '../../../core/hooks/useNetworkStatus';
import { render } from '@testing-library/react';
import { Network } from '@capacitor/network';
import { IonToast } from '@ionic/react';

const log = getLogger('ItemProvider');

type SaveItemFn = (item: ItemProps) => Promise<any>;

export interface ItemsState {
  items?: ItemProps[],
  fetching: boolean,
  fetchingError?: Error | null,
  saving: boolean,
  savingError?: Error | null,
  saveItem?: SaveItemFn,
}

interface ActionProps {
  type: string,
  payload?: any,
}

const initialState: ItemsState = {
  fetching: false,
  saving: false,
};

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';

const reducer: (state: ItemsState, action: ActionProps) => ItemsState =
  (state, { type, payload }) => {
    switch (type) {
      case FETCH_ITEMS_STARTED:
        return { ...state, fetching: true, fetchingError: null };
      case FETCH_ITEMS_SUCCEEDED:
        return { ...state, items: payload.items, fetching: false };
      case FETCH_ITEMS_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };
      case SAVE_ITEM_STARTED:
        return { ...state, savingError: null, saving: true };
      case SAVE_ITEM_SUCCEEDED:
        const items = [...(state.items || [])];
        const item = payload.item;
        const index = items.findIndex(it => it._id === item._id);
        if (index === -1) {
          //FIXME: The if is not a good fix. This is called twice
          //First time when the item just arrived and does not yet have and ID
          //Second time when it has an ID
          //It should be called just once
          if (item._id != undefined){
            items.splice(0, 0, item);
            //console.log(item);
          }
        } else {
          items[index] = item;
          //console.log(item);
        }
        return { ...state, items, saving: false };
      case SAVE_ITEM_FAILED:
        return { ...state, savingError: payload.error, saving: false };
      default:
        return state;
    }
  };

export const ItemContext = React.createContext<ItemsState>(initialState);

interface ItemProviderProps {
  children: PropTypes.ReactNodeLike,
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, fetching, fetchingError, saving, savingError } = state;

  const { networkStatus } = useNetworkStatus();
  const [connectedNetworkStatus, setConnectedNetworkStatus] = useState<boolean>(false);
  Network.getStatus().then(status => setConnectedNetworkStatus(status.connected));
  const [savedOffline, setSavedOffline] = useState<boolean>(false);
  useEffect(networkEffect, [token, setConnectedNetworkStatus]);

  const [showServerCallErrorToast, setShowServerCallErrorToast] = useState(false);

  let localStorage = new LocalStorage();
  useEffect(getItemsEffect, [token]);
  useEffect(wsEffect, [token]);
  const saveItem = useCallback<SaveItemFn>(saveItemCallback, [token]);
  const value = { 
    items, 
    fetching, 
    fetchingError, 
    saving, savingError, 
    saveItem,
    connectedNetworkStatus,
    savedOffline
  };
  if (networkStatus.connected){
    console.log("[BACKUP] -> Backup initialized", networkStatus.connected);
      backupItemsLocally(items);
  }
  log('returns');
  return (
    <ItemContext.Provider value={value}>
      {children}
      <IonToast color="danger"
        isOpen={showServerCallErrorToast}
        onDidDismiss={() => setShowServerCallErrorToast(false)}
        message="Could not connect to server"
        position="bottom"
        duration={2000}
      />
    </ItemContext.Provider>
  );

  function networkEffect() {
    console.log("network effect");
    let canceled = false;
    Network.addListener('networkStatusChange', async (status) => {
        if (canceled) return;
        const connected = status.connected;
        if (connected) {
            console.log("networkEffect - SYNC data");
            await syncData(token);
        }
        setConnectedNetworkStatus(status.connected);
    });
    return () => {
        canceled = true;
    }
}

  function getItemsEffect() {
    let canceled = false;
    fetchItems();
    return () => {
      canceled = true;
    }

    async function fetchItems() {
      if (!token?.trim()) {
        return;
      }
      try {
        log('fetchItems started');
        dispatch({ type: FETCH_ITEMS_STARTED });
        const items = await getItems(token);
        log('fetchItems succeeded');
        if (!canceled) {
          log(items);
          dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
        }
      } catch (error) {
        log('fetchItems failed');
        dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
        try{
          dispatch({ type: FETCH_ITEMS_STARTED });
          const items = await getBackupItems();
          log('fetchItems succeeded');
          if (!canceled) {
            log(items);
            dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
            setShowServerCallErrorToast(true);
          }
          log("fetched items from local memory");
        } catch (error){
          dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
        }
      }
    }
  }

  function backupItemsLocally(_items: ItemProps[] | undefined){
    console.log("[ITEM PROVIDER] - Item backup started");
    localStorage.backupItems(JSON.stringify(_items));
    console.log("[ITEM PROVIDER] - Item backup completed");
  }

  async function getBackupItems(){
    const storedItems = await localStorage.getBackupItems();
    if (storedItems != null){
      console.log("[ITEM PROVIDER] - Item loading backup started");
      if (storedItems != ""){
        const dataString = ((storedItems as unknown) as string);
        let jsonObj = JSON.parse(JSON.parse(dataString));
        let items: ItemProps[] = [];
        for (var prop in jsonObj){
          let item: ItemProps = {
            _id: jsonObj[prop]['_id'],
            text: jsonObj[prop]['text'],
          };
          items.push(item);
        }
        return items
      }
      else{
        log("getBackupItems failed");
      }
    }
      
    console.log("[ITEM PROVIDER] - Item loading backup completed");
  }

  async function saveItemCallback(item: ItemProps) {
    try {
      if (navigator.onLine) {
        log('saveItem started');
        dispatch({ type: SAVE_ITEM_STARTED });
        const savedItem = await (item._id ? updateItem(token, item) : createItem(token, item));
        log('saveItem succeeded');
        dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem } });
      }
      else {
        console.log('saveBook offline');
        log('saveBook failed');
        item._id = (item._id == undefined) ? ('_' + Math.random().toString(36).substr(2, 9)) : item._id;
        localStorage.storeItem(item);
        dispatch({type: SAVE_ITEM_SUCCEEDED, payload: {item : item}});
        setSavedOffline(true);
        setShowServerCallErrorToast(true);
      }
      
    } catch (error) {
      log('saveItem failed');
      item._id = (item._id == undefined) ? ('_' + Math.random().toString(36).substr(2, 9)) : item._id;
      localStorage.storeItem(item);
      dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: item } });
      setShowServerCallErrorToast(true);
    }
  }

  function wsEffect() {
    let canceled = false;
    log('wsEffect - connecting');
    let closeWebSocket: () => void;
    if (token?.trim()) {
      closeWebSocket = newWebSocket(token, message => {
        if (canceled) {
          return;
        }
        const { type, payload: item } = message;
        log(`ws message, item ${type}`);
        if (type === 'created' || type === 'updated') {
          dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item } });
        }
      });
    }
    return () => {
      log('wsEffect - disconnecting');
      canceled = true;
      closeWebSocket?.();
    }
  }
};
