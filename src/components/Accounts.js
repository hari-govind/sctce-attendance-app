import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, Text, Image, FlatList, StyleSheet, TouchableNativeFeedback} from 'react-native';
import { Font } from 'expo';
import AddAccount from './Accounts/AddAccount';
import SelectAccount from './Accounts/SelectAccount';
import ManageAccounts from './Accounts/ManageAccounts';
import ModifyAccount from './Accounts/ModifyAccount';
import { createStackNavigator } from 'react-navigation';


export default class Accounts extends React.Component {
   render(){
       return(<RootStack />);
   }
}

class AccountsHome extends React.Component{
    async componentDidMount() {
        await Font.loadAsync({
          'kanit': require('../../assets/fonts/Kanit-Black.ttf'),
        });
        this.setState({ fontLoaded: true });
      }
      state = {
        fontLoaded: false,
      };
      static navigationOptions = {
        header: null,
      };
    render(){
        return(
        <View style={styles.container}>
        <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('../images/accounts_main.jpeg')} />
        <View style={styles.headingContainer}>
        {
        this.state.fontLoaded ? (
        <Text style={[styles.heading, {fontFamily: 'kanit',textShadowColor: 'rgba(0,0,0,.75)',
        textShadowOffset: {width: 5, height: 5},
        textShadowRadius: 10}]}>SCTCE</Text>
        ): null
        }
        <Text style={{color: 'white', backgroundColor: 'rgba(0,0,0,.45)',fontWeight: 'bold', paddingBottom:10, margin:0,
        }}>Unoffical Students App for SCTCE, Thiruvananthapuram.</Text>
        </View>
        </View>
        <View style={styles.optionsContainer}>
        <FlatList
          data={[
            {screen:'SelectAccount',key: 'md-person', option: 'Select Account', caption: 'Select Account to be used.cfyhn '},
            {screen:'AddAccount',key: 'md-person-add', option: 'Add Account', caption: 'Add user accounts for easy access'},
            {screen:'ManageAccounts',key: 'md-construct', option: 'Manage Accounts', caption: 'Edit details of stored accounts.'},
          ]}
          renderItem={({item}) => 
          <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} 
          onPress={() => this.props.navigation.navigate(item.screen)}>
          <View style={styles.optionContainer}>
          <Ionicons name={item.key} size={25} color="tomato" style={styles.icon} />
          <Text style={styles.option}>{item.option}</Text>
          </View>
          </TouchableNativeFeedback>
        }
        />


        </View>
        </View>
        );
    }
}



const RootStack = createStackNavigator({
    AccountsHome: {
      screen: AccountsHome,
    },
    AddAccount: {
      screen: AddAccount,
    },
    SelectAccount: {
      screen: SelectAccount,  
    },
    ManageAccounts: {
      screen: ManageAccounts,  
    },
    ModifyAccount: {
        screen: ModifyAccount,
    },
    },
    {
      initialRouteName: 'AccountsHome',
      //headerMode: 'none',
    }
    );


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    imageContainer: {
        flex: 1.5,
        flexDirection: 'column',
    },
    optionsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:0,
    },
    image: {
        flex: 1,
        aspectRatio: 2, 
        resizeMode: 'contain'
    },
    
    heading: {
        fontSize: 50,
        color: 'tomato',
        bottom: -10,
        padding:0,

    },
    headingContainer: {
        position: 'absolute',
        justifyContent: 'center', 
        bottom: 0,
    },
    option: {
        padding: 10,
        fontSize: 18,
        height: 44,
        marginLeft: 12,
    },
    optionContainer: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    }
})
