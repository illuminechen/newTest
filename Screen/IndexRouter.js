import React, { Component } from 'react'
import { Router, Scene, Drawer, Stack } from 'react-native-router-flux'

import LoginScreen from './LoginScreen'
import CrtAccount from './CrtAccount'
import RCScreen from './RCSreen'
import SettingScreen from './SettingScreen'
import MainScreen from './MainScreen'
import VisitScreen from './VisitScreen'
import StaScreen from './StaScreen'

class IndexRouter extends Component {
    render() {
        return (
            <Router>
                <Drawer
                    key={'DrawerView'} hideNavBar={true}
                >
                    <Stack key="root">
                        <Scene key="LoginScreen"
                            hideNavBar={true} initial
                            component={LoginScreen}
                        />
                        <Scene key="CrtAccount"
                            hideNavBar={true}
                            component={CrtAccount}
                        />
                        <Scene key="MainScreen"
                            hideNavBar={true}
                            component={MainScreen}
                        />
                        <Scene key="RCScreen"
                            hideNavBar={true}
                            component={RCScreen}
                        />
                        <Scene key="VisitScreen"
                            hideNavBar={true}
                            component={VisitScreen}
                        />
                        <Scene key="StaScreen"
                            hideNavBar={true}
                            component={StaScreen}
                        />
                        <Scene key="SettingScreen"
                            hideNavBar={true}
                            component={SettingScreen}
                        />
                    </Stack>
                </Drawer>
            </Router>
        )
    }
}

export default IndexRouter;