import React from 'react';
import {ClientProps, NewClient} from '@app/api/avalanche/Client';
import {useAppDispatch, useAppSelector} from '@app/api/avalanche/hook';
import {selectProducts, updateProducts} from '@app/api/avalanche/store';
import {
  AvalancheDangerForecast,
  dangerIcon,
  DangerLevel,
  ForecastPeriod,
  Product,
} from '@app/api/avalanche/Types';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {format, parseISO} from 'date-fns';
import {AvalancheDangerPyramid} from '@app/components/AvalancheDangerPyramid';

export interface AvalancheForecastProps {
  clientProps: ClientProps;
  id: number;
}

export const AvalancheForecast: React.FunctionComponent<
  AvalancheForecastProps
> = ({clientProps, id}: AvalancheForecastProps) => {
  const client = NewClient(clientProps);
  const products = useAppSelector(selectProducts);
  const dispatch = useAppDispatch();

  const [forecast, setForecast] = React.useState<Product>();
  const [fetchError, setFetchError] = React.useState<string>('');

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
            setFetchError(String(error));
          }
        },
      );
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (fetchError) {
    Alert.alert('Error fetching forecast.', fetchError, [
      {
        text: 'OK',
      },
    ]);
    return;
  }

  if (!forecast) {
    return <Text>Loading...</Text>;
  }

  const currentDanger: AvalancheDangerForecast = forecast.danger.filter(
    item => item.valid_day === ForecastPeriod.Current,
  )[0];
  const highestDangerToday: DangerLevel = Math.max(
    currentDanger.lower,
    currentDanger.middle,
    currentDanger.upper,
  );

  return (
    // TODO(skuznets): the default text size for this WebView is tiny. Why?
    <View style={styles.view}>
      <View>
        <Text>THE BOTTOM LINE</Text>
        <View style={{flexDirection: 'row'}}>
          <Image
            style={styles.logo}
            source={{
              uri: dangerIcon(highestDangerToday),
            }}
          />
          <WebView textZoom={100} source={{html: forecast.bottom_line}} />
        </View>
      </View>
      <View>
        <Text>AVALANCHE DANGER</Text>
        <Text>{prettyFormat(forecast.published_time)}</Text>
        <AvalancheDangerPyramid {...currentDanger} />
      </View>
    </View>
  );
};

const prettyFormat = (date: string): string => {
  return format(parseISO(date), 'EEEE, MMMM d, yyyy');
};

const styles = StyleSheet.create({
  view: {
    ...StyleSheet.absoluteFillObject,
  },
  logo: {
    width: 66,
    height: 58,
  },
  svg: {
    width: '250px',
    height: '300px',
  },
});
