import React, { useEffect, useState } from 'react';
import { createAnimation, IonButton, IonItem, IonLabel, IonModal } from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, text, latitude, longitude, webViewPath, onEdit }) => {
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    if(document.getElementById("image"))
      document.getElementById("image")!.addEventListener('mouseover', () => {
          setShowModal(true);
      });
  }, [document.getElementById("image")]);

  const enterAnimation = (baseEl: any) => {

      const backdropAnimation = createAnimation()
          .addElement(baseEl.querySelector('ion-backdrop')!)
          .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = createAnimation()
          .addElement(baseEl.querySelector('.modal-wrapper')!)
          .keyframes([
              { offset: 0, opacity: '0', transform: 'scale(0)' },
              { offset: 1, opacity: '0.99', transform: 'scale(1)' }
          ]);

      return createAnimation()
          .addElement(baseEl)
          .easing('ease-out')
          .duration(500)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  }

  const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
  }

  return (
    <IonItem id="item" onClick={() => onEdit(_id)}>
      <IonLabel>{text}</IonLabel>
      <IonLabel>{latitude}</IonLabel>
      <IonLabel>{longitude}</IonLabel>
      {webViewPath && (<img id="image" src={webViewPath} width={'100px'} height={'100px'} 
        onClick={() => {
            setShowModal(true);
        }} />)
      }
      <IonModal isOpen={showModal} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation} backdropDismiss={true} onDidDismiss={() => setShowModal(false)}>
        {webViewPath && (<img id="image" src={webViewPath}/>)}
        <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
      </IonModal>

      {!webViewPath && (<img src={'https://static.thenounproject.com/png/187803-200.png'} width={'100px'} height={'100px'} />)}
    </IonItem>
  );
};

export default Item;
