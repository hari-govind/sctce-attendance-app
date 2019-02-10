import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
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
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === 'Accounts') {
            iconName = `md-people${focused ? '' : ''}`;
          } else if (routeName === 'Summary') {
            iconName = `md-clipboard${focused ? '' : ''}`;
          } else if (routeName === 'Detailed') {
            iconName = `trending-up${focused ? '' : ''}`;
          } else if (routeName === 'About') {
            iconName = `book${focused ? '' : ''}`;
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

  export default createAppContainer(TabNavigator);