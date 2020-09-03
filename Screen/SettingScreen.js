import React, { Component } from 'react'
import { View, StyleSheet, Alert, AsyncStorage } from 'react-native'
import { ActivityIndicator, Button, IconButton, Dialog, Text, Divider, Portal, List } from 'react-native-paper'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// actions
import { toggleLanguage } from '../Actions/toogleLanguage'
import { toogleFontsize } from '../Actions/toogleFontsize'
import { toogleTheme } from '../Actions/toogleTheme'

//components


import { Actions } from 'react-native-router-flux' // pages navigation

class SettingScreen extends Component {
    state = {
        fontSize: 'medium', fontSizeOp: false, fontSizeShow: this.props.lanData.middle,
        theme: 'starWhite', themeOp: false, themeShow: this.props.lanData.theme1,
        language: 'zh', lanOp: false, lanShow: this.props.lanData.chzh,
        clearFreqOp: false,
    }
    async componentDidMount() {
        try {
            const fontSize = await AsyncStorage.getItem('fontSize')
            if (fontSize === 'small') {
                this.setState({ fontSizeShow: this.props.lanData.small })
            } else if (fontSize === 'large') {
                this.setState({ fontSizeShow: this.props.lanData.large })
            } else if (fontSize === 'Xlarge') {
                this.setState({ fontSizeShow: this.props.lanData.Xlarge })
            }
            const theme = await AsyncStorage.getItem('theme')
            if (theme === 'homeBrown') {
                this.setState({ themeShow: this.props.lanData.theme2 })
            } else if (theme === 'kichenCanva') {
                this.setState({ themeShow: this.props.lanData.theme3 })
            }
            const language = await AsyncStorage.getItem('language')
            if (language === 'en') {
                this.setState({ lanShow: this.props.lanData.eng })
            }
        } catch (e) { console.log("componenetDidMount error", e) }
    }
    onFontsize = async () => {
        this.props.toogleFontsize(this.state.fontSize)
        try {
            await AsyncStorage.setItem('fontSize', this.state.fontSize)
            console.log(await AsyncStorage.getItem('fontSize'), "getItem fontsize")
        } catch (e) { console.log("save font error", e) }
    }
    onTheme = async () => {
        this.props.toogleTheme(this.state.theme)
        try {
            await AsyncStorage.setItem('theme', this.state.theme)
            console.log(await AsyncStorage.getItem('theme'), "getItem theme")
        } catch (e) { console.log("save theme error", e) }
    }
    onLanguage = async () => {
        this.props.toggleLanguage(this.state.language)
        try {
            await AsyncStorage.setItem('language', this.state.language)
            console.log(await AsyncStorage.getItem('language'), "getItem language")
        } catch (e) { console.log("save language error", e) }
    }
    clearFreq = async () => {
        this.setState({ clearFreqOp: false })
        let a = await AsyncStorage.getItem('frequList')
        a === null ? console.log("no frequList") : await AsyncStorage.removeItem('frequList')
        let flag = await this.props.refreshFlag.flag
        flag = flag + 1
        this.props.refreshProp(flag)
    }
    render() {
        return (
            <View style={[styles.container, this.props.themeData.MthemeB]}>
                <Text style={[this.props.ftszData.paragraph, this.props.themeData.Stheme]}>
                    {this.props.lanData.interface}</Text>
                <View style={{ flexDirection: 'row', padding: 6, alignItems: 'center', width: '100%' }} >
                    <Text style={[this.props.ftszData.title, this.props.themeData.XLtheme, { paddingRight: 7 }]}>
                        {this.props.lanData.fonstSize}</Text>
                    <Button labelStyle={[this.props.ftszData.button, this.props.themeData.Stheme]}
                        onPress={() => { this.setState({ fontSizeOp: true }) }}
                    >{this.state.fontSizeShow}</Button>
                </View>
                <View style={{ flexDirection: 'row', padding: 6, alignItems: 'center', width: '100%' }} >
                    <Text style={[this.props.ftszData.title, this.props.themeData.XLtheme, { paddingRight: 7 }]}>
                        {this.props.lanData.theme}</Text>
                    <Button labelStyle={[this.props.ftszData.button, this.props.themeData.Stheme]}
                        onPress={() => { this.setState({ themeOp: true }) }}
                    >{this.state.themeShow}</Button>
                </View>
                <View style={{ flexDirection: 'row', padding: 6, alignItems: 'center', width: '100%' }} >
                    <Text style={[this.props.ftszData.title, this.props.themeData.XLtheme, { paddingRight: 7 }]}>
                        {this.props.lanData.language}</Text>
                    <Button labelStyle={[this.props.ftszData.button, this.props.themeData.Stheme]}
                        onPress={() => { this.setState({ lanOp: true }) }}
                    >{this.state.lanShow}</Button>
                </View>
                <Divider />
                <Text style={[this.props.ftszData.paragraph, this.props.themeData.Stheme]}>
                    {this.props.lanData.clearFreq}</Text>
                <View style={{ flexDirection: 'row', padding: 6, alignItems: 'center', width: '100%' }} >
                    <Text style={[this.props.ftszData.title, this.props.themeData.XLtheme, { paddingRight: 7 }]}>
                        {this.props.lanData.clearFreq}</Text>
                    <Button labelStyle={[this.props.ftszData.button, this.props.themeData.Stheme]}
                        onPress={() => this.setState({ clearFreqOp: true })}
                    >{this.props.lanData.ListConfirm}</Button>
                </View>
                <Portal>
                    <Dialog
                        visible={this.state.fontSizeOp}
                        onDismiss={() => { this.setState({ fontSizeOp: false }) }}
                        style={this.props.themeData.LthemeB}
                    >
                        <List.Item
                            title={this.props.lanData.small}
                            titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                            onPress={() => {
                                this.setState({ fontSize: 'small', fontSizeShow: this.props.lanData.small },
                                    this.onFontsize)
                            }}
                        />
                        <List.Item
                            title={this.props.lanData.middle}
                            titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                            onPress={() => {
                                this.setState({ fontSize: 'medium', fontSizeShow: this.props.lanData.middle },
                                    this.onFontsize)
                            }}
                        />
                        <List.Item
                            title={this.props.lanData.large}
                            titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                            onPress={() => {
                                this.setState({ fontSize: 'large', fontSizeShow: this.props.lanData.large },
                                    this.onFontsize)
                            }}
                        />
                        <List.Item
                            title={this.props.lanData.Xlarge}
                            titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                            onPress={() => {
                                this.setState({ fontSize: 'Xlarge', fontSizeShow: this.props.lanData.Xlarge },
                                    this.onFontsize)
                            }}
                        />
                    </Dialog>
                    <Dialog
                        visible={this.state.themeOp}
                        onDismiss={() => { this.setState({ themeOp: false }), this.saveFont }}
                        style={this.props.themeData.LthemeB}
                    >
                        <List.Item
                            title={this.props.lanData.theme1}
                            titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                            onPress={() => {
                                this.setState({ theme: 'starWhite', themeShow: this.props.lanData.thme1 },
                                    this.onTheme)
                            }}
                        />
                        <List.Item
                            title={this.props.lanData.theme2}
                            titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                            onPress={() => {
                                this.setState({ theme: 'homeBrown', themeShow: this.props.lanData.thme2 },
                                    this.onTheme)
                            }}
                        />
                        <List.Item
                            title={this.props.lanData.theme3}
                            titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                            onPress={() => {
                                this.setState({ theme: 'kichenCanva', themeShow: this.props.lanData.thme3 },
                                    this.onTheme)
                            }}
                        />
                    </Dialog>
                    <Dialog
                        visible={this.state.lanOp}
                        onDismiss={() => { this.setState({ lanOp: false }) }}
                        style={this.props.themeData.LthemeB}
                    >
                        <List.Item
                            title={this.props.lanData.chzh}
                            titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                            onPress={() => {
                                this.setState({ language: 'zh', lanShow: this.props.lanData.chzh },
                                    this.onLanguage)
                            }}
                        />
                        <List.Item
                            title={this.props.lanData.eng}
                            titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                            onPress={() => {
                                this.setState({ language: 'en', lanShow: this.props.lanData.eng },
                                    this.onLanguage)
                            }}
                        />
                    </Dialog>
                    <Dialog
                        visible={this.state.clearFreqOp}
                        onDismiss={() => { this.setState({ clearFreqOp: false }) }}
                        style={this.props.themeData.LthemeB}
                    >
                        <Dialog.Content>
                            <Text style={[this.props.ftszData.title, this.props.themeData.XLtheme, { paddingRight: 7 }]}>
                                {this.props.lanData.clearDouCheck}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                labelStyle={[this.props.ftszData.paragraph, this.props.themeData.XLtheme]}
                                onPress={() => this.clearFreq()}
                            >OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        )
    }
}

function mapStateToProps(state) {
    //console.log("mapState", state.themeReducer.themeData)
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 50,
    },

})
