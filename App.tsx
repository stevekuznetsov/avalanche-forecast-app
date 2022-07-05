/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Provider} from 'react-redux';

import {Map} from '@app/components/Map';
import {store} from '@app/api/avalanche/store';
import {AvalancheForecast} from '@app/components/AvalancheForecast';
import {ClientProps} from '@app/api/avalanche/Client';

const centers: string[] = [
  // Forest Service Offices
  'BTAC', // Bridger-Teton: ID, WY
  // 'CNFAIC', // Chugach: AK
  'FAC', // Flathead: MT
  'GNFAC', // Gallatin: MT, WY, ID
  'IPAC', // Idaho Panhandle: ID, MT
  'NWAC', // Northwest: WA, OR
  'MSAC', // Mount Shasta: CA
  // 'MWAC', // Mount Washington: NH
  'PAC', // Payette: ID
  'SNFAC', // Sawtooths: ID
  'SAC', // Sierra: CA
  'WCMAC', // West Central Montana: MT

  // State Offices
  'CAIC', // Colorado: CO

  // Local Non-profit Offices
  'COAA', // Central Oregon: OR
  'CBAC', // Crested Butte: CO
  'ESAC', // Eastern Sierra: CA
  'WAC', // Wallowas: OR
];

const clientProps: ClientProps = {host: 'https://api.avalanche.org'};

const App = () => {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        {/*<Map clientProps={clientProps} centers={centers} />*/}
        <AvalancheForecast clientProps={clientProps} id={111039} />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default App;
