import React from 'react';
import {AvalancheDangerForecast, DangerLevel} from '@app/api/avalanche/Types';
import Svg, {Path} from 'react-native-svg';
import {StyleSheet} from 'react-native';

const colorFor = (danger: DangerLevel): string => {
  switch (danger) {
    case (DangerLevel.None, DangerLevel.GeneralInformation):
      return 'rgb(147, 149, 152)';
    case DangerLevel.Low:
      return 'rgb(80, 184, 72)';
    case DangerLevel.Moderate:
      return 'rgb(255, 242, 0)';
    case DangerLevel.Considerable:
      return 'rgb(247, 148, 30)';
    case DangerLevel.High:
      return 'rgb(237, 28, 36)';
    case DangerLevel.Extreme:
      return 'rgb(35, 31, 32)';
  }
};

export const AvalancheDangerPyramid: React.FunctionComponent<
  AvalancheDangerForecast
> = (forecast: AvalancheDangerForecast) => {
  return (
    <Svg style={styles.svg} viewBox={'0 0 250 300'}>
      <Path
        d="M31.504,210l175,0l43.496,90l-250,0l31.504,-90Z"
        fill={colorFor(forecast.lower)}
        strokeWidth="0"
      />
      <Path
        d="M204.087,205l-170.833,0l31.503,-90l95.834,0l43.496,90Z"
        fill={colorFor(forecast.middle)}
        strokeWidth="0"
      />
      <Path
        d="M158.174,110l-91.666,0l38.504,-110l53.162,110Z"
        fill={colorFor(forecast.upper)}
        strokeWidth="0"
      />
      <Path
        d="M87.504,210l-7.504,90l-80,0l31.504,-90l56,0Zm7.92,-95l-7.504,90l-54.666,0l31.503,-90l30.667,0Zm-28.916,-5l38.504,-110l-9.171,110l-29.333,0Z"
        fill="rgb(30, 35, 38)"
        opacity="0.1"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  svg: {
    width: '250px',
    height: '300px',
  },
});
