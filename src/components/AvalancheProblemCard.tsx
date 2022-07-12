import React from 'react';
import {
  AvalancheProblem,
  AvalancheProblemSize,
  ElevationBandNames,
} from '@app/api/avalanche/Types';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {AnnotatedDangerRose, DangerRose} from '@app/components/DangerRose';
import {AvalancheProblemIcon} from '@app/components/AvalancheProblemIcon';
import {
  AvalancheProblemLikelihoodLine,
  likelihoodText,
} from '@app/components/AvalancheProblemLikelihoodLine';
import {AvalancheProblemSizeLine} from '@app/components/AvalancheProblemSizeLine';

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

export const AvalancheProblemCard: React.FunctionComponent<
  AvalancheProblemCardProps
> = ({problem, names}: AvalancheProblemCardProps) => {
  const [open, setOpen] = React.useState<boolean>(true);
  const toggle = () => {
    setOpen(!open);
  };

  return (
    <TouchableHighlight onPress={toggle}>
      {open ? (
        <View
          style={{
            ...styles.card,
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}>
          <View
            style={{
              ...styles.panel,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <AvalancheProblemIcon
              style={styles.largeIcon}
              problem={problem.avalanche_problem_id}
            />
            <Text style={{fontWeight: 'bold', textAlignVertical: 'center'}}>
              {problem.name}
            </Text>
          </View>
          <View style={styles.panel}>
            <AnnotatedDangerRose
              rose={{style: {width: '100%'}, locations: problem.location}}
              elevationBandNames={names}
            />
          </View>
          <View style={styles.panel}>
            <AvalancheProblemLikelihoodLine likelihood={problem.likelihood} />
          </View>
          <View style={styles.panel}>
            <AvalancheProblemSizeLine size={problem.size} />
          </View>
        </View>
      ) : (
        <View style={{...styles.card, height: 50}}>
          <View style={styles.icon}>
            <AvalancheProblemIcon
              style={styles.icon}
              problem={problem.avalanche_problem_id}
            />
          </View>
          <Text style={styles.text}>{problem.name}</Text>
          <View style={styles.icon}>
            <DangerRose style={{height: '100%'}} locations={problem.location} />
          </View>
          <Text style={styles.icon}>{likelihoodText(problem.likelihood)}</Text>
          <Text style={styles.icon}>{formatSizesShort(problem.size)}</Text>
        </View>
      )}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
