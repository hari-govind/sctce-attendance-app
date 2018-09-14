import React from 'react';
import {View, Text, Image, StatusBar, StyleSheet, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class About extends React.Component {
    render(){
        return(
            <View style={styles.container}>
            <View style={styles.imageContainer}>
            <Image style={styles.image} source={require('../images/splash.jpg')} />
            </View>
            <View style={styles.textContainer}>
            <View style={{alignItems:'center', flex:1}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color:'tomato',textShadowColor: 'rgba(0,0,0,.85)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5}}>SCTCE</Text>
            <Text style={{color:'gray'}}>Unofficial Attendance App, v2</Text>
            <View style={{borderTopWidth:StyleSheet.hairlineWidth, flex:1, borderTopColor:'gray',width:Dimensions.get('window').width}}>
            </View>
            </View>
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
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:'black',
    },
    image: {
        flex: 1,
        aspectRatio: 1.06, 
        resizeMode: 'cover'
    },
    textContainer:{
        flex: 1,
        flexDirection: 'row',
        marginTop:0,
    }
})