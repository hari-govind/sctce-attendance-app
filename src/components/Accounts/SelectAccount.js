import React from 'react';
import {View, Text, StyleSheet, FlatList,AsyncStorage, TouchableNativeFeedback,
Button, Alert, ToastAndroid} from 'react-native';

export default class SelectAccount extends React.Component {

 async setActiveAccount(account) {
            await AsyncStorage.setItem('ActiveAccount', JSON.stringify(account));
            ToastAndroid.show(`Active Account is now ${(JSON.parse(await AsyncStorage.getItem('ActiveAccount'))).name}`,ToastAndroid.SHORT)
            this.setState({ActiveAccount: (JSON.parse(await AsyncStorage.getItem('ActiveAccount'))).name})
            this.setState({hasActiveRecord: true})
        }

    async componentDidMount() {
        record = await AsyncStorage.getItem('ACCOUNTS');
        rec = JSON.parse(record);
        this.setState({record: rec});
        this.setState({recordLoaded: true });
        try{
        this.setState({ActiveAccount: (JSON.parse(await AsyncStorage.getItem('ActiveAccount'))).name})
        this.setState({hasActiveRecord: true})
        } catch (err){
            //pass
        }
    }

    static navigationOptions = {
        title: 'Select Account',
      };
     state ={
         recordLoaded: false,
         hasActiveRecord:false,
        }

        renderSeparator = () => {
            return (
              <View
                style={styles.seperator}
              />
            );
        };

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.info}>
                    Select active account from below. 
                    Attendance details of the active user is shown in the attendance tab. 
                    {
                     this.state.hasActiveRecord ? (
                    <Text>Current Active account is <Text style={{color:'tomato'}}>{this.state.ActiveAccount}</Text>.</Text>
                     ) : <Text>
                         Name of the currently active account will appear here.
                     </Text>
                    }
                </Text>
                <Button
                    title="Clear"
                    onPress={() => AsyncStorage.clear()}
                />
                {
                 this.state.recordLoaded ? (    
                <FlatList
                    
                    data={this.state.record}
                    renderItem={({item}) => 
                        <TouchableNativeFeedback 
                        style={styles.optionContent}
                        background={TouchableNativeFeedback.SelectableBackground()}
                        onPress={() => this.setActiveAccount(item)
                        }
                        >
                        
                            <View style={styles.option}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.register}>{item.reg_no}</Text>
                            </View>
                        </TouchableNativeFeedback>  
                        
                    }
                    ItemSeparatorComponent={this.renderSeparator}
                />) : <Text>Loading...</Text>
                }
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
    },
    name: {
        fontSize: 18,
        justifyContent:'center',
      },
    register: {
        color: 'gray',
        justifyContent:'center',
    },
    separator: {
        flexDirection:'row',
        flex: 1,
        height: 3,
        backgroundColor: 'red',
    },
    option: {
        padding:12,
        justifyContent:'center',
    },
    optionContent: {

    },
});

