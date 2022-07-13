import React from 'react';
import {Text, View, Alert, SectionList, SectionListData, StyleSheet, TouchableOpacity} from 'react-native';
import {ClientProps} from '@app/api/avalanche/Client';
import {useCentersMetadata} from '@app/api/avalanche/hook';
import {AvalancheCenter} from '@app/api/avalanche/Types';
import {AvalancheCenterLogo} from '@app/components/AvalancheCenterLogo';

const centerIds: string[] = [
  // Forest Service Offices
  'BTAC', // Bridger-Teton: ID, WY
  'CNFAIC', // Chugach: AK
  'FAC', // Flathead: MT
  'GNFAC', // Gallatin: MT, WY, ID
  'IPAC', // Idaho Panhandle: ID, MT
  'NWAC', // Northwest: WA, OR
  'MSAC', // Mount Shasta: CA
  'MWAC', // Mount Washington: NH
  'PAC', // Payette: ID
  'SNFAC', // Sawtooths: ID
  'SAC', // Sierra: CA
  'WCMAC', // West Central Montana: MT

  // State Offices
  'CAIC', // Colorado: CO

  // Local Non-profit Offices
  'COAA', // Central Oregon: OR
  'CBAC', // Crested Butte: CO
  'ESAC', // Eastern Sierra: CA
  'WAC', // Wallowas: OR
];

const centerIdsByType: Record<string, string[]> = {
  ['Forest Service']: ['BTAC', 'CNFAIC', 'FAC', 'GNFAC', 'IPAC', 'NWAC', 'MSAC', 'MWAC', 'PAC', 'SNFAC', 'SAC', 'WCMAC'],
  ['State']: ['CAIC'],
  ['Local Non-Profit']: ['COAA', 'CBAC', 'ESAC', 'WAC'],
};

export interface AvalancheCenterSelectorProps {
  clientProps: ClientProps;
  date: string;
  navigation;
}

export const AvalancheCenterSelector: React.FunctionComponent<AvalancheCenterSelectorProps> = ({clientProps, date, navigation}: AvalancheCenterSelectorProps) => {
  const {centers, centerFetchErrors} = useCentersMetadata(clientProps, centerIds);
  if (centerFetchErrors && Object.keys(centerFetchErrors).length > 0) {
    let message: string = '';
    for (const center in centerFetchErrors) {
      if (centerFetchErrors.hasOwnProperty(center)) {
        message += ', ' + center + ': ' + centerFetchErrors[center];
      }
    }
    Alert.alert('Error fetching center metadata.', message, [
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

  const centersByType: SectionListData<AvalancheCenter>[] = [];
  for (const centerType in centerIdsByType) {
    const theseCenters: AvalancheCenter[] = [];
    for (const centerId of centerIdsByType[centerType]) {
      if (centers[centerId]) {
        theseCenters.push(centers[centerId]);
      }
    }
    centersByType.push({
      title: centerType,
      data: theseCenters,
    });
  }

  return (
    <SectionList
      style={styles.container}
      sections={centersByType}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Select An Avalanche Forecast Zone', {centerId: item.id, date: date})}>
          <AvalancheCenterLogo style={styles.logo} centerId={item.id} />
          <Text style={{textAlignVertical: 'center'}}>{item.name}</Text>
        </TouchableOpacity>
      )}
      renderSectionHeader={({section: {title}}) => <Text style={styles.title}>{title + ' Centers'}</Text>}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  item: {
    height: 60,
    padding: 2,
    flexDirection: 'row',
    textAlignVertical: 'center',
  },
  logo: {
    height: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    paddingBottom: 5,
    elevation: 4,
  },
});
