import React from 'react';
import {ClientProps} from '@app/api/avalanche/Client';
import {useCenterMetadata, useForecast} from '@app/api/avalanche/hook';
import {AvalancheDangerForecast, AvalancheForecastZone, DangerLevel, ElevationBandNames, ForecastPeriod, Product} from '@app/api/avalanche/Types';
import {Alert, ScrollView, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {parseISO} from 'date-fns';
import {AvalancheDangerTable} from '@app/components/AvalancheDangerTable';
import RenderHTML from 'react-native-render-html';
import {AvalancheDangerIcon} from '@app/components/AvalancheDangerIcon';
import {AvalancheProblemCard} from '@app/components/AvalancheProblemCard';

export interface AvalancheForecastProps {
  clientProps: ClientProps;
  center_id: string;
  date: string;
  forecast_zone_id: number;
}

export const AvalancheForecast: React.FunctionComponent<AvalancheForecastProps> = ({clientProps, center_id, date, forecast_zone_id}: AvalancheForecastProps) => {
  const forecastDate: Date = parseISO(date);

  const {width} = useWindowDimensions();
  const {forecast, fetchError} = useForecast(clientProps, center_id, forecast_zone_id, forecastDate);
  const {center, centerFetchError} = useCenterMetadata(clientProps, center_id);

  if (centerFetchError) {
    Alert.alert('Error fetching center metadata.', centerFetchError, [
      {
        text: 'OK',
      },
    ]);
    return (
      <View>
        <Text>{centerFetchError}</Text>
      </View>
    );
  }

  if (fetchError) {
    Alert.alert('Error fetching forecast.', fetchError, [
      {
        text: 'OK',
      },
    ]);
    return (
      <View>
        <Text>{fetchError}</Text>
      </View>
    );
  }

  if (!forecast || !center) {
    return <Text>Loading...</Text>;
  }

  const currentDanger: AvalancheDangerForecast | undefined = forecast.danger.find(item => item.valid_day === ForecastPeriod.Current);
  if (!currentDanger) {
    Alert.alert('No danger recorded.', '', [
      {
        text: 'OK',
      },
    ]);
    return (
      <View>
        <Text>{'No danger recorded'}</Text>
      </View>
    );
  }
  const highestDangerToday: DangerLevel = Math.max(currentDanger.lower, currentDanger.middle, currentDanger.upper);

  let outlookDanger: AvalancheDangerForecast | undefined = forecast.danger.find(item => item.valid_day === ForecastPeriod.Tomorrow);
  if (!outlookDanger || !outlookDanger.upper) {
    // sometimes, we get an entry of nulls for tomorrow
    outlookDanger = {
      lower: DangerLevel.None,
      middle: DangerLevel.None,
      upper: DangerLevel.None,
      valid_day: ForecastPeriod.Tomorrow,
    };
  }

  const zone: AvalancheForecastZone | undefined = center.zones.find(item => item.id === forecast_zone_id);
  if (!zone) {
    const message: string = `No such zone ${forecast_zone_id} for center ${center_id}.`;
    Alert.alert('Avalanche forecast zone not found', message, [
      {
        text: 'OK',
      },
    ]);
    return (
      <View>
        <Text>{message}</Text>
      </View>
    );
  }
  const elevationBandNames: ElevationBandNames = zone.config.elevation_band_names;

  return (
    <ScrollView style={styles.view}>
      <View>
        <View style={styles.bound}>
          <AvalancheDangerIcon style={styles.icon} level={highestDangerToday} />
          <View style={styles.content}>
            <Text style={styles.title}>THE BOTTOM LINE</Text>
            <RenderHTML source={{html: forecast.bottom_line}} contentWidth={width} />
          </View>
        </View>
      </View>
      <AvalancheDangerTable date={parseISO(forecast.published_time)} current={currentDanger} outlook={outlookDanger} elevation_band_names={elevationBandNames} />
      {forecast.forecast_avalanche_problems.map((problem, index) => (
        <AvalancheProblemCard key={`avalanche-problem-${index}`} problem={problem} names={elevationBandNames} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  view: {
    ...StyleSheet.absoluteFillObject,
  },
  icon: {
    position: 'absolute',
    top: -25,
    left: -25,
    height: 50,
  },
  bound: {
    margin: 25,
    borderStyle: 'solid',
    borderWidth: 1.2,
    borderColor: 'rgb(200,202,206)',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.8,
    shadowColor: 'rgb(157,162,165)',
  },
  content: {
    flexDirection: 'column',
    paddingTop: 15,
    paddingLeft: 15,
    paddingBottom: 0,
    paddingRight: 5,
  },
  title: {
    fontWeight: 'bold',
  },
});
