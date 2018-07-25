import React from 'react';
import {View, Text, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView,
    Button, Alert,AsyncStorage, ToastAndroid} from 'react-native';

export default class ModifyAccount extends React.Component {
    static navigationOptions = {
        title: 'Modify Account',
      };
      async componentDidMount() {
        this.setState({original_key: this.props.navigation.getParam('key')});
    }
      state = {
        name: this.props.navigation.getParam('name', 'noname'),
		register_number: this.props.navigation.getParam('key', 'nokey'),
        password: this.props.navigation.getParam('password', 'nopassword'),
        processing: false,
	}
    render(){
        return(
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.info}>
                        Modify necessary fields and tap the save button.
                    </Text>
                    <View style={styles.form}>
                            <TextInput
                                underlineColorAndroid={'tomato'}
                                style={styles.input}
                                returnKeyType="next"
                                placeholder="Enter a name for this account"
                                onChangeText={(name) => this.setState({name})}
                                onSubmitEditing={() => this.registerInput.focus()}
                                value={this.state.name}
                            />
                            <TextInput
                                underlineColorAndroid={'tomato'}
                                style={styles.input}
                                returnKeyType="next"
                                onChangeText={(register_number) => this.setState({register_number})}
                                ref = {(input) => this.registerInput = input}
                                onSubmitEditing={() => this.passwordInput.focus()}
                                keyboardType="numeric"
                                value={this.state.register_number}
                            />
                            <TextInput 
                                underlineColorAndroid={'tomato'}
                                style={styles.input}
					            secureTextEntry
                                returnKeyType="go"
                                placeholder="Enter Your Password Here." style={styles.input} 
                                onChangeText={(password) => this.setState({password})}
                                ref = {(input) => this.passwordInput = input}
                                value={this.state.password}
                                onSubmitEditing={() => 
                                    controller.modifyAccount(this.state.name, this.state.register_number, this.state.password, this.state.original_key,this.props.navigation)
                                }
                                    />
                            <View style={{flexDirection:'row', justifyContent: 'space-around'}}>
                            <Button 
                            title="Save"
                            accessibilityLabel="Modify account with the above details."
                            onPress={() => {
                                controller.modifyAccount(this.state.name, this.state.register_number, this.state.password, this.state.original_key,this.props.navigation);
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
    modifyAccount: async function(name,reg_no, password, original_key,navigation){
        if(!(name == '' || password == '' || reg_no == '')){
        user_data = {name, reg_no, password};
        user_data['key'] = reg_no;
        const value = await AsyncStorage.getItem('ACCOUNTS');
        json_value = JSON.parse(value);
        pre_existing = json_value.find(x => x.reg_no===user_data.reg_no);
        if (pre_existing == undefined || pre_existing.reg_no === original_key){
            //Replace original with modified data
            original_index = json_value.findIndex(x => x.reg_no===original_key);
            json_value[original_index] = user_data;
            new_value = JSON.stringify(json_value);
            await AsyncStorage.setItem('ACCOUNTS', new_value);
            ToastAndroid.show(`Sucessfully Modified ${name}!`, ToastAndroid.SHORT);
            navigation.navigate('AccountsHome');
            if((JSON.parse(await AsyncStorage.getItem('ActiveAccount'))).key == original_key){
                AsyncStorage.removeItem('ActiveAccount')
              }
        } else {
            Alert.alert(`Register number ${reg_no} already in use for ${pre_existing.name}`);
            }
            
        
    } else {
        Alert.alert('Fields cannot be empty!')
    }
    }
};