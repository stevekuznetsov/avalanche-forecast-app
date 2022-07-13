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
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';

import {Map} from '@app/components/Map';
import {store} from '@app/api/avalanche/store';
import {AvalancheForecast} from '@app/components/AvalancheForecast';
import {ClientProps} from '@app/api/avalanche/Client';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {AvalancheCenterSelector} from '@app/components/AvalancheCenterSelector';
import { formatISO } from "date-fns";

const clientProps: ClientProps = {host: 'https://api.avalanche.org'};

const SelectorScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <AvalancheCenterSelector clientProps={clientProps} date={formatISO(new Date('2022-03-01'))} navigation={navigation} />
    </SafeAreaView>
  );
};

const MapScreen = ({route, navigation}) => {
  const {centerId, date} = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Map clientProps={clientProps} centers={[centerId]} date={date} navigation={navigation} />
    </SafeAreaView>
  );
};

const ForecastScreen = ({route}) => {
  const {center_id, forecast_zone_id, date} = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <AvalancheForecast clientProps={clientProps} center_id={center_id} forecast_zone_id={forecast_zone_id} date={date} />
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Select An Avalanche Center">
            <Stack.Screen name="Select An Avalanche Center" component={SelectorScreen} />
            <Stack.Screen name="Select An Avalanche Forecast Zone" component={MapScreen} />
            <Stack.Screen name="Avalanche Forecast" component={ForecastScreen} />
          </Stack.Navigator>
          {/*<Map clientProps={clientProps} centers={centers} />*/}
          {/*<AvalancheForecast*/}
          {/*  clientProps={clientProps}*/}
          {/*  id={111039}*/}
          {/*  center_id={'NWAC'}*/}
          {/*  forecast_zone_id={428}*/}
          {/*/>*/}
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
});

export default App;
