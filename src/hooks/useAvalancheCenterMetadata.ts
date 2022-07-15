import React from 'react';

import axios, {AxiosError} from 'axios';
import {useQuery} from 'react-query';

import {ClientContext} from '../../App';
import {ClientProps} from '@app/api/avalanche/Client';
import {AvalancheCenter} from '@app/api/avalanche/Types';

export const useAvalancheCenterMetadata = (center_id: string) => {
  const clientProps = React.useContext<ClientProps>(ClientContext);
  return useQuery<AvalancheCenter, AxiosError | Error>(['avalanche-center', center_id], async () => {
    const {data} = await axios.get<AvalancheCenter>(`${clientProps.host}/v2/public/avalanche-center/${center_id}`);
    return data;
  });
};
