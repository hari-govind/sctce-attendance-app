import React from 'react';
import {View, Text, Image, StatusBar, StyleSheet, Dimensions,ScrollView, Linking} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class About extends React.Component {
    render(){
        return(
            <View style={styles.container}>
            <View style={styles.imageContainer}>
            <Image style={styles.image} source={require('../images/splash.jpg')} />
            </View>
            <ScrollView style={styles.textContainer}>
            <View style={{alignItems:'center', flex:1}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color:'tomato',textShadowColor: 'rgba(0,0,0,.85)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5}}>SCTCE</Text>
            <Text style={{color:'gray'}}>Unofficial Attendance App v2</Text>
            <View style={{borderTopWidth:StyleSheet.hairlineWidth, flex:1, borderTopColor:'gray',width:Dimensions.get('window').width}}>
            </View>
            </View>
            <View style={{padding: 12}}>
                <Text style={styles.caption}>View your attendance in a mobile friendly manner.</Text>
                <Text style={styles.heading}>How to use</Text>
                <Text style={styles.caption}>On the Accounts tab, choose <Text style={{fontWeight: 'bold'}}>Add Account</Text> option and add your
                CampusSoft attendance login register number and password. Once the account is added, it can be
                 chosen from the <Text style={{fontWeight: 'bold'}}>Select Accounts</Text> menu. Select your added account and use the tabs <Text style={{fontWeight: 'bold'}}>Summary</Text> and <Text style={{fontWeight: 'bold'}}>Detailed</Text>,
                 to view the attendance summary and detailed attendance respectively.</Text>
                 <Text style={styles.heading}>How it works</Text>
                 <Text style={styles.caption}>The register number and password are stored in your device. 
                 To gather attendance data, the app will send your username and password to CampusSoft and will
                 retrieve your attendance data in HTML format. This data is then converted into a mobile friendly format
                 and shown to you.</Text>
                 <Text style={styles.heading}>Bugs and Feedback</Text>
                 <Text style={styles.caption}>Suggestions and bug reports can be mailed to me directly at 
                  <Text
                  style={{color:'blue'}}
                  onPress={() => Linking.openURL('mailto:hello@harigovind.org?Subject=SCTCE%20Application%20Feedback')}
                  > hello@harigovind.org
                  </Text>
                  </Text>
                  <Text style={{textAlign: 'center'}}>Developed by Hari Govind S</Text>
            </View>

            </ScrollView>
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
        flexDirection: 'column',
        marginTop:0,
    },
    caption: {
       color: 'gray',
       fontSize: 15,
    },
    heading: {
        color: 'tomato',
        fontSize: 18,
    }
})