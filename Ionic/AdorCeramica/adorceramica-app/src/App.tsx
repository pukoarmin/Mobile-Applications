import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Components */
import { ItemEdit, ItemList } from './components/payload/generic-item';
import { ItemProvider } from './components/payload/generic-item/ItemProvider';
import { StandardMenu, StandardMenuWrapper } from './components/menu/standard-menu';

/* Pages */
import Home from './pages/Home'
import { Login } from './components/authentication/Login';
import { AuthProvider } from './components/authentication/AuthenticationProvider';
import { PrivateRoute } from './components/authentication/PrivateRoute';

const App: React.FC = () => (
  <IonApp>
      <IonReactRouter>
        <AuthProvider>
          <StandardMenuWrapper />
          <IonRouterOutlet id="main">
              <Route path="/" component={Home} exact={true} />
              <Route exact path="/home" render={() => <Redirect to="/" />} />
              <Route path="/login" component={Login} exact={true} />
              <ItemProvider>
                <PrivateRoute path="/items" component={ItemList} exact={true} />
                <PrivateRoute path="/item" component={ItemEdit} exact={true} />
                <PrivateRoute path="/item/:id" component={ItemEdit} exact={true} />
              </ItemProvider>
          </IonRouterOutlet>
        </AuthProvider>
      </IonReactRouter>
  </IonApp>
);

export default App;
