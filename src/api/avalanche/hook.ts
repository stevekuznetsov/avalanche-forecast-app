import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState, selectAvalancheCenters, selectMapLayers, selectProducts, updateAvalancheCenters, updateMapLayers, updateProducts} from '@app/api/avalanche/store';
import {ClientProps, NewClient} from '@app/api/avalanche/Client';
import {AvalancheCenter, MapLayer, Product, ProductType} from '@app/api/avalanche/Types';
import React from 'react';
import {add, Interval, isWithinInterval, parseISO} from 'date-fns';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const isValidForecastOn = (product: Product, date: Date): boolean => {
  if (product.product_type !== ProductType.Forecast) {
    return false;
  }
  const valid: Interval = {start: parseISO(product.published_time), end: parseISO(product.expires_time)};
  return isWithinInterval(date, valid);
};

export const useCentersForecasts = (clientProps: ClientProps, center_ids: string[], date: Date): {forecasts: Product[]; fetchError: string} => {
  const client = NewClient(clientProps);
  const products = useAppSelector(selectProducts);
  const dispatch = useAppDispatch();

  const [fetchError, setFetchError] = React.useState<string>('');

  React.useEffect(() => {
    let mounted = true;
    for (const center_id of center_ids) {
      // TODO(skuznets): in the future we should use e-tags or similar to re-fetch products when they change
      let found: boolean = false;
      if (products) {
        for (const [, product] of Object.entries(products)) {
          if (isValidForecastOn(product, date) && product.avalanche_center.id === center_id) {
            found = true;
          }
        }
      }
      if (!found) {
        client.products(
          center_id,
          date,
          add(date, {days: 1}),
          (summaries: Product[]) => {
            for (const item of summaries) {
              client.productById(
                item.id,
                (product: Product) => {
                  const fetchedProducts: Record<string, Product> = {
                    [product.id]: product,
                  };
                  dispatch(updateProducts(fetchedProducts));
                },
                (error: Error) => {
                  if (mounted) {
                    setFetchError((state: string): string => {
                      return state + String(error);
                    });
                  }
                },
              );
            }
          },
          (error: Error) => {
            if (mounted) {
              setFetchError((state: string): string => {
                return state + String(error);
              });
            }
          },
        );
      }
    }
  }, [date, center_ids]); // eslint-disable-line react-hooks/exhaustive-deps

  const forecasts: Product[] = [];
  if (products) {
    for (const [, product] of Object.entries(products)) {
      if (isValidForecastOn(product, date) && center_ids.find(id => id === product.avalanche_center.id)) {
        forecasts.push(product);
      }
    }
  }
  return {forecasts: forecasts, fetchError: fetchError};
};

export const useCenterForecasts = (clientProps: ClientProps, center_id: string, date: Date): {forecasts: Product[]; fetchError: string} => {
  const {forecasts, fetchError} = useCentersForecasts(clientProps, [center_id], date);
  return {forecasts: forecasts, fetchError: fetchError};
};

export const useForecast = (clientProps: ClientProps, center_id: string, forecast_zone_id: number, date: Date): {forecast: Product | undefined; fetchError: string} => {
  const {forecasts, fetchError} = useCenterForecasts(clientProps, center_id, date);
  return {forecast: forecasts.find(forecast => forecast.forecast_zone.find(zone => zone.id === forecast_zone_id)), fetchError: fetchError};
};

export const useCentersMetadata = (clientProps: ClientProps, center_ids: string[]): {centers: Record<string, AvalancheCenter>; centerFetchErrors: Record<string, string>} => {
  const client = NewClient(clientProps);
  const avalancheCenters = useAppSelector(selectAvalancheCenters);
  const dispatch = useAppDispatch();

  const [fetchErrors, setFetchErrors] = React.useState<Record<string, string>>({});

  // fetch center metadata
  React.useEffect(() => {
    let mounted = true;
    for (const centerId of center_ids) {
      if (!(avalancheCenters && avalancheCenters[centerId])) {
        client.center(
          centerId,
          (c: AvalancheCenter) => {
            const fetchedCenters: Record<string, AvalancheCenter> = {
              [centerId]: c,
            };
            dispatch(updateAvalancheCenters(fetchedCenters));
          },
          (error: Error) => {
            if (mounted) {
              setFetchErrors((state: Record<string, string>): Record<string, string> => {
                state[centerId] = String(error);
                return state;
              });
            }
          },
        );
      }
    }
  }, [center_ids]); // eslint-disable-line react-hooks/exhaustive-deps

  return {centers: avalancheCenters, centerFetchErrors: fetchErrors};
};

export const useCenterMetadata = (clientProps: ClientProps, center_id: string): {center: AvalancheCenter; centerFetchError: string} => {
  const {centers, centerFetchErrors} = useCentersMetadata(clientProps, [center_id]);
  return {center: centers[center_id], centerFetchError: centerFetchErrors[center_id]};
};

export const useMapLayers = (clientProps: ClientProps, center_ids: string[]): {mapLayers: Record<string, MapLayer>; fetchErrors: Record<sting, string>} => {
  const client = NewClient(clientProps);
  const mapLayers = useAppSelector(selectMapLayers);
  const dispatch = useAppDispatch();

  const [fetchErrors, setFetchErrors] = React.useState<Record<string, string>>({});

  // fetch map layers for every center, whenever the list of centers we care about changes
  React.useEffect(() => {
    let mounted = true;
    for (const center of center_ids) {
      // TODO(skuznets): in the future we should use e-tags or similar to re-fetch map layers when they change, since they contain the forecast data and can't be cached forever - or, we can render colors etc from other data
      if (!(mapLayers && mapLayers[center])) {
        client.mapLayer(
          center,
          (layer: MapLayer) => {
            const fetchedLayers: Record<string, MapLayer> = {};
            fetchedLayers[center] = layer;
            dispatch(updateMapLayers(fetchedLayers));
          },
          (error: Error) => {
            if (mounted) {
              setFetchErrors((state: Record<string, string>): Record<string, string> => {
                state[center] = String(error);
                return state;
              });
            }
          },
        );
      }
    }
  }, [center_ids]); // eslint-disable-line react-hooks/exhaustive-deps

  const layers: Record<string, MapLayer> = {};
  if (mapLayers) {
    for (const [center_id, layer] of Object.entries(mapLayers)) {
      if (center_ids.find(id => id === center_id)) {
        layers[center_id] = layer;
      }
    }
  }
  return {mapLayers: layers, fetchErrors: fetchErrors};
};
