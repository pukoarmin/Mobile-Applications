import React, { useContext, useState } from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonRouterOutlet, IonLabel, IonMenuToggle, IonFooter, IonButton, IonBadge, IonText } from '@ionic/react';
import { useNetworkStatus } from '../../core/hooks/useNetworkStatus';
import "./standard-menu.css";
import { BrowserRouter, Redirect } from 'react-router-dom';
import { AuthContext, AuthProvider, AuthState } from '../authentication';
import { LocalStorage } from '../../core/local-storage/LocalStorage';

export const StandardMenuWrapper: React.FC = () => {
    return (
        <BrowserRouter>
            <StandardMenu/>
        </BrowserRouter>
    )
} 

export const StandardMenu: React.FC = () => {
    const { networkStatus } = useNetworkStatus();
    const { isAuthenticated, logout } = useContext<AuthState>(AuthContext);

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
                        <IonButton color="light" expand="full" routerLink="/home">
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
                <IonMenuToggle autoHide={true}>
                    {isAuthenticated && (
                        <IonButton color="light" expand="full" onClick={logout}>
                            <IonLabel>Logout</IonLabel>
                            <Redirect to={{ pathname: '/home' }}/>
                        </IonButton>
                    )}
                    {!isAuthenticated && (
                        <IonButton routerLink={"/login"}color="light" expand="full">
                            <IonLabel>Login</IonLabel>
                        </IonButton>
                    )}
                    
                </IonMenuToggle>
                
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