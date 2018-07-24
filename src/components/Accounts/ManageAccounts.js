import React from 'react';
import {View, Text, AsyncStorage, SwipeableFlatList, StyleSheet,
        TouchableNativeFeedback, TouchableHighlight, ToastAndroid,
        Alert, Modal} from 'react-native';

   

export default class ManageAccounts extends React.Component {
    static navigationOptions = {
        title: 'Manage Accounts',
      };
      async componentDidMount() {
        record = await AsyncStorage.getItem('ACCOUNTS');
        rec = JSON.parse(record);
        this.setState({record: rec});
        this.setState({recordLoaded: true });
    }
    state = {
        recordLoaded: false
    }


    render(){
        return(
            <View styles={styles.container}>
             <Text style={styles.info}>Accounts stored on your phone are listed below. Swipe
              on the account to be modified or removed.</Text>

            {
                this.state.recordLoaded ? (
                   <SwipeableFlatList
                        bounceFirstRowOnMount={true}
                        maxSwipeDistance={160}
                        data={this.state.record}
                        renderItem={({item}) => 
                        <TouchableNativeFeedback 
                        style={styles.optionContent}
                        background={TouchableNativeFeedback.SelectableBackground()}
                        onPress={() => ToastAndroid.show('Only swiping is supported.',ToastAndroid.SHORT)
                    }
                        >
                        
                            <View style={styles.option}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.register}>{item.reg_no}</Text>
                            </View>
                        </TouchableNativeFeedback>  
                        }
                        renderQuickActions={({item}) => 
                        <View style={styles.actionsContainer}>
                        <TouchableHighlight
                          style={styles.actionButton}
                          onPress={() => {
                            this.props.navigation.navigate('ModifyAccount')
                          }}>
                          <Text style={styles.actionButtonText}>Edit</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                          style={[styles.actionButton, styles.actionButtonDestructive]}
                          onPress={() => {
                            Alert.alert(
                              'Tips',
                              'You could do something with this remove action!',
                            );
                          }}>
                          <Text style={styles.actionButtonText}>Remove</Text>
                        </TouchableHighlight>
                </View>
                        }
                   />
                ) : <Text>
                    Loading
                </Text>
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
    seperator:{
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    option: {
        padding:12,
        justifyContent:'center',
        backgroundColor:'white',
    },
    optionContent: {

    },
    actionButton: {
        padding: 10,
        width: 80,
        backgroundColor: '#999999',
      },
      actionButtonDestructive: {
        backgroundColor: '#FF0000',
      },
      actionButtonText: {
        textAlign: 'center',
    },
    actionsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    }
});