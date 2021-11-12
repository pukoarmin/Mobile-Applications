import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonRouterOutlet, IonLabel, IonMenuToggle, IonFooter, IonButton, IonBadge, IonText } from '@ionic/react';
import { CurrentNetworkStatus } from '../../core/hooks/useNetworkStatus';
import "./standard-menu.css";


export const StandardMenu: React.FC = () => {
    const { networkStatus } = CurrentNetworkStatus();

    return(
      <><IonMenu side="start" contentId="main" type="overlay">
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Menu</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonList>
                    <IonMenuToggle autoHide={true}>
                        <IonButton routerLink={"/home"} color="light" expand="full">
                            <IonLabel>Home</IonLabel>
                        </IonButton>
                    </IonMenuToggle>

                    <IonMenuToggle autoHide={true}>
                        <IonButton routerLink={"/items"} color="light" expand="full">
                            <IonLabel>Items</IonLabel>
                        </IonButton>
                    </IonMenuToggle>
                </IonList>
            </IonContent>

            <IonFooter>
                <IonItem class="network-status-item">
                    <IonLabel>Status </IonLabel>
                    {networkStatus.connected && (
                        <IonBadge slot="end" color="success">
                            <IonLabel color="dark">Online</IonLabel>
                        </IonBadge>
                    )}
                    {!networkStatus.connected && (
                        <IonBadge slot="end" color="danger">
                            <IonLabel color="dark">Offline</IonLabel>
                        </IonBadge>
                    )}

                </IonItem>
            </IonFooter>
        </IonMenu><IonRouterOutlet></IonRouterOutlet></>
    );
};