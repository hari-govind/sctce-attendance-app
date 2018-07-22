import React from 'react';
import {View, Text, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView,
    Button, Alert,AsyncStorage} from 'react-native';

export default class AddAccount extends React.Component {
    static navigationOptions = {
        title: 'Add Account',
      };
      state = {
        name:'',
		register_number: '',
        password: '',
        processing: false,
	}
    render(){
        return(
            <ScrollView>
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
                                onSubmitEditing={() => this.registerInput.focus()}
                            />
                            <TextInput
                                underlineColorAndroid={'tomato'}
                                style={styles.input}
                                returnKeyType="next"
                                placeholder="Enter collage registration number"
                                onChangeText={(register_number) => this.setState({register_number})}
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
                                ref = {(input) => this.passwordInput = input}
                                onSubmitEditing={() => controller.addAccount(this.state.name, this.state.register_number, this.state.password)}
				            />
                            <View style={{flexDirection:'row', justifyContent: 'space-around'}}>
                            <Button 
                            title="Add Account"
                            accessibilityLabel="Add account with the above details."
                            onPress={() => {
                                controller.addAccount(this.state.name, this.state.register_number, this.state.password);
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
        color: 'tomato'
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
        if(!(name == '' || password == '' || reg_no == '')){
        user_data = {name, reg_no, password};
        user_data['key'] = reg_no;
        const value = await AsyncStorage.getItem('ACCOUNTS');
        if(value==null){
            all_accounts = JSON.stringify([user_data]);
            await AsyncStorage.setItem('ACCOUNTS', all_accounts);
            Alert.alert(`Sucessfully Added ${name}!`);
        } else {
            json_value = JSON.parse(value);
            pre_existing = json_value.find(x => x.reg_no===user_data.reg_no);
            if (pre_existing == undefined){
                json_value.push(user_data);
                new_value = JSON.stringify(json_value);
                await AsyncStorage.setItem('ACCOUNTS', new_value);
                Alert.alert(`Sucessfully Added ${name}!`);
            } else {
                Alert.alert(`Register number ${reg_no} already in use for ${pre_existing.name}`);
            }
            
        }
    } else {
        Alert.alert('Fields cannot be empty!')
    }
    }
};