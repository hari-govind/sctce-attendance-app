import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

export default class SelectAccount extends React.Component {
    static navigationOptions = {
        title: 'Select Account',
      };
    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.info}>
                    Select active account from below. 
                    Attendance details of the active user is shown in the attendance tab.
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column'
    },
    info: {
        padding: 12,
        color: 'gray',
    }
});