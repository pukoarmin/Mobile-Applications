import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonIcon, IonMenuButton } from '@ionic/react';
import { ellipsisHorizontal, ellipsisVertical, personCircle, search, star } from 'ionicons/icons';
import { StandardMenu } from '../menu/standard-menu';

export const GenericHeader: React.FC = () => (
    <IonHeader>
        <IonToolbar>
            <IonTitle>Ador Ceramica</IonTitle>
            
            <IonButtons slot="start">
                <IonMenuButton autoHide={false} />
            </IonButtons>

            <IonButtons slot="primary">
                <IonButton color="secondary">
                <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
                </IonButton>
            </IonButtons>

            <IonButtons slot="secondary">
                <IonButton>
                <IonIcon slot="icon-only" icon={personCircle} />
                </IonButton>
                <IonButton>
                <IonIcon slot="icon-only" icon={search} />
                </IonButton>
            </IonButtons>
        </IonToolbar>
    </IonHeader>
);