import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

export default class SelectAccount extends React.Component {
    static navigationOptions = {
        title: 'Select Account',
      };
    render(){
        return(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Select Account!!</Text>
        </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column'
    },

});