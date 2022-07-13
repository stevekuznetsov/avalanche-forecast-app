import {ClientProps} from '@app/api/avalanche/Client';
import {useCentersForecasts, useMapLayers} from '@app/api/avalanche/hook';
import MapView, {LatLng, MapPolygonProps, Polygon, Region} from 'react-native-maps';
import React, {ReactNode} from 'react';
import {AvalancheDangerForecast, DangerLevel, ForecastPeriod, MapLayer, Product} from '@app/api/avalanche/Types';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {parseISO} from 'date-fns';
import {colorFor} from '@app/components/AvalancheDangerPyramid';

const toPolygons = (layer: MapLayer, forecasts: Product[], navigation, date: string): MapPolygonProps[] => {
  let polygons: MapPolygonProps[] = [];
  for (const feature of layer.features) {
    if (feature.type === 'Feature') {
      let coordinates: LatLng[] = [];
      let coordinateList: number[][] = [];
      if (feature.geometry.type === 'Polygon') {
        const container: number[][][] = feature.geometry.coordinates;
        coordinateList = container[0];
      } else if (feature.geometry.type === 'MultiPolygon') {
        const container: number[][][][] = feature.geometry.coordinates;
        coordinateList = container[0][0];
      }
      for (const component of coordinateList) {
        coordinates.push({longitude: component[0], latitude: component[1]});
      }
      const forecast: Product | undefined = forecasts.find(item => item.forecast_zone.find(zone => zone.id === feature.id));
      let dangerLevel: DangerLevel = DangerLevel.None;
      if (forecast) {
        const currentDanger: AvalancheDangerForecast | undefined = forecast.danger.find(item => item.valid_day === ForecastPeriod.Current);
        if (currentDanger) {
          dangerLevel = Math.max(currentDanger.lower, currentDanger.middle, currentDanger.upper);
        }
      }

      polygons.push({
        nativeID: String(feature.id),
        coordinates: coordinates,
        fillColor: colorFor(dangerLevel).alpha(feature.properties.fillOpacity).string(),
        strokeColor: feature.properties.stroke,
        tappable: true,
        onPress: () => {
          navigation.navigate('Avalanche Forecast', {
            center_id: feature.properties.center_id,
            forecast_zone_id: feature.id,
            date: date,
          });
        },
      });
    }
  }
  return polygons;
};

const boundingRegion = (polygons: Record<string, MapPolygonProps[]>): Region => {
  // for the US, the "top left" corner of a map will have the largest latitude and smallest longitude
  let topLeft: LatLng = {
    longitude: 0,
    latitude: 0,
  };
  // similarly, the "bottom right" will have the smallest latitude and largest longitude
  let bottomRight: LatLng = {
    longitude: 0,
    latitude: 0,
  };

  for (const center in polygons) {
    if (polygons.hasOwnProperty(center)) {
      for (const polygon of polygons[center]) {
        for (const coordinate of polygon.coordinates) {
          // initialize our points to something on the polygons, so we always
          // end up centered around the polygons we're bounding
          if (topLeft.longitude === 0) {
            topLeft.longitude = coordinate.longitude;
            topLeft.latitude = coordinate.latitude;
            bottomRight.longitude = coordinate.longitude;
            bottomRight.latitude = coordinate.latitude;
          }
          if (coordinate.longitude < topLeft.longitude) {
            topLeft.longitude = coordinate.longitude;
          }
          if (coordinate.longitude > bottomRight.longitude) {
            bottomRight.longitude = coordinate.longitude;
          }

          if (coordinate.latitude > topLeft.latitude) {
            topLeft.latitude = coordinate.latitude;
          }
          if (coordinate.latitude < bottomRight.latitude) {
            bottomRight.latitude = coordinate.latitude;
          }
        }
      }
    }
  }

  return {
    latitude: (topLeft.latitude + bottomRight.latitude) / 2,
    latitudeDelta: 1.05 * (topLeft.latitude - bottomRight.latitude),
    longitude: (topLeft.longitude + bottomRight.longitude) / 2,
    longitudeDelta: 1.05 * (bottomRight.longitude - topLeft.longitude),
  };
};

const defaultRegion: Region = {
  // TODO(skuznets): add a sane default for the US?
  latitude: 47.454188397509135,
  latitudeDelta: 3,
  longitude: -121.769123046875,
  longitudeDelta: 3,
};

export interface MapProps {
  clientProps: ClientProps;
  centers: string[];
  date: string;
  navigation;
}

export const Map: React.FunctionComponent<MapProps> = ({clientProps, centers, date, navigation}: MapProps) => {
  const forecastDate: Date = parseISO(date);
  const {mapLayers, fetchErrors} = useMapLayers(clientProps, centers);
  const {forecasts, fetchError} = useCentersForecasts(clientProps, centers, forecastDate);
  const [isReady, setIsReady] = React.useState<boolean>(false);

  let polygons: Record<string, MapPolygonProps[]> = {};
  for (const center_id in mapLayers) {
    polygons[center_id] = toPolygons(mapLayers[center_id], forecasts, navigation, date);
  }

  let region: Region = defaultRegion;
  const bounds: Region = boundingRegion(polygons);
  if (bounds.longitudeDelta !== 0) {
    region = bounds;
  }

  if (fetchErrors && Object.keys(fetchErrors).length > 0) {
    let message: string = '';
    for (const center in fetchErrors) {
      if (fetchErrors.hasOwnProperty(center)) {
        message += ', ' + center + ': ' + fetchErrors[center];
      }
    }
    Alert.alert('Error fetching map layers.', message, [
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

  if (fetchError) {
    Alert.alert('Error fetching forecasts.', fetchError, [
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

  function setReady() {
    setIsReady(true);
  }

  let toDisplay: ReactNode[] = [];
  for (const center in polygons) {
    if (polygons.hasOwnProperty(center)) {
      for (const polygon of polygons[center]) {
        toDisplay.push(<Polygon key={polygon.nativeID} {...polygon} />);
      }
    }
  }

  return (
    <MapView style={styles.map} initialRegion={defaultRegion} region={region} onLayout={setReady}>
      {isReady && toDisplay.map(a => a)}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
