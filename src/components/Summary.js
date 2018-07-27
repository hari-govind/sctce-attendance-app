import React from 'react';
import {View, Text, AsyncStorage, ActivityIndicator} from 'react-native';
import { NavigationEvents } from 'react-navigation';
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
        active = JSON.parse(await AsyncStorage.getItem('ActiveAccount'))
        if(active.key!=this.state.loadedKey){
            this.reloadData()
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <NavigationEvents
            onDidFocus={() => this.reloadIfNeeded()}
            />
            {
        this.state.isLoaded ? (
        <Text>{JSON.stringify(this.state.summary)}</Text>
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