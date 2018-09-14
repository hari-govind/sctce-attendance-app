import React from 'react';
import {View, Text, Image, StatusBar, StyleSheet, TouchableNativeFeedback} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class About extends React.Component {
    render(){
        return(
            <View style={styles.container}>
            <View style={styles.imageContainer}>
            <Image style={styles.image} source={require('../images/splash.jpg')} />
            </View>
            <View style={styles.textContainer}>
                <Text>About Us</Text>
            </View>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: StatusBar.currentHeight,
    },
    imageContainer: {
        flex: 1.5,
        flexDirection: 'column',
    },
    image: {
        flex: 1,
        aspectRatio: 1.06, 
        resizeMode: 'cover'
    },
    textContainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:0,
    }
})