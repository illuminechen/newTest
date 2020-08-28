import React, { Component } from 'react'
import { View, StyleSheet, TextInput, Alert, ScrollView, AsyncStorage } from 'react-native'
import { Button, Dialog, Portal, List } from 'react-native-paper'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// actions
import { toggleLanguage } from '../Actions/toogleLanguage'
import { toogleFontsize } from '../Actions/toogleFontsize'
import { toogleTheme } from '../Actions/toogleTheme'
import { getDistrict } from '../Actions/getDistrict'
import { login } from '../Actions/login'

//components
import { churchList } from '../Component/churchList'

import { Actions } from 'react-native-router-flux' // pages navigation
import moment from 'moment' // time
import * as firebase from 'firebase'

class LoginScreen extends Component {
    state = {
        districtName: '台北市召會', districtId: '1', districtOp: false, churchName: '', churchOp: false,
        account: '', captcha_code: '', church_id: '0', district: '1', language: 'zh-tw', pwd: '',
    }
    async componentDidMount() {
        try {
            console.log("componentDidMount asyncstorage",
                await AsyncStorage.multiGet(['fontSize', 'theme', 'language', 'account'])
            )
            await this.props.toogleFontsize(
                await AsyncStorage.getItem('fontSize') ? await AsyncStorage.getItem('fontSize') : 'medium'
            )
            await this.props.toogleTheme(
                await AsyncStorage.getItem('theme') ? await AsyncStorage.getItem('theme') : 'starWhite'
            )
            await this.props.toggleLanguage(
                await AsyncStorage.getItem('language') ? await AsyncStorage.getItem('language') : 'zh'
            )
            this.setState({
                account: await AsyncStorage.getItem('account') ? await AsyncStorage.getItem('account') : '',
                church_id: await AsyncStorage.getItem('church_id') ? await AsyncStorage.getItem('church_id') : '0',
                pwd: await AsyncStorage.getItem('pwd') ? await AsyncStorage.getItem('pwd') : ''
            })
            const { account, church_id, district, language, pwd } = this.state
            await this.props.login({ account, church_id, district, language, pwd })
            //await AsyncStorage.clear()
        } catch (e) {
            console.log("componentDidMount", e)
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.loginLength !== this.props.loginLength) {
            this.loginSelect()
        }
    }
    getDistrictApi = () => {
        if (this.state.districtId === '1') {
            this.props.getDistrict()
        }
    }
    onLogin = () => {
        const { account, church_id, district, language, pwd } = this.state
        this.props.login({ account, church_id, district, language, pwd })
    }
    loginSelect = async () => {
        if (this.props.loginLength >= 112000) {
            try {
                console.log("login success", this.props.loginLength)
                await AsyncStorage.multiSet([
                    ['account', this.state.account], ['church_id', this.state.church_id],
                    ['district', this.state.district], ['language', this.state.language],
                    ['pwd', this.state.pwd]
                ])
                console.log("save loginInfo",
                    await AsyncStorage.multiGet(['account', 'church_id', 'district', 'language', 'pwd'])
                )
                Actions.MainScreen()
            } catch (e) { console.log("loginSelect error", e) }
            console.log("login success", this.props.loginLength)
        }
        else if (this.props.loginLength <= 100000) {
            this.setState({ account: '', pwd: '' })
            const title = String(this.props.lanData.logErrTitle)
            const msg = String(this.props.lanData.logErrMsg)
            return (
                Alert.alert(
                    title, msg,
                    [{ text: 'OK'/*, onPress: () => console.log('OK Pressed')*/ },]
                )
            )
        }
    }
    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log("user exist")
            } else {
                console.log("no user")
            }
        })
    }
    render() {
        return (
            <View style={[styles.container, this.props.themeData.MthemeB]}>
                <View style={styles.pickerView}>
                    <Button
                        icon="menu-down" mode="contained"
                        labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                        contentStyle={{ width: 230 }}
                        style={[this.props.themeData.XLthemeB,
                        { borderRadius: 18, elevation: 12, marginVertical: 8, paddingHorizontal: 10 }]}
                        onPress={() => this.setState({ districtOp: true })}
                    >{this.state.districtName}</Button>
                </View>
                <View style={styles.pickerView}>
                    <Button
                        icon="menu-down" mode="contained"
                        labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                        contentStyle={{ width: 230 }}
                        style={[this.props.themeData.XLthemeB,
                        { borderRadius: 18, elevation: 12, marginVertical: 8, paddingHorizontal: 10 }]}
                        onPress={() => { this.setState({ churchOp: true }, this.getDistrictApi) }}
                    >{this.state.churchName}</Button>
                </View>
                <View style={styles.pickerView}>
                    <TextInput
                        autoCapitalize='none' placeholderTextColor={this.props.themeData.Stheme}
                        placeholder={this.props.lanData.account}
                        onChangeText={text => this.setState({ account: text })}
                        value={this.state.account} textAlignVertical="center"
                        style={[
                            this.props.themeData.MthemeB, this.props.ftszData.button,
                            this.props.themeData.SthemeBo, this.props.themeData.XLtheme, styles.textInput
                        ]}
                    />
                </View>
                <View style={styles.pickerView}>
                    <TextInput
                        autoCapitalize='none' placeholderTextColor={this.props.themeData.Stheme}
                        placeholder={this.props.lanData.password}
                        secureTextEntry={true}
                        onChangeText={text => this.setState({ pwd: text })}
                        value={this.state.pwd} textAlignVertical="center"
                        style={[
                            this.props.themeData.MthemeB, this.props.ftszData.button,
                            this.props.themeData.SthemeBo, this.props.themeData.XLtheme, styles.textInput
                        ]}
                    />
                </View>
                <View style={styles.pickerView}>
                    <Button
                        mode="contained"
                        labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                        contentStyle={{ width: 150 }}
                        style={[this.props.themeData.SthemeB, { borderRadius: 18, elevation: 12, marginVertical: 8 }]}
                        onPress={() => this.onLogin()}
                    >{this.props.lanData.logIn}</Button>
                </View>
                <View style={{ justifyContent: 'space-around', width: 200, flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Button
                        labelStyle={[this.props.ftszData.paragraph, this.props.themeData.SStheme]}
                        onPress={() => Actions.CrtAccount()}
                    >{this.props.lanData.noAccount}</Button>
                    <Button
                        labelStyle={[this.props.ftszData.paragraph, this.props.themeData.SStheme]}
                        onPress={() => { }}
                    >{this.props.lanData.forgotAccount}</Button>
                </View>
                <Button
                    labelStyle={[this.props.ftszData.paragraph, this.props.themeData.SStheme]}
                    onPress={() => Actions.SettingScreen()}
                >{this.props.lanData.settingPage}</Button>
                <Portal>
                    <Dialog
                        visible={this.state.districtOp}
                        onDismiss={() => this.setState({ districtOp: false })}
                        style={this.props.themeData.LthemeB}
                    >
                        <Dialog.ScrollArea>
                            <ScrollView contentContainerStyle={{ paddingTop: 24 }}>
                                {churchList.map((item) => (
                                    <List.Item
                                        title={item.label} key={item.key}
                                        titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                                        onPress={() => this.setState({ districtName: item.label, districtId: item.key, districtOp: false })}
                                    />
                                ))}
                            </ScrollView>
                        </Dialog.ScrollArea>
                    </Dialog>
                    <Dialog
                        visible={this.state.churchOp}
                        onDismiss={() => this.setState({ churchOp: false })}
                        style={this.props.themeData.LthemeB}
                    >
                        <Dialog.ScrollArea>
                            <ScrollView contentContainerStyle={{ paddingTop: 24 }}>
                                {this.props.distData.map((item) => (
                                    <List.Item
                                        title={item.church_name} key={item.church_id}
                                        titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                                        onPress={() => this.setState({ churchName: item.church_name, church_id: item.church_id, churchOp: false })}
                                    />
                                ))}
                            </ScrollView>
                        </Dialog.ScrollArea>
                    </Dialog>
                </Portal>
            </View>
        )
    }
}

function mapStateToProps(state) {
    //console.log("mapState", state.gtDistrictReducer.isFetching)
    return {
        lanData: state.languageReducer.lanData,
        ftszData: state.fontsizeReducer.ftszData,
        themeData: state.themeReducer.themeData,
        distData: state.gtDistrictReducer.todos,
        loginLength: state.loginReducer.todos,
        loginDone: state.loginReducer.isFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({
            toggleLanguage, toogleFontsize, toogleTheme, getDistrict, login
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    textInput: {
        borderRadius: 18,
        borderWidth: 2,
        elevation: 12,
        marginVertical: 8,
        width: 250,
        paddingVertical: 5,
        paddingLeft: 20,
    },
})