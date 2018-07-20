import React from 'react';
import {View, Text} from 'react-native';

export default class Library extends React.Component {
    render(){
        return(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Library Page!</Text>
        </View>
        );
    }
}