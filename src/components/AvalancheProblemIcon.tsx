import React, {ReactElement} from 'react';
import {Image, ImageStyle} from 'react-native';

import {AvalancheProblemType} from '@app/api/avalanche/Types';

export interface AvalancheProblemIconProps {
  style: ImageStyle;
  problem: AvalancheProblemType;
}

interface size {
  width: number;
  height: number;
}

export const AvalancheProblemIcon: React.FunctionComponent<
  AvalancheProblemIconProps
> = ({style, problem}: AvalancheProblemIconProps) => {
  const sizes: Record<AvalancheProblemType, size> = {
    [AvalancheProblemType.DryLoose]: Image.resolveAssetSource(
      require('@app/images/problem-icons/DryLoose.png'),
    ),
    [AvalancheProblemType.StormSlab]: Image.resolveAssetSource(
      require('@app/images/problem-icons/StormSlab.png'),
    ),
    [AvalancheProblemType.WindSlab]: Image.resolveAssetSource(
      require('@app/images/problem-icons/WindSlab.png'),
    ),
    [AvalancheProblemType.PersistentSlab]: Image.resolveAssetSource(
      require('@app/images/problem-icons/PersistentSlab.png'),
    ),
    [AvalancheProblemType.DeepPersistentSlab]: Image.resolveAssetSource(
      require('@app/images/problem-icons/DeepPersistentSlab.png'),
    ),
    [AvalancheProblemType.WetLoose]: Image.resolveAssetSource(
      require('@app/images/problem-icons/WetLoose.png'),
    ),
    [AvalancheProblemType.WetSlab]: Image.resolveAssetSource(
      require('@app/images/problem-icons/WetSlab.png'),
    ),
    [AvalancheProblemType.CorniceFall]: Image.resolveAssetSource(
      require('@app/images/problem-icons/CorniceFall.png'),
    ),
    [AvalancheProblemType.Glide]: Image.resolveAssetSource(
      require('@app/images/problem-icons/Glide.png'),
    ),
  };

  const images: Record<AvalancheProblemType, {(s: ImageStyle): ReactElement}> =
    {
      [AvalancheProblemType.DryLoose]: (s: ImageStyle) => {
        return (
          <Image
            style={s}
            source={require('@app/images/problem-icons/DryLoose.png')}
          />
        );
      },
      [AvalancheProblemType.StormSlab]: (s: ImageStyle) => {
        return (
          <Image
            style={s}
            source={require('@app/images/problem-icons/StormSlab.png')}
          />
        );
      },
      [AvalancheProblemType.WindSlab]: (s: ImageStyle) => {
        return (
          <Image
            style={s}
            source={require('@app/images/problem-icons/WindSlab.png')}
          />
        );
      },
      [AvalancheProblemType.PersistentSlab]: (s: ImageStyle) => {
        return (
          <Image
            style={s}
            source={require('@app/images/problem-icons/PersistentSlab.png')}
          />
        );
      },
      [AvalancheProblemType.DeepPersistentSlab]: (s: ImageStyle) => {
        return (
          <Image
            style={s}
            source={require('@app/images/problem-icons/DeepPersistentSlab.png')}
          />
        );
      },
      [AvalancheProblemType.WetLoose]: (s: ImageStyle) => {
        return (
          <Image
            style={s}
            source={require('@app/images/problem-icons/WetLoose.png')}
          />
        );
      },
      [AvalancheProblemType.WetSlab]: (s: ImageStyle) => {
        return (
          <Image
            style={s}
            source={require('@app/images/problem-icons/WetSlab.png')}
          />
        );
      },
      [AvalancheProblemType.CorniceFall]: (s: ImageStyle) => {
        return (
          <Image
            style={s}
            source={require('@app/images/problem-icons/CorniceFall.png')}
          />
        );
      },
      [AvalancheProblemType.Glide]: (s: ImageStyle) => {
        return (
          <Image
            style={s}
            source={require('@app/images/problem-icons/Glide.png')}
          />
        );
      },
    };
  let actualStyle: ImageStyle = {...style};
  if (actualStyle.height) {
    actualStyle.width = undefined;
  } else {
    actualStyle.height = undefined;
  }
  actualStyle.aspectRatio = sizes[problem].width / sizes[problem].height;
  return images[problem](actualStyle);
};
