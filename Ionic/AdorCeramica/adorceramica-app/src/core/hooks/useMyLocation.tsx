import { useEffect, useState } from 'react';
import { Position, Geolocation } from '@capacitor/geolocation';

interface MyLocation {
    position?: Position;
    error?: Error;
}

export const useMyLocation = () => {
    const [state, setState] = useState<MyLocation>({});
    useEffect(watchMyLocation, []);
    return state;

    function watchMyLocation() {
        let cancelled = false;
        Geolocation.getCurrentPosition()
            .then(position => updateMyPosition('current', position))
            .catch(error => updateMyPosition('current', undefined, error));
        let callbackId: string;
        Geolocation.watchPosition({}, (position, error) => {
                                    updateMyPosition('watch', position, error);
                                    }).then(res => callbackId = res);
        return () => {
            cancelled = true;
            Geolocation.clearWatch({id: callbackId}).then();
        };

        function updateMyPosition(source: string, position?: Position | null, error: any = undefined) {
            console.log(source, position, error);
            if (!cancelled) {
                setState({ ...state, position: position || state.position, error });
            }
        }
    }
};