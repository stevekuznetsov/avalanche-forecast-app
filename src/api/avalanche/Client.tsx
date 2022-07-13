import {AvalancheCenter, MapLayer, Product, ProductType} from '@app/api/avalanche/Types';
import {format} from 'date-fns';

export interface ClientProps {
  host: string;
}

export interface Client {
  center: (center_id: string, callback: (center: AvalancheCenter) => void, handleError: (error: Error) => void) => void;
  mapLayer: (center_id: string, callback: (layer: MapLayer) => void, handleError: (error: Error) => void) => void;
  productById: (id: number, callback: (product: Product) => void, handleError: (error: Error) => void) => void;
  product: (type: ProductType, center_id: string, zone_id: number, published_time: Date, callback: (product: Product) => void, handleError: (error: Error) => void) => void;
  products: (center_id: string, start_date: Date, end_date: Date, callback: (products: Product[]) => void, handleError: (error: Error) => void) => void;
}

const formatParameters = (parameters: Record<string, string>): string => {
  let formattedParameters: string = '';
  for (const query in parameters) {
    if (parameters.hasOwnProperty(query)) {
      formattedParameters += (formattedParameters.length !== 0 ? '&' : '') + query + '=' + encodeURIComponent(parameters[query]);
    }
  }
  return formattedParameters;
};

export const NewClient = (props: ClientProps): Client => {
  const client: Client = {
    center: (center_id: string, callback: (center: AvalancheCenter) => void, handleError: (error: Error) => void) => {
      fetch(`${props.host}/v2/public/avalanche-center/${center_id}`, {
        headers: {Accept: 'application/json'},
      })
        .then(async res => {
          if (!res.ok) {
            const raw = await res.text();
            throw new Error(res.status + ': ' + raw);
          }
          const raw = await res.json();
          if (!raw) {
            throw new Error(`No center metadata exists for center ${center_id}.`);
          }
          callback(raw);
        })
        .catch(error => {
          handleError(error);
        });
    },
    mapLayer: (center_id: string, callback: (layer: MapLayer) => void, handleError: (error: Error) => void) => {
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
    productById: (id: number, callback: (product: Product) => void, handleError: (error: Error) => void) => {
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
    product: (type: ProductType, center_id: string, zone_id: number, published_time: Date, callback: (product: Product) => void, handleError: (error: Error) => void) => {
      const parameters: Record<string, string> = {
        ['type']: String(type),
        ['center_id']: center_id,
        ['zone_id']: String(zone_id),
        ['published_time']: format(published_time, 'y-MM-dd'), // TODO(skuznets): seems like you can't ask for a published date on a forecast, just for warnings ...
      };
      fetch(`${props.host}/v2/public/product?${formatParameters(parameters)}`, {
        headers: {Accept: 'application/json'},
      })
        .then(async res => {
          if (!res.ok) {
            const raw = await res.text();
            throw new Error(res.status + ': ' + raw);
          }
          const raw = await res.json();
          if (!raw) {
            throw new Error(`No ${type} for the ${center_id} zone ${zone_id} was published at ${published_time}.`);
          }
          callback(raw);
        })
        .catch(error => {
          handleError(error);
        });
    },
    products: (center_id: string, start_date: Date, end_date: Date, callback: (products: Product[]) => void, handleError: (error: Error) => void) => {
      const parameters: Record<string, string> = {
        ['avalanche_center_id']: center_id,
        ['date_start']: format(start_date, 'y-MM-dd'),
        ['date_end']: format(end_date, 'y-MM-dd'),
      };
      fetch(`${props.host}/v2/public/products?${formatParameters(parameters)}`, {
        headers: {Accept: 'application/json'},
      })
        .then(async res => {
          if (!res.ok) {
            const raw = await res.text();
            throw new Error(res.status + ': ' + raw);
          }
          const raw = await res.json();
          if (!raw) {
            throw new Error(`No products for the ${center_id} were published between ${start_date} and ${end_date}.`);
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
