//tip of the day

import React from 'react';
import { Text, View, Linking } from 'react-native';

let tips = [
    <Text style={{ textAlign: 'center' }}>
        You can either click on the blue bar at the top that says "Pull down for calender"
        or click and drag it down to get monthly attendance view, which is especially handy when
        writing leave letters or condonation.
    </Text>,
    <Text style={{ textAlign: 'center' }}>
        This unofficial attendance app is completely opensource and the source code is
        <Text
            style={{ color: 'cornflowerblue' }}
            onPress={() => Linking.openURL('https://github.com/hari-govind/sctce-attendance-app')}
        > available here
        </Text>. Feel free to browse the source code and contribute.
    </Text>,
    <Text style={{ textAlign: 'center' }}>
        Got issues or suggestions? Feel free to say it
        <Text
            style={{ color: 'cornflowerblue' }}
            onPress={() => Linking.openURL('https://github.com/hari-govind/sctce-attendance-app/issues')}
        > here
        </Text> or email it to me.
    </Text>
]
export async function getMOTD() {
    let index = Math.floor(Math.random() * tips.length) //random tip
    tipComponent = <View>
        <Text style={{ color: 'tomato', textAlign: 'center' }}>
            Tip of the day
        </Text>
        {tips[index]}
    </View>
    return tipComponent;
}