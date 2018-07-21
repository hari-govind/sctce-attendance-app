import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

export default class AddAccount extends React.Component {
    static navigationOptions = {
        title: 'Add Account',
      };
    render(){
        return(
            <ScrollView>
        <Text>Add Account.</Text>
        </ScrollView>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column'
    },

});