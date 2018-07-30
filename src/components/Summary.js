import React from 'react';
import {View, Text, AsyncStorage, ActivityIndicator, StyleSheet
    , FlatList, StatusBar, Image} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import TextTicker from "react-native-text-ticker";
import {getSummaryJSON} from './DataProcessor/dataProcessor.js';

export default class Summary extends React.Component {

    async reloadData(){
        this.setState({error: false})
        try{
            this.setState({isLoaded: false})
            this.setState({ActiveAccount: (JSON.parse(await AsyncStorage.getItem('ActiveAccount')))})
            ActiveAccount = this.state.ActiveAccount
            this.setState({hasActiveRecord: true})
            reactThis = this
           getSummaryJSON(ActiveAccount.reg_no,ActiveAccount.password)
            .then(function(data) {
                return data;
            })
            .then(function(details){
                reactThis.setState({summary: details})
                date = new Date()
                updated_date = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
                reactThis.setState({updated_date})
                reactThis.setState({isLoaded: true})
                reactThis.setState({loadedKey:reactThis.state.ActiveAccount.key})
            })
            .catch((err) => {
                reactThis.setState({error: true})
            })
        } catch (err) {
            reactThis.setState({hasActiveRecord: false})
            console.log('Err' + err)
        }
    }

    async reloadIfNeeded() {
        try{
        active = JSON.parse(await AsyncStorage.getItem('ActiveAccount'))
        if(active.key!=this.state.loadedKey){
            this.reloadData()
        }}
        catch (err) {
            this.setState({hasActiveRecord: false})
        }
    }

    async componentDidMount(){
        this.setState({error: false})
        this.reloadData()
    }


    state = {
        isLoaded: false,
    }
    
    render(){
        return(
            <View style={this.isLoaded ? styles.container : styles.loadingContainer}>
            <NavigationEvents
            onDidFocus={() => this.reloadIfNeeded()}
            />
            {
        this.state.isLoaded ? (
            <View>
            <View style={styles.student_info}>
            <View>
            <TextTicker
          style={styles.student_info_text}
          loop
          bounce
          repeatSpacer={50}
          marqueeDelay={1000}
          >{`${this.state.summary.Student.Name} 🖊 ${this.state.summary.Student.Branch} 🖊 ${this.state.summary.Student.RollNo}`}
          </TextTicker>
          </View>
          <View style={styles.header_details}>
          <View style={styles.image_container}>
          <Image style={styles.image} source={require('../images/logo.jpg')} />
          </View>
          <View style={styles.overall_container}>
              <Text style={{color:'white', fontSize:15, textDecorationLine:'underline'}}>OVERALL SUMMARY</Text>  
              <FlatList
              data={this.state.summary.Overall}
              renderItem = {({item}) =>
                <Text style={{color:'white'}}>
                    {item.key} : <Text style={{fontWeight: 'bold'}}>{item.percentage}</Text>
                </Text> 
              }
              />
          </View>
          </View>
          <View style={styles.date_container}>
              <Text style={styles.date}> Last Updated: {this.state.updated_date}</Text>
          </View>
          </View>
        <Text>{JSON.stringify(this.state.summary)}</Text>
        </View>
        ) : (
        this.state.hasActiveRecord?(
        <View><ActivityIndicator size={75} color="tomato" /><Text>Processing Data, Please Wait.</Text></View>) : <Text>
            No Active Records Found. Please select an account from main menu.
        </Text>
        
        )
            }
        </View>
        );
    }
}


const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent:'center', 
        alignItems:'center'},
    container: {
        flexDirection: 'column'
    },
    student_info: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
        flexDirection: 'column',
        backgroundColor: 'tomato',
    },
    student_info_text: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    overall_container: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

    },
    header_details: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'white',
        flexDirection: 'row',
        padding: 5,
        flex:1
    },
    image_container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        borderWidth: 1,
		width: 100,
		height: 100,
		borderRadius:100,
    },
    date: {
        color:'white',
    },
    date_container: {
        justifyContent: 'center',
        alignItems: 'center',
        margin:0,
    },
})