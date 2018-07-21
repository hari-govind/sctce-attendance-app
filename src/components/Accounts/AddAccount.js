import React from 'react';
import {View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacityl,
    Button, Alert} from 'react-native';

export default class AddAccount extends React.Component {
    static navigationOptions = {
        title: 'Add Account',
      };
      state = {
        name:'none',
		register_number: 'none',
        password: 'none',
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
                                //onSubmitEditing={() => this.props.navigation.navigate('AttendancePage', {reg_no: this.state.register_number, password: this.state.password})}
				            />
                            <View style={{flexDirection:'row', justifyContent: 'space-around'}}>
                            <Button 
                            title="Add Account"
                            accessibilityLabel="Add account with the above details."
                            onPress={() => {
                                Alert.alert('You tapped the button!');
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
        const value = await AsyncStorage.getItem('ACCOUNTS');

    }
};