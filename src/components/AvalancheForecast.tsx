import React from 'react';
import {ClientProps, NewClient} from '@app/api/avalanche/Client';
import {useAppDispatch, useAppSelector} from '@app/api/avalanche/hook';
import {
  selectAvalancheCenters,
  selectProducts,
  updateAvalancheCenters,
  updateProducts,
} from '@app/api/avalanche/store';
import {
  AvalancheCenter,
  AvalancheDangerForecast,
  AvalancheForecastZone,
  dangerIcon,
  DangerLevel,
  ElevationBandNames,
  ForecastPeriod,
  Product,
} from '@app/api/avalanche/Types';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {parseISO} from 'date-fns';
import {AvalancheDangerTable} from '@app/components/AvalancheDangerTable';
import RenderHTML from 'react-native-render-html';
import {AvalancheDangerIcon} from '@app/components/AvalancheDangerIcon';

export interface AvalancheForecastProps {
  clientProps: ClientProps;
  center_id: string;
  id: number;
  forecast_zone_id: number;
}

export const AvalancheForecast: React.FunctionComponent<
  AvalancheForecastProps
> = ({
  clientProps,
  center_id,
  id,
  forecast_zone_id,
}: AvalancheForecastProps) => {
  const client = NewClient(clientProps);
  const products = useAppSelector(selectProducts);
  const avalancheCenters = useAppSelector(selectAvalancheCenters);
  const dispatch = useAppDispatch();

  const [forecast, setForecast] = React.useState<Product>();
  const [center, setCenter] = React.useState<AvalancheCenter>();
  const [fetchError, setFetchError] = React.useState<string>('');
  const {width} = useWindowDimensions();

  // fetch forecast when the id changes
  React.useEffect(() => {
    let mounted = true;
    // TODO(skuznets): in the future we should use e-tags or similar to re-fetch products when they change
    if (products && products[id]) {
      setForecast(products[id]);
    } else {
      client.productById(
        id,
        (product: Product) => {
          const fetchedProducts: Record<string, Product> = {};
          fetchedProducts[id] = product;
          dispatch(updateProducts(fetchedProducts));
          setForecast(product);
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
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // fetch center metadata when the center id changes
  React.useEffect(() => {
    let mounted = true;
    if (avalancheCenters && avalancheCenters[center_id]) {
      setCenter(avalancheCenters[center_id]);
    } else {
      client.center(
        center_id,
        (c: AvalancheCenter) => {
          const fetchedCenters: Record<string, AvalancheCenter> = {};
          fetchedCenters[center_id] = c;
          dispatch(updateAvalancheCenters(fetchedCenters));
          setCenter(c);
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
  }, [center_id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (fetchError) {
    Alert.alert('Error fetching forecast.', fetchError, [
      {
        text: 'OK',
      },
    ]);
    return;
  }

  if (!forecast || !center) {
    return <Text>Loading...</Text>;
  }

  const currentDanger: AvalancheDangerForecast | undefined =
    forecast.danger.find(item => item.valid_day === ForecastPeriod.Current);
  if (!currentDanger) {
    Alert.alert('No danger recorded.', '', [
      {
        text: 'OK',
      },
    ]);
    return;
  }
  const highestDangerToday: DangerLevel = Math.max(
    currentDanger.lower,
    currentDanger.middle,
    currentDanger.upper,
  );

  let outlookDanger: AvalancheDangerForecast | undefined = forecast.danger.find(
    item => item.valid_day === ForecastPeriod.Tomorrow,
  );
  if (!outlookDanger || !outlookDanger.upper) {
    // sometimes, we get an entry of nulls for tomorrow
    outlookDanger = {
      lower: DangerLevel.None,
      middle: DangerLevel.None,
      upper: DangerLevel.None,
      valid_day: ForecastPeriod.Tomorrow,
    };
  }

  const zone: AvalancheForecastZone | undefined = center.zones.find(
    item => item.id === forecast_zone_id,
  );
  if (!zone) {
    Alert.alert(
      'Avalanche forecast zone not found',
      `No such zone ${forecast_zone_id} for center ${center_id}.`,
      [
        {
          text: 'OK',
        },
      ],
    );
    return;
  }
  const elevationBandNames: ElevationBandNames =
    zone.config.elevation_band_names;

  return (
    <ScrollView style={styles.view}>
      <View>
        <View style={styles.bound}>
          <AvalancheDangerIcon style={styles.icon} level={highestDangerToday} />
          <View style={styles.content}>
            <Text style={styles.title}>THE BOTTOM LINE</Text>
            <RenderHTML
              source={{html: forecast.bottom_line}}
              contentWidth={width}
            />
          </View>
        </View>
      </View>
      <AvalancheDangerTable
        date={parseISO(forecast.published_time)}
        current={currentDanger}
        outlook={outlookDanger}
        elevation_band_names={elevationBandNames}
      />
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
