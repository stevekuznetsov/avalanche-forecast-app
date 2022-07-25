import React from 'react';

import { StyleSheet, Text, TouchableHighlight, useWindowDimensions, View } from "react-native";
import ImageView from 'react-native-image-viewing';

import {AvalancheProblem, AvalancheProblemSize, ElevationBandNames, MediaType} from '@app/api/avalanche/Types';
import {AnnotatedDangerRose, DangerRose} from '@app/components/DangerRose';
import {AvalancheProblemIcon} from '@app/components/AvalancheProblemIcon';
import {AvalancheProblemLikelihoodLine, likelihoodText} from '@app/components/AvalancheProblemLikelihoodLine';
import {AvalancheProblemSizeLine} from '@app/components/AvalancheProblemSizeLine';
import {TitledPanel} from '@app/components/TitledPanel';
import {AvalancheProblemImage} from '@app/components/AvalancheProblemImage';
import RenderHTML from "react-native-render-html";

export interface AvalancheProblemCardProps {
  problem: AvalancheProblem;
  names: ElevationBandNames;
}

const formatSizesShort = (size: AvalancheProblemSize[]): string => {
  if (size[0] === size[1]) {
    return `D${size[0]}`;
  }
  return `D${size[0]}-${size[1]}`;
};

export const AvalancheProblemCard: React.FunctionComponent<AvalancheProblemCardProps> = ({problem, names}: AvalancheProblemCardProps) => {
  const {width} = useWindowDimensions();

  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}>
        <TitledPanel title={'Problem Type'} style={styles.panel}>
          <AvalancheProblemIcon style={styles.largeIcon} problem={problem.avalanche_problem_id} />
          <Text style={{fontWeight: 'bold', textAlignVertical: 'center'}}>{problem.name}</Text>
        </TitledPanel>
        <TitledPanel title={'Aspect/Elevation'} style={styles.panel}>
          <AnnotatedDangerRose rose={{style: {width: '100%'}, locations: problem.location}} elevationBandNames={names} />
        </TitledPanel>
        <TitledPanel title={'Likelihood'} style={styles.panel}>
          <AvalancheProblemLikelihoodLine likelihood={problem.likelihood} />
        </TitledPanel>
        <TitledPanel title={'Size'} style={styles.panel}>
          <AvalancheProblemSizeLine size={problem.size} />
        </TitledPanel>
      </View>
      {problem.media.type === MediaType.Image && <AvalancheProblemImage media={problem.media} />}
      <View style={styles.content}>
        <RenderHTML source={{html: problem.discussion}} contentWidth={width} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 10,
    marginLeft: 10,
    margin: 5,
    borderStyle: 'solid',
    borderWidth: 1.2,
    borderColor: 'rgb(200,202,206)',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.8,
    shadowColor: 'rgb(157,162,165)',
  },
  text: {
    flex: 2,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  icon: {
    flex: 1,
    height: '100%',
    textAlignVertical: 'center',
    margin: 1,
  },
  panel: {
    width: '35%',
  },
  largeIcon: {
    width: '80%',
  },
  content: {
    flexDirection: 'column',
    paddingTop: 5,
    paddingLeft: 10,
    paddingBottom: 0,
    paddingRight: 10,
  },
});
