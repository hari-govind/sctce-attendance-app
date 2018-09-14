import React from 'react';
import {View, Text, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView,
    Button, Alert,AsyncStorage, Modal, ActivityIndicator} from 'react-native';
 import {isValidLogin} from '../DataProcessor/dataProcessor.js';

export default class AddAccount extends React.Component {
    static navigationOptions = {
        title: 'Add Account',
      };
      state = {
        name:'',
		register_number: '',
        password: '',
        processing: false,
        showLoginLoading: false,
        isChecking: false,
	}
    render(){
        return(
            <ScrollView>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isChecking}
                    onRequestClose={() => {
                        alert('Close ?','This window will be closed and the account might not be added.');
                      }}
                >
                <View style={{flex: 1,
                    justifyContent:'center', 
                    alignItems:'center', marginTop: 22}}>
                <ActivityIndicator size={75} color="tomato" /><Text>Checking login, please wait.</Text>
                </View>
                </Modal>
                <View style={styles.container}>
                    <Text style={styles.info}>
                    Save your and your friends' login for quick access to attendance data.
                    </Text>
                    <View style={styles.form}>
                            <TextInput
                                underlineColorAndroid={'tomato'}
                                style={styles.input}
                                returnKeyType="next"
                                placeholder="Enter a name for this account"
                                onChangeText={(name) => this.setState({name})}
                                value={this.state.name}
                                onSubmitEditing={() => this.registerInput.focus()}
                            />
                            <TextInput
                                underlineColorAndroid={'tomato'}
                                style={styles.input}
                                returnKeyType="next" 
                                placeholder="Enter college registration number"
                                onChangeText={(register_number) => this.setState({register_number})}
                                value={this.state.register_number}
                                ref = {(input) => this.registerInput = input}
                                onSubmitEditing={() => this.passwordInput.focus()}
                                keyboardType="numeric"
                            />
                            <TextInput 
                                underlineColorAndroid={'tomato'}
                                style={styles.input}
					            secureTextEntry
                                returnKeyType="go"
                                placeholder="Enter Your Password Here." style={styles.input} 
                                onChangeText={(password) => this.setState({password})}
                                value={this.state.password}
                                ref = {(input) => this.passwordInput = input}
                                onSubmitEditing={() => {
                                    controller.addIfValid(this.state.name, this.state.register_number, this.state.password,this)
                                    this.state.name = ""
                                    this.state.register_number = ""
                                    this.state.password = ""
                                    this.forceUpdate();
                                }}
                            />
                            <View style={{flexDirection:'row', justifyContent: 'space-around'}}>
                            <Button 
                            title="Add Account"
                            accessibilityLabel="Add account with the above details."
                            onPress={() => {
                                controller.addIfValid(this.state.name, this.state.register_number, this.state.password,this);
                                this.state.name = ""
                                this.state.register_number = ""
                                this.state.password = ""
                                this.forceUpdate();
                            }}
                            color="tomato"
                            />
                            </View>
                    </View>
                </View>
            </ScrollView>
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
    form: {
        flex: 1,
        flexDirection:'column',
    },
    input: {
        flex: 1,
        padding: 10,
        marginBottom: 20,
        color: 'tomato',
    },
    buttonContainer: {
        backgroundColor: '#1565C0',
        paddingVertical: 15,
    },
    buttonText: {

    },
});


var controller = {
    addAccount: async function(name,reg_no, password){
        user_data = {name, reg_no, password};
        user_data['key'] = reg_no;
        const value = await AsyncStorage.getItem('ACCOUNTS');
        if(value==null){
            all_accounts = JSON.stringify([user_data]);
            await AsyncStorage.setItem('ACCOUNTS', all_accounts);
            Alert.alert('Account Sucessfully Added!', `You can now choose ${name} from Select Accounts menu.`);
        } else {
            json_value = JSON.parse(value);
            pre_existing = json_value.find(x => x.reg_no===user_data.reg_no);
            if (pre_existing == undefined){
                json_value.push(user_data);
                new_value = JSON.stringify(json_value);
                await AsyncStorage.setItem('ACCOUNTS', new_value);
                Alert.alert('Account Sucessfully Added!', `You can now choose ${name} from Select Accounts menu.`);

            } else {
                Alert.alert(`Register number ${reg_no} already in use for ${pre_existing.name}`,
                "The register number you've entered for this account is already in use for another account.");
            }
            
        }
    },
    addIfValid: async function (name,reg_no,password,this_ref){
        if(!(name == '' || password == '' || reg_no == '')){
            this_ref.setState({isChecking: true})
            loginResponse = await isValidLogin(reg_no,password)
            this_ref.setState({isChecking:false})
            if(loginResponse===true){
                controller.addAccount(name, reg_no,password)
            } else if(loginResponse===false){
                Alert.alert('Login Error', 'The register number or password you entered is incorrect. CampusSoft reset passwords every new semester, so if you have not already chosen a new password for this sem, kindly do so by logging in using your register number as username and password in CampusSoft.')
            } else {
                Alert.alert('Network Error', 'Please check if you have an active internet connection.')
            }
        } else {
            Alert.alert('Fields cannot be empty!')
        }
    }
};