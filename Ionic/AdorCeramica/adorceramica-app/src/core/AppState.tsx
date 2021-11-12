import { App } from '@capacitor/app';


export const CurrentAppState = () => {
    var appState = true;
    App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
        appState = isActive;
    });

    return appState;
};
