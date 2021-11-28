import React, { useContext, useEffect, useState } from 'react';
import {
  createAnimation,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { getLogger } from '../../../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';
import { useMyLocation } from '../../../core/hooks/useMyLocation';
import { Photo, usePhotoGallery } from '../../../core/hooks/usePhotoGallery';
import { ItemMap } from '../../location/Map';
import { camera } from 'ionicons/icons';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [text, setText] = useState('');
  const [item, setItem] = useState<ItemProps>();

  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [currentLatitude, setCurrentLatitude] = useState<number | undefined>(undefined);
  const [currentLongitude, setCurrentLongitude] = useState<number | undefined>(undefined);
  const [webViewPath, setWebViewPath] = useState('');

  const myLocation = useMyLocation();
    const { latitude: lat, longitude: lng } = myLocation.position?.coords || {};

  const {takePhoto} = usePhotoGallery();

  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);
    setItem(item);
    if (item) {
      setText(item.text);
      setWebViewPath(item.webViewPath);
      setLatitude(item.latitude);
      setLongitude(item.longitude);
    }
  }, [match.params.id, items]);

  useEffect(() => {
    if (latitude === undefined && longitude === undefined) {
        setCurrentLatitude(lat);
        setCurrentLongitude(lng);
    } else {
        setCurrentLatitude(latitude);
        setCurrentLongitude(longitude);
    }
  }, [lat, lng, longitude, latitude]);

  const handleSave = () => {
    const editedItem = item ? { ...item, text, latitude: latitude, longitude: longitude, webViewPath: webViewPath } : { text, latitude: latitude, longitude: longitude, webViewPath: webViewPath };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };

  async function handlePhotoChange() {
    const image = await takePhoto();
    if (!image) {
        setWebViewPath('');
    } else {
      if(image.data!== undefined)
        setWebViewPath(image.data);
    }
  }

  function setLocation(){
    setLatitude(currentLatitude);
    setLongitude(currentLongitude);
  }

  function log(source: string) {
    return (e: any) => {
    setCurrentLatitude(e.latLng.lat());
    setCurrentLongitude(e.latLng.lng());
    console.log(source, e.latLng.lat(), e.latLng.lng());
    }
  }

  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput value={text} onIonChange={e => setText(e.detail.value || '')} />

        <IonItem>
          <IonLabel>Location of the item: </IonLabel>
          <IonButton onClick={setLocation}>Set location</IonButton>
        </IonItem>

        {webViewPath && (<img onClick={handlePhotoChange} src={webViewPath} width={'100px'} height={'100px'}/>)}
        {!webViewPath && (<img onClick={handlePhotoChange} src={'https://static.thenounproject.com/png/187803-200.png'} width={'100px'} height={'100px'}/>)}

        {lat && lng &&
            <ItemMap
                lat={currentLatitude}
                lng={currentLongitude}
                onMapClick={log('onMap')}
                onMarkerClick={log('onMarker')}
            />
        }

        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
