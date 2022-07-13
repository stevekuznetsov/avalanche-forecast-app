import {ClientProps, NewClient} from '@app/api/avalanche/Client';
import {useAppDispatch, useAppSelector} from '@app/api/avalanche/hook';
import {selectMapLayers, updateMapLayers} from '@app/api/avalanche/store';
import MapView, {LatLng, MapPolygonProps, Polygon, Region} from 'react-native-maps';
import React, {ReactNode} from 'react';
import {MapLayer} from '@app/api/avalanche/Types';
import {Alert, StyleSheet} from 'react-native';

const toPolygons = (layer: MapLayer): MapPolygonProps[] => {
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
      polygons.push({
        nativeID: String(feature.id),
        coordinates: coordinates,
        fillColor: hexToRGBA(feature.properties.color, feature.properties.fillOpacity),
        strokeColor: feature.properties.stroke,
        // TODO(skuznets): add styling here for opacity etc
        // TODO(skuznets): tap should open forecast info and allow to link to forecast view
      });
    }
  }
  return polygons;
};

const hexToRGBA = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
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

// for the purposes of React, a `Record` does not change when the values inside
// change, since it is a reference type - so, when we update we need to re-create
// the record to get dependent effects to fire
const update = (previous: Record<string, MapPolygonProps[]>, key: string, value: MapPolygonProps[]): Record<string, MapPolygonProps[]> => {
  const updated: Record<string, MapPolygonProps[]> = {};
  for (const item in previous) {
    if (previous.hasOwnProperty(item)) {
      updated[item] = previous[item];
    }
  }
  updated[key] = value;
  return updated;
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
}

export const Map: React.FunctionComponent<MapProps> = ({clientProps, centers}: MapProps) => {
  const client = NewClient(clientProps);
  const mapLayers = useAppSelector(selectMapLayers);
  const dispatch = useAppDispatch();

  const [polygons, setPolygons] = React.useState<Record<string, MapPolygonProps[]>>({});
  const [fetchErrors, setFetchErrors] = React.useState<Record<string, string>>({});
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [region, setRegion] = React.useState<Region>(defaultRegion);

  // fetch map layers for every center, whenever the list of centers we care about changes
  React.useEffect(() => {
    let mounted = true;
    for (const center of centers) {
      // TODO(skuznets): in the future we should use e-tags or similar to re-fetch map layers when they change, since they contain the forecast data and can't be cached forever - or, we can render colors etc from other data
      if (mapLayers && mapLayers[center]) {
        setPolygons((state: Record<string, MapPolygonProps[]>): Record<string, MapPolygonProps[]> => {
          return update(state, center, toPolygons(mapLayers[center]));
        });
      } else {
        client.mapLayer(
          center,
          (layer: MapLayer) => {
            const fetchedLayers: Record<string, MapLayer> = {};
            fetchedLayers[center] = layer;
            dispatch(updateMapLayers(fetchedLayers));
            setPolygons((state: Record<string, MapPolygonProps[]>): Record<string, MapPolygonProps[]> => {
              return update(state, center, toPolygons(layer));
            });
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
  }, [centers]); // eslint-disable-line react-hooks/exhaustive-deps

  // compute the bounding region whenever the polygons change
  React.useEffect(() => {
    const bounds: Region = boundingRegion(polygons);
    if (bounds.longitudeDelta !== 0) {
      setRegion(bounds);
    }
  }, [centers, polygons]);

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
    return;
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
    <MapView style={styles.map} initialRegion={region} region={region} onLayout={setReady}>
      {isReady && toDisplay.map(a => a)}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
