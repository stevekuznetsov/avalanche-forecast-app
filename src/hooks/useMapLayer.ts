import React from 'react';

import axios, {AxiosError} from 'axios';
import {useQuery} from 'react-query';

import {ClientContext, ClientProps} from '../../App';
import {MapLayer} from '@app/api/avalanche/Types';

export const useMapLayer = (center_id: string) => {
  const clientProps = React.useContext<ClientProps>(ClientContext);
  return useQuery<MapLayer, AxiosError | Error>(['map-layer', center_id], async () => {
    const {data} = await axios.get<MapLayer>(`${clientProps.host}/v2/public/products/map-layer/${center_id}`);
    return data;
  });
};
