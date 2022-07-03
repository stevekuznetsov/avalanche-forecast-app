import {MapLayer} from '@app/api/avalanche/Types';
import { Alert } from "react-native";

export interface ClientProps {
  host: string;
}

export interface Client {
  mapLayer: (
    id: string,
    callback: (layer: MapLayer) => void,
    handleError: (error: Error) => void,
  ) => void;
}

export const NewClient = (props: ClientProps): Client => {
  const client: Client = {
    mapLayer: (
      id: string,
      callback: (layer: MapLayer) => void,
      handleError: (error: Error) => void,
    ) => {
      fetch(props.host + '/v2/public/products/map-layer/' + id, {
        headers: {Accept: 'application/json'},
      })
        .then(async res => {
          if (!res.ok) {
            const raw = await res.text();
            throw new Error(res.status + ': ' + raw);
          }
          const raw = await res.json();
          if (!raw) {
            throw new Error('No map layer exists for this center.');
          }
          callback(raw);
        })
        .catch(error => {
          handleError(error);
        });
    },
  };
  return client;
};
