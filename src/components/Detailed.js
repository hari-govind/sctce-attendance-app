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
            this.setState({LoadingStatus: 'Downloading Attendance Data. Please Wait.'})
            this.setState({ActiveAccount: (JSON.parse(await AsyncStorage.getItem('ActiveAccount')))})
            ActiveAccount = this.state.ActiveAccount
            this.setState({hasActiveRecord: true})
            //binding this to reactThis to be used inside function block
            reactThis = this
           getDetailsJSON(ActiveAccount.reg_no,ActiveAccount.password)
            .then(function(data) {
                reactThis.setState({LoadingStatus: 'Processing Downloaded Data. Please Wait.'})
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

    async calendarMarkings() {
       detailedJSON = this.state.detailed
       result = {}
       for(i=0;i<detailedJSON.length;i++){
           num_of_abscents = detailedJSON[i]["AbNumHours"]
           num_of_presence = detailedJSON[i]["PrNumHours"]
           dots = [{color: 'orange'}]
           if(num_of_presence == 0){
               dots = [{color: 'red'}]
           } else if(num_of_abscents==0){
                dots = [{color: 'green'}]
           }
           result[detailedJSON[i]["Date"]] = {marked: true, dots: dots}
       }
       this.setState({markedDates: result})
    }

    async formatCalenderData(){
        detailedJSON = this.state.detailed
        startdate = detailedJSON[0].Date
        enddate = detailedJSON[detailedJSON.length - 1].Date
        
        result = {}

        //fill up all dates

        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
        
        function getDates(startDate, stopDate) {
            var dateArray = new Array();
            var currentDate = startDate;
            while (currentDate <= stopDate) {
                //convert date string to format like "2018-01-01" or yyyy-mm-dd
                day = currentDate.getDate()
                month = currentDate.getMonth()+1
                if (day.toString().length == 1){
                    day = `0${day}`
                }
                if (month.toString().length == 1){
                    month = `0${month}`
                }
                date_string = `${currentDate.getFullYear()}-${month}-${day}`
                dateArray.push(date_string);
                currentDate = currentDate.addDays(1);
            }
            return dateArray;
        }

        dates = getDates(new Date(startdate), new Date(enddate))
        for(i=0;i<dates.length;i++){
            result[dates[i]] = [{text:[{Status:'NW',Subject:'Data Not Entered', Teacher:'This is probably a holiday.',ID:'0'}]}]
        }

        //end of fill up all dates


        numberofmonths = Number(enddate.split("-")[1]) - Number(startdate.split("-")[1])
        for(i=0;i<detailedJSON.length;i++){
          period = []
          periods = detailedJSON[i]["Periods"]
          period.push({text: periods})
          result[detailedJSON[i]["Date"]] = period
        }
        this.setState({calenderData: result})
        this.calendarMarkings()
        this.setState({startdate})
        this.setState({enddate})
        this.setState({numberofmonths})
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
                        <Text style={{textAlign: 'center', color:'tomato',fontWeight:'bold'}}>{this.state.ActiveAccount.name}</Text>
                    </View>
                    <View>
                    <View style={{flex:1, paddingBottom: StatusBar.currentHeight}}>
                    <Agenda
                        renderKnob={() => {return (<View style={styles.knob}><Text style={styles.knobText}>PULL DOWN FOR CALENDAR</Text></View>);}}
                        markingType={'multi-dot'} 
                        markedDates = {this.state.markedDates}
                        pastScrollRange={this.state.numberofmonths+1}
                        futureScrollRange={1}
                        selected={this.state.enddate}
                        minDate={this.state.startdate}
                        maxDate={this.state.enddate}
                        style={{ width: Dimensions.get('window').width}}
                        items={this.state.calenderData}
                        renderItem={this.renderCalendarItem.bind(this)}
                        renderEmptyDate={() => {return (
                            <View style={[styles.item, {height: item.height, flex:1}]}>
                                <Text>No Data Entered.</Text>
                            </View>
                        );}}
                        renderEmptyData = {() => {return (
                            <View style={[styles.item, {flex:1}]}>
                                <Text>No Data Entered.</Text>
                            </View>
                        );}}
                        rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
                        theme={{
                            'stylesheet.day.multiDot' : {
                               dot: {
                                    width: 28,
                                    height: 4,
                                    marginTop: 1,
                                    marginLeft: 1,
                                    marginRight: 1,
                                    borderRadius: 4,
                                    opacity: 0
                              },
                          }
                        }}
                    />
                    </View>
                    </View>
                    </View>
                ) : <View><ActivityIndicator size={75} color="tomato" /><Text>{this.state.LoadingStatus}</Text></View>
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
            case 'NW':
                iconName = 'md-bicycle'
                tintColor = '#FB8C00'
                break
        }
        return(<Ionicons name={iconName} size={25} color={tintColor} />)
    }

    renderCalendarItem(item){
        list_data = item.text
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
    knob: {
        height: 12,
        paddingLeft:10,
        paddingRight: 10,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: '#29B6F6',
        marginTop: 5,
    },
    knobText: {
        color: 'white',
        fontSize: 8,
    }
})