import React from 'react';
import {
  AvalancheDangerForecast,
  dangerIcon,
  DangerLevel,
  dangerText,
  ElevationBandNames,
} from '@app/api/avalanche/Types';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScaledSize,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  AvalancheDangerPyramid,
  AvalancheDangerTriangle,
} from '@app/components/AvalancheDangerPyramid';
import {addDays, format} from 'date-fns';
import {AvalancheDangerIcon} from '@app/components/AvalancheDangerIcon';

interface AvalancheDangerTableRowProps {
  danger: DangerLevel;
  outlook: DangerLevel;
  elevation_band_name: string;
  showOutlook: boolean;
}

const AvalancheDangerTableRow: React.FunctionComponent<
  AvalancheDangerTableRowProps
> = ({
  danger,
  outlook,
  elevation_band_name,
  showOutlook,
}: AvalancheDangerTableRowProps) => {
  return (
    <>
      <View style={styles.row}>
        <Text style={styles.elevation}>{elevation_band_name}</Text>
        <Text style={styles.text}>{dangerText(danger)}</Text>
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={{
              uri: dangerIcon(danger),
            }}
          />
        </View>
      </View>
      {showOutlook && (
        <View style={styles.row}>
          <Text style={styles.text}>{dangerText(outlook)}</Text>
          <View style={styles.smallerIconContainer}>
            <Image
              style={styles.icon}
              source={{
                uri: dangerIcon(outlook),
              }}
            />
          </View>
        </View>
      )}
    </>
  );
};

// TODO: left-align icons? maybe we need columns?

const prettyFormat = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};

export interface AvalancheDangerTableProps {
  date: Date;
  current: AvalancheDangerForecast;
  outlook: AvalancheDangerForecast;
  elevation_band_names: ElevationBandNames;
}

// const resizeModeFor = (url: string): ImageResizeMode => {
//   Image.getSize(url)
// }

const initialScreen: ScaledSize = Dimensions.get('screen');

export const AvalancheDangerTable: React.FunctionComponent<
  AvalancheDangerTableProps
> = ({
  date,
  current,
  outlook,
  elevation_band_names,
}: AvalancheDangerTableProps) => {
  const [dimensions, setDimensions] = React.useState<ScaledSize>(initialScreen);

  // determine screen size when the orientation changes
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({screen}) => {
      setDimensions(screen);
    });
    return () => subscription?.remove();
  });

  const isLandscape = (): boolean => {
    return dimensions.width > dimensions.height;
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <View style={{flexDirection: 'column', flex: 3, marginHorizontal: 10}}>
          <Text style={styles.title}>Avalanche Danger</Text>
          <Text>{prettyFormat(date)}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <AvalancheDangerPyramid {...current} />
            <View style={styles.column}>
              {[
                elevation_band_names.upper,
                elevation_band_names.middle,
                elevation_band_names.lower,
              ].map(name => (
                <Text
                  style={{...styles.elevation, ...styles.rowItem}}
                  key={`elevation_band_name-${name}`}>
                  {name}
                </Text>
              ))}
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={styles.column}>
                {[current.upper, current.middle, current.lower].map(level => (
                  <Text
                    style={{...styles.text, ...styles.rowItem}}
                    key={`danger_text-${level}`}>
                    {dangerText(level)}
                  </Text>
                ))}
              </View>
              <View style={styles.column}>
                {[current.upper, current.middle, current.lower].map(level => (
                  <AvalancheDangerIcon
                    style={styles.rowItem}
                    level={level}
                    key={`danger_icon-${level}`}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
        {isLandscape() && (
          <View
            style={{flexDirection: 'column', flex: 2, marginHorizontal: 10}}>
            <Text style={styles.title}>Outlook</Text>
            <Text>{prettyFormat(addDays(date, 1))}</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={styles.column}>
                <Text style={{...styles.text, ...styles.rowItem}}>
                  {dangerText(outlook.upper)}
                </Text>
                <Text style={{...styles.text, ...styles.rowItem}}>
                  {dangerText(outlook.middle)}
                </Text>
                <Text style={{...styles.text, ...styles.rowItem}}>
                  {dangerText(outlook.lower)}
                </Text>
              </View>
              <View style={styles.column}>
                <View style={styles.rowItem}>
                  <AvalancheDangerIcon
                    style={styles.smallerIconContainer}
                    level={outlook.upper}
                  />
                </View>
                <View style={styles.rowItem}>
                  <AvalancheDangerIcon
                    style={styles.smallerIconContainer}
                    level={outlook.middle}
                  />
                </View>
                <View style={styles.rowItem}>
                  <AvalancheDangerIcon
                    style={styles.smallerIconContainer}
                    level={outlook.lower}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
      {!isLandscape() && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            flexBasis: 1,
            marginVertical: 10,
          }}>
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.title}>Outlook</Text>
            <Text>{prettyFormat(addDays(date, 1))}</Text>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center', marginHorizontal: 50}}>
            <AvalancheDangerTriangle {...outlook} />
            <View style={{height: 30}}>
              <Text
                style={{
                  textAlignVertical: 'center',
                  flex: 1,
                }}>{`(${outlook.upper})`}</Text>
            </View>
            <View style={{height: 30}}>
              <Text
                style={{
                  textAlignVertical: 'center',
                  flex: 1,
                }}>{`(${outlook.middle})`}</Text>
            </View>
            <View style={{height: 30}}>
              <Text
                style={{
                  textAlignVertical: 'center',
                  flex: 1,
                }}>{`(${outlook.lower})`}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    height: 50,
    width: 90,
    borderColor: 'rgb(40, 140, 40)',
    borderWidth: 1,
  },
  icon: {
    resizeMode: 'contain',
    height: '100%',
    width: 'auto',
    borderColor: 'rgb(20, 20, 20)',
    borderWidth: 1,
  },
  smallerIconContainer: {
    height: 40,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignContent: 'flex-start',
  },
  rowItem: {
    height: 50,
    textAlignVertical: 'center',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: 10,
  },
  text: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    flex: 1,
  },
  elevation: {
    flex: 1,
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingBottom: 10,
  },
});
