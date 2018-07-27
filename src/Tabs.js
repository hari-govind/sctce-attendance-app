import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Summary from './components/Summary';
import Library from './components/Library';
import Detailed from './components/Detailed';
import Accounts from './components/Accounts';

/** 
export default class Tabs extends React.Component{
   render(){
       return(<Summary />);
    };
}*/

export default createBottomTabNavigator(
    {
      Accounts: Accounts,  
      Summary: Summary,
      Detailed: Detailed,
      Library: Library,
    },
    {
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === 'Accounts') {
            iconName = `md-people${focused ? '' : ''}`;
          } else if (routeName === 'Summary') {
            iconName = `md-clipboard${focused ? '' : ''}`;
          } else if (routeName === 'Detailed') {
            iconName = `md-trending-up${focused ? '' : ''}`;
          } else if (routeName === 'Library') {
            iconName = `md-book${focused ? '' : ''}`;
          }
  
          
          return <Ionicons name={iconName} size={25} color={tintColor} />;
        },
      }),
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',

      },
    }
  );