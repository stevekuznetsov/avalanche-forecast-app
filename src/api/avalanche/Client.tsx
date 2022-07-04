import {MapLayer, Product, ProductType} from '@app/api/avalanche/Types';
import {format} from 'date-fns';

export interface ClientProps {
  host: string;
}

export interface Client {
  mapLayer: (
    center_id: string,
    callback: (layer: MapLayer) => void,
    handleError: (error: Error) => void,
  ) => void;
  productById: (
    id: number,
    callback: (product: Product) => void,
    handleError: (error: Error) => void,
  ) => void;
  product: (
    type: ProductType,
    center_id: string,
    zone_id: number,
    published_time: Date,
    callback: (product: Product) => void,
    handleError: (error: Error) => void,
  ) => void;
}

export const NewClient = (props: ClientProps): Client => {
  const client: Client = {
    mapLayer: (
      center_id: string,
      callback: (layer: MapLayer) => void,
      handleError: (error: Error) => void,
    ) => {
      fetch(`${props.host}/v2/public/products/map-layer/${center_id}`, {
        headers: {Accept: 'application/json'},
      })
        .then(async res => {
          if (!res.ok) {
            const raw = await res.text();
            throw new Error(res.status + ': ' + raw);
          }
          const raw = await res.json();
          if (!raw) {
            throw new Error(`No map layer exists for center ${center_id}.`);
          }
          callback(raw);
        })
        .catch(error => {
          handleError(error);
        });
    },
    productById: (
      id: number,
      callback: (product: Product) => void,
      handleError: (error: Error) => void,
    ) => {
      fetch(`${props.host}/v2/public/product/${id}`, {
        headers: {Accept: 'application/json'},
      })
        .then(async res => {
          if (!res.ok) {
            const raw = await res.text();
            throw new Error(res.status + ': ' + raw);
          }
          const raw = await res.json();
          if (!raw) {
            throw new Error(`No product with id ${id} exists.`);
          }
          callback(raw);
        })
        .catch(error => {
          handleError(error);
        });
    },
    product: (
      type: ProductType,
      center_id: string,
      zone_id: number,
      published_time: Date,
      callback: (product: Product) => void,
      handleError: (error: Error) => void,
    ) => {
      const parameters: Record<string, string> = {};
      parameters.type = String(type);
      parameters.center_id = center_id;
      parameters.zone_id = String(zone_id);
      parameters.published_time = format(published_time, 'y-MM-dd');
      let formattedParameters: string = '';
      for (const query in parameters) {
        if (parameters.hasOwnProperty(query)) {
          formattedParameters +=
            query + '=' + encodeURIComponent(parameters[query]);
        }
      }
      fetch(`${props.host}/v2/public/product?${formattedParameters}`, {
        headers: {Accept: 'application/json'},
      })
        .then(async res => {
          if (!res.ok) {
            const raw = await res.text();
            throw new Error(res.status + ': ' + raw);
          }
          const raw = await res.json();
          if (!raw) {
            throw new Error(
              `No ${type} for the ${center_id} zone ${zone_id} was published at ${published_time}.`,
            );
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
