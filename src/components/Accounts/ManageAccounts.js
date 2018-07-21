import React from 'react';
import {View, Text} from 'react-native';

export default class ManageAccounts extends React.Component {
    static navigationOptions = {
        title: 'Manage Accounts',
      };
    render(){
        return(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>ManageAccounts!!</Text>
        </View>
        );
    }
}