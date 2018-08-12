import React from 'react';
import {View, ScrollView, Text, AsyncStorage, StyleSheet,
    StatusBar, ActivityIndicator} from 'react-native';
import {getDetailsJSON} from './DataProcessor/dataProcessor.js';
import { NavigationEvents } from 'react-navigation';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default class Detailed extends React.Component {

    async reloadData(){
        this.setState({error: false})
        try{
            this.setState({isLoaded: false})
            this.setState({ActiveAccount: (JSON.parse(await AsyncStorage.getItem('ActiveAccount')))})
            ActiveAccount = this.state.ActiveAccount
            this.setState({hasActiveRecord: true})
            reactThis = this
           getDetailsJSON(ActiveAccount.reg_no,ActiveAccount.password)
            .then(function(data) {
                return data;
            })
            .then(function(details){
                reactThis.setState({detailed: details})
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
            this.setState({hasActiveRecord: false})
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
                    <View style={{marginTop: StatusBar.currentHeight}}>
                        <Text>Detailed Attendance for {this.state.ActiveAccount.name}</Text>
                    </View>
                    <ScrollView>
                    <Text>{JSON.stringify(this.state.detailed)}</Text>
                    </ScrollView>
                    </View>
                ) : <View><ActivityIndicator size={75} color="tomato" /><Text>Processing Data, Please Wait.</Text></View>
            }
            <Calender />
        </View>
        );
    }
}


styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent:'center', 
        alignItems:'center'},
    container: {
        flexDirection: 'column',
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    },
})