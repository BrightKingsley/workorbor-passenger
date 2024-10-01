// src/screens/SearchScreen.tsx
import {useAuth} from '@clerk/clerk-expo';
import {Octicons} from '@expo/vector-icons';
import axios from 'axios';
import {useRouter} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';

import {Button, IconButton, Row} from '$/src/components/global';
import {ButtonText} from '$/src/components/global/Button';
import TextInput from '$/src/components/global/TextInput';
import {Text, View} from '$/src/components/global/Themed';
import ViewHeader from '$/src/components/global/ViewHeader';
import {Container} from '$/src/components/utils';
import useApi from '$/src/hooks/api/useApi';
import {a} from '$/src/lib/style/atoms';
import {colors} from '$/src/lib/theme/palette';

const SearchScreen = () => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const {getToken} = useAuth();
  const {search} = useApi().users;
  const router = useRouter();

  const handleSearch = async () => {
    try {
      const users = await search({params: {username}});
      if (!users) return;
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConnect = async (targetUserId: string) => {
    const token = await getToken();
    try {
      await axios.post(
        `http://<your-backend-url>/api/users/connect`,
        {targetUserId},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      alert('Connection request sent!');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log({users});
  }, [users]);

  return (
    <Container>
      <ViewHeader
        canGoBack={true}
        titleComponent={
          <TextInput
            placeholder="Search by username"
            value={username}
            onChangeText={setUsername}
            style={[a.w_full, a.border_tint(colors.lightgrey)]}
            containerStyle={[a.flex_1, a.mr_xs, a.ml_lg]}
            trailing={
              <>
                <Button
                  onPress={handleSearch}
                  shape="round"
                  color="primary"
                  variant="solid"
                  testID="search_button"
                  style={[
                    a.my_xs,
                    a.w_(40),
                    a.h_(40),
                    a.align_center,
                    a.justify_center,
                  ]}>
                  <Octicons name="search" color={colors.light} size={14} />
                </Button>
                {/* <Button
                  onPress={handleSearch}
                  shape="round"
                  color="primary"
                  variant="solid"
                  testID="search_button"
                  style={[a.px_sm, a.my_xs]}>
                  <ButtonText>search</ButtonText>
                </Button> */}
              </>
            }
          />
        }
      />
      {/* <Text style={[a.text_lg]}>Search Users</Text> */}
      <View style={{}}>
        {/* <TextInput
           placeholder="Search by username"
           value={username}
           onChangeText={setUsername}
           style={{borderBottomWidth: 1, marginBottom: 16}}
         />
         */}
        {/* <Button
          variant="solid"
          shape="round"
          color="primary"
          accessibilityLabel="search"
          onPress={() => router.push('/(tabs)/account')}>
          <ButtonText>Search</ButtonText>
        </Button> */}
        <FlatList
          data={users}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={{marginVertical: 8}}>
              <Text>{item.username}</Text>
              <Text>{item.email}</Text>
              <Button
                variant="solid"
                shape="round"
                color="primary"
                accessibilityLabel="connect"
                onPress={() => handleConnect(item._id)}>
                <ButtonText>Connect</ButtonText>
              </Button>
            </View>
          )}
        />
      </View>
    </Container>
  );
};

export default SearchScreen;
