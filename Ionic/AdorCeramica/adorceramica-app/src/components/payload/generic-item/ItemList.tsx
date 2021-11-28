import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList, IonLoading,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../../../core';
import { ItemContext } from './ItemProvider';
import { ItemProps } from './ItemProps';

const log = getLogger('ItemList');
const offset = 10;
const itemLenOptions = ["No filter", "5", "6", "14"]

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);const [disableInfiniteScroll, setDisabledInfiniteScroll] = useState<boolean>(false);
  const [visibleItems, setVisibleItems] = useState<ItemProps[] | undefined>([]);
  const [page, setPage] = useState(offset)
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true);

  useEffect(() => {
    if (items?.length && items?.length > 0) {
        setPage(offset);
        fetchData();
        console.log(items);
    }
  }, [items]);

  function fetchData() {
    setVisibleItems(items?.slice(0, page + offset));
    setPage(page + offset);
    if (items && page > items?.length) {
        setDisabledInfiniteScroll(true);
        setPage(items.length);
    } else {
        setDisabledInfiniteScroll(false);
    }
  }

  useEffect(() => {
    if (filter === "No filter") {
      setVisibleItems(items);
    } else{
      if (items && filter) {
        console.log(filter);
          setVisibleItems(items.filter(each => each.text.length.toString() === filter));
      }
    }
  }, [filter]);

  useEffect(() => {
      if (search === "") {
          setVisibleItems(items);
      }
      if (items && search !== "") {
          setVisibleItems(items.filter(each => each.text.startsWith(search)));
      }
  }, [search])

  async function searchNext($event: CustomEvent<void>) {
    fetchData();
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Item List</IonTitle>

          <IonSelect style={{ width: '30%' }} slot="secondary" value={filter} placeholder="Pick text length" onIonChange={(e) => setFilter(e.detail.value)}>
                            {itemLenOptions.map((each) => (
                                <IonSelectOption key={each} value={each}>
                                        {each}
                                </IonSelectOption>
                            ))}
          </IonSelect>
          
          <IonSearchbar style={{ width: '30%' }} slot="secondary" placeholder="Search" value={search} debounce={200} onIonChange={(e) => {
                            setSearch(e.detail.value!);
                        }}>
          </IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching items"/>
        {visibleItems && (
          <IonList>
            {visibleItems.map(({ _id, text, latitude, longitude, webViewPath }) =>
              <Item key={_id} _id={_id} text={text} latitude={latitude} longitude={longitude} webViewPath={webViewPath} onEdit={id => history.push(`/item/${id}`)}/>)}
          </IonList>
        )}

        <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
            <IonInfiniteScrollContent loadingText="Loading...">
            </IonInfiniteScrollContent>
        </IonInfiniteScroll>

        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
