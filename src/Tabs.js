import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Summary from './components/Summary';
import About from './components/About';
import Detailed from './components/Detailed';
import Accounts from './components/Accounts';

/** 
export default class Tabs extends React.Component{
   render(){
       return(<Summary />);
    };
}*/

//export default createBottomTabNavigator(
const TabNavigator = createBottomTabNavigator(
    {
      Accounts: Accounts,  
      Summary: Summary,
      Detailed: Detailed,
      About: About,
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === 'Accounts') {
            iconName = `md-people${focused ? '' : ''}`;
          } else if (routeName === 'Summary') {
            iconName = `md-clipboard${focused ? '' : ''}`;
          } else if (routeName === 'Detailed') {
            iconName = `md-trending-up${focused ? '' : ''}`;
          } else if (routeName === 'About') {
            iconName = `md-book${focused ? '' : ''}`;
          }
  
          
          return <Ionicons name={iconName} size={25} color={tintColor} />;
        },
      }),
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        showIcon: true,
      },
    }
  );

  export default createAppContainer(TabNavigator);
