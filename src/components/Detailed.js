import React from 'react';
import {View, ScrollView, Text, AsyncStorage, StyleSheet,
    StatusBar, ActivityIndicator, Dimensions, FlatList} from 'react-native';
import {getDetailsJSON} from './DataProcessor/dataProcessor.js';
import { NavigationEvents } from 'react-navigation';
import {Agenda} from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';


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
                reactThis.formatCalenderData()
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

    async formatCalenderData(){
        detailedJSON = this.state.detailed
        result = {}
        for(i=0;i<detailedJSON.length;i++){
          period = []
          periods = detailedJSON[i]["Periods"]
          period.push({text: periods})
          result[detailedJSON[i]["Date"]] = period
        }
        this.setState({calenderData: result})
    }
    renderSeparator = () => {
        return (
          <View
            style={styles.seperator}
          />
        );
    };

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
                    <View style={{flex:1}}>
                    <View style={{marginTop: StatusBar.currentHeight}}>
                        <Text>Detailed Attendance for {this.state.ActiveAccount.name}</Text>
                    </View>
                    <View>
                    <View style={{flex:1, paddingBottom: StatusBar.currentHeight}}>
                    <Agenda
                        style={{ width: Dimensions.get('window').width}}
                        items={this.state.calenderData}
                        renderItem={this.renderCalendarItem.bind(this)}
                        renderEmptyDate={() => {return (<View><Text>Not a working day.</Text></View>);}}
                        rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
                    />
                    </View>
                    </View>
                    </View>
                ) : <View><ActivityIndicator size={75} color="tomato" /><Text>Processing Data, Please Wait.</Text></View>
            }
        </View>
        );
    }

    renderIcon(status){
        var iconName = 'ios-help-circle'
        var tintColor = '#512DA8'
        switch (status) {
            case 'P':
                iconName = 'ios-checkmark-circle'
                tintColor = '#388E3C'
                break
            case 'A':
                iconName = 'ios-close-circle'
                tintColor = '#d32f2f'
                break
        }
        return(<Ionicons name={iconName} size={25} color={tintColor} />)
    }

    renderCalendarItem(item){
        list_data = item.text
        //<Text>{item.text[0].Subject}{console.log(item.text[0]["Subject"])}</Text>
        return(<View style={[styles.item, {height: item.height, flex:1}]}>
        <FlatList
            ItemSeparatorComponent={this.renderSeparator} 
            data={list_data}
            keyExtractor={item => item.ID}
            renderItem = {({item}) =>
            <View style={styles.data_container}>
                 <View style={styles.data_icon}>{this.renderIcon(item.Status)}</View> 
                 <View style={styles.data_subject_container}>
                 <Text style={styles.subject}>{item.Subject}</Text>
                 <Text style={styles.teacher}>{item.Teacher}</Text>
                 </View>
              </View>
        }
        />
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
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    data_container: {
        flexDirection:'row'
    },
    data_icon: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    data_subject_container: {
        flex: 4,
        padding:12,
    },
    subject: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    teacher: {
        fontSize: 15,
    },
    seperator:{
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
})