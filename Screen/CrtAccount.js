import React, { Component } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { ActivityIndicator, Button, IconButton, Dialog, Text, Divider, Portal } from 'react-native-paper'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// actions
import { toggleLanguage } from '../Actions/toogleLanguage'
import { toogleFontsize } from '../Actions/toogleFontsize'
import { toogleTheme } from '../Actions/toogleTheme'

//components


import * as firebase from 'firebase' //firebase
import { Actions } from 'react-native-router-flux' // pages navigation
import moment from 'moment' // time
import * as Facebook from 'expo-facebook' //facebook login
import * as Google from 'expo-google-app-auth'

class LoginScreen extends Component {
    state = {
        intrprOp: false,
    }

    async componentDidMount() {
        await Facebook.initializeAsync(appId = '576796593019092', appName = 'RollCallCrAcc')
    }

    async loginWithFacebook() {
        const { type, token } =
            await Facebook.logInWithReadPermissionsAsync('576796593019092', { permissions: ['public_profile'] })
        if (type == 'success') {
            const credential = firebase.auth.FacebookAuthProvider.credential(token)
            firebase.auth().signInWithCredential(credential).catch((error) => {
                console.log("fblog", error)
            })
        }
    }

    signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
              //androidClientId: YOUR_CLIENT_ID_HERE,
              behavior: 'web',
              iosClientId: '127969128886-hpp9n824orvjrjope8thq9f9h947j91i.apps.googleusercontent.com',
              scopes: ['profile', 'email'],
            });
        
            if (result.type === 'success') {
              return result.accessToken;
            } else {
              return { cancelled: true };
            }
          } catch (e) {
            return { error: true };
          }
    }

    render() {
        return (
            <View style={[styles.container, this.props.themeData.MthemeB]}>
                <View style={styles.pickerView}>
                    <Button
                        icon="facebook" mode="contained"
                        labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                        contentStyle={{ width: 250 }}
                        style={[this.props.themeData.XLthemeB, styles.buttonContain]}
                        onPress={() => this.loginWithFacebook()}
                    >{this.props.lanData.withFB}</Button>
                </View>
                <View style={styles.pickerView}>
                    <Button
                        icon="google" mode="contained"
                        labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                        contentStyle={{ width: 250 }}
                        style={[this.props.themeData.XLthemeB, styles.buttonContain]}
                        onPress={() => this.signInWithGoogleAsync.bind(this)}
                    >{this.props.lanData.withG}</Button>
                </View>
                <View style={{ justifyContent: 'space-around', width: 200, flexDirection: 'row' }}>
                    <Button
                        labelStyle={[this.props.ftszData.paragraph, this.props.themeData.SStheme]}
                        onPress={() => this.setState({ intrprOp: true })}
                        icon="alert-circle-outline"
                    >{this.props.lanData.lowAuth}</Button>
                </View>
                <Portal>
                    <Dialog
                        visible={this.state.intrprOp}
                        onDismiss={() => this.setState({ intrprOp: false })}
                        style={this.props.themeData.LthemeB}
                    >
                        <Dialog.Content>
                            <Text
                                style={[this.props.themeData.Stheme, this.props.ftszData.paragraph]}
                            >{this.props.lanData.lowAuthSub}</Text>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        lanData: state.languageReducer.lanData,
        ftszData: state.fontsizeReducer.ftszData,
        themeData: state.themeReducer.themeData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({
            toggleLanguage, toogleFontsize, toogleTheme,
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
    buttonContain: {
        borderRadius: 18,
        elevation: 12,
        marginVertical: 8,
        flexWrap: 'wrap',
        paddingHorizontal: 10
    },
})