import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { GenericHeader } from '../components/header/generic-header';
import './Home.css';

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <IonPage>
      <GenericHeader/>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">ADOR Ceramica</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonButton
          onClick={(event) => {
            event.preventDefault();
            history.push("/items");
          }}>
          Items
          </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
