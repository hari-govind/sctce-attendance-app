import React from 'react';
import {View, Text, StyleSheet, FlatList,AsyncStorage, TouchableNativeFeedback,
Button} from 'react-native';

export default class SelectAccount extends React.Component {

    async componentDidMount() {
        record = await AsyncStorage.getItem('ACCOUNTS');
        rec = JSON.parse(record);
        this.setState({record: rec});
        this.setState({recordLoaded: true });
    }

    static navigationOptions = {
        title: 'Select Account',
      };
     state ={
         recordLoaded: false
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
                        background={TouchableNativeFeedback.SelectableBackground()}>
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
