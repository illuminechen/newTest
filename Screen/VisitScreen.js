import React, { Component } from 'react'
import { View, StyleSheet, Alert, TextInput, ScrollView, AsyncStorage } from 'react-native'
import {
    ActivityIndicator, Button, IconButton,
    Dialog, Text, Divider, Portal, FAB, Snackbar
} from 'react-native-paper'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// actions
import { toggleLanguage } from '../Actions/toogleLanguage'
import { toogleFontsize } from '../Actions/toogleFontsize'
import { toogleTheme } from '../Actions/toogleTheme'
import { districtLevel2 } from '../Actions/districtLevel2'
import { districtLevel3 } from '../Actions/districtLevel3'
import { districtLevel4 } from '../Actions/districtLevel4'
import { totalAttend } from '../Actions/totalAttend'
import { sumAttend } from '../Actions/sumAttend'

// others
import DateTimePicker from '@react-native-community/datetimepicker';// default calender picker
import { Actions } from 'react-native-router-flux' // pages navigation
import moment from 'moment' // time

class VisitScreen extends Component {
    state = {
        modeOp: false, lordFreq: 3, lordFreqSh: this.props.lanData.threeperm,
        alotsOp: true,
        genderSel: '', statusSel: '', identitySel: '', groupSel: '',
        districtOp: true,
        level2Menu: false, level2: '', level2id: 0,
        level3Menu: false, level3: '', level3id: 0,
        level4Men: false, level4: '', level4id: 0,
        sumOfLordT: [], sumOfGroupM: [], sumOfHomeM: [],
    }
    async componentDidMount() {
        await this.DistrictRender()
    }
    DistrictRender = async () => {
        try {
            this.props.districtLevel2(await AsyncStorage.getItem('church_id'))
            this.setState({ districtOp: true })
        } catch (e) { console.log("DistrictRender error", e) }
    }
    DistrictRender2 = () => {
        const level2_id = this.state.level2id
        this.props.districtLevel3(level2_id)
    }
    DistrictRender3 = () => {
        const level3_id = this.state.level3id
        this.props.districtLevel4(level3_id)
    }
    getTotalAtt = async () => {
        const year = moment(new Date()).format("yyyy")
        const week = moment(new Date()).format("ww")
        const month = moment(new Date()).format("MM")
        await this.props.totalAttend(year, week, '0', '1', this.state.genderSel, this.state.statusSel,
            this.state.identitySel, this.state.groupSel, this.state.searchData)
        const totalFetch = await this.props.tolAtt.isFetching
        if (totalFetch === false) {
            let limit = await this.props.tolAtt.todos.count
            console.log("visitScreen limit", limit)
            await this.props.totalAttend(year, week, '0', limit, this.state.genderSel, this.state.statusSel,
                this.state.identitySel, this.state.groupSel, this.state.searchData)
            const year_from = month - 6 > 0 ? year : year - 1
            const month_from = month - 6 > 0 ? month - 6 : month + 6
            const year_to = month - 1 > 0 ? year : year - 1
            const month_to = month - 1 > 0 ? month - 1 : 11 + month
            await this.props.sumAttend('37', year_from, month_from, year_to, month_to,
                this.state.searchData, this.state.genderSel, this.state.statusSel, this.state.identitySel,
                this.state.groupSel, limit)
        }
    }
    render() {
        const AttFetch = this.props.tolAtt.isFetching || this.props.sumAtt.isFetching
        return (
            <View style={[styles.container, this.props.themeData.MthemeB]}>
                <View style={styles.titleCard}>
                    <Button
                        mode="contained" icon="menu-down"
                        labelStyle={[this.props.ftszData.paragraph, this.props.themeData.Ltheme]}
                        style={[this.props.themeData.SthemeB, { borderRadius: 18, elevation: 12, marginHorizontal: 5 }]}
                        onPress={() => this.setState({ modeOp: true })}
                    >{this.state.lordFreqSh}</Button>
                    <IconButton icon="tune-vertical" size={25} color={this.props.themeData.SthemeC}
                        onPress={() => this.setState({ alotsOp: true })} style={{ elevation: 15 }}
                    />
                    <IconButton icon="account-group" size={25} color={this.props.themeData.SthemeC}
                        onPress={this.DistrictRender} style={{ elevation: 15 }}
                    />
                </View>
                <Portal>
                    <Dialog
                        visible={this.state.modeOp}
                        style={this.props.themeData.LthemeB}
                        onDismiss={() => this.setState({ modeOp: false })}>
                        <Dialog.ScrollArea>
                            <ScrollView contentContainerStyle={{ paddingTop: 24 }}>
                                <Dialog.Content>
                                    <Text style={[this.props.ftszData.paragraph, this.props.themeData.Stheme]}>
                                        {this.props.lanData.lordTfreq}</Text>
                                    <View style={styles.selectGroup}>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.lordFreq === 4 ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            onPress={() =>
                                                this.setState({
                                                    lordFreq: 4,
                                                    lordFreqSh: this.props.lanData.fourperm
                                                })}
                                        >{this.props.lanData.fourperm}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.lordFreq === 3 ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            onPress={() =>
                                                this.setState({
                                                    lordFreq: 3,
                                                    lordFreqSh: this.props.lanData.threeperm
                                                })}
                                        >{this.props.lanData.threeperm}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.lordFreq === 2 ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            onPress={() =>
                                                this.setState({
                                                    lordFreq: 2,
                                                    lordFreqSh: this.props.lanData.oneperm
                                                })}
                                        >{this.props.lanData.oneperm}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.lordFreq === 1 ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            onPress={() =>
                                                this.setState({
                                                    lordFreq: 1,
                                                    lordFreqSh: this.props.lanData.otherChLf
                                                })}
                                        >{this.props.lanData.otherChLf}</Button>
                                    </View>
                                </Dialog.Content>
                            </ScrollView>
                        </Dialog.ScrollArea>
                        <Dialog.Actions>
                            <Button
                                labelStyle={[this.props.ftszData.paragraph, this.props.themeData.XLtheme]}
                                onPress={() => this.setState({ modeOp: false })}
                            >OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog
                        visible={this.state.alotsOp}
                        style={this.props.themeData.LthemeB}
                        onDismiss={() => this.setState({ alotsOp: false })}>
                        <Dialog.ScrollArea>
                            <ScrollView contentContainerStyle={{ paddingTop: 24 }}>
                                <Dialog.Content>
                                    <Text style={[this.props.ftszData.paragraph, this.props.themeData.Stheme]}>
                                        {this.props.lanData.gender}</Text>
                                    <View style={styles.selectGroup}>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.genderSel === '' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="all-inclusive"
                                            onPress={() => this.setState({ genderSel: '' })}
                                        >{this.props.lanData.all}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.genderSel === 'm' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="human-male"
                                            onPress={() => this.setState({ genderSel: 'm' })}
                                        >{this.props.lanData.male}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.genderSel === 'f' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="human-female"
                                            onPress={() => this.setState({ genderSel: 'f' })}
                                        >{this.props.lanData.female}</Button>
                                    </View>
                                    <Text style={[this.props.ftszData.paragraph, this.props.themeData.Stheme]}>
                                        {this.props.lanData.status}</Text>
                                    <View style={styles.selectGroup}>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.statusSel === '' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="all-inclusive"
                                            onPress={() => this.setState({ statusSel: '' })}
                                        >{this.props.lanData.all}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.statusSel === 'enable' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="check"
                                            onPress={() => this.setState({ statusSel: 'enable' })}
                                        >{this.props.lanData.enable}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.statusSel === 'disable' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="cancel"
                                            onPress={() => this.setState({ statusSel: 'disable' })}
                                        >{this.props.lanData.disable}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.statusSel === 'visit' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="train"
                                            onPress={() => this.setState({ statusSel: 'visit' })}
                                        >{this.props.lanData.visit}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.statusSel === 'moved' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="home-minus"
                                            onPress={() => this.setState({ statusSel: 'moved' })}
                                        >{this.props.lanData.moved}</Button>
                                    </View>
                                    <Text style={[this.props.ftszData.paragraph, this.props.themeData.Stheme]}>
                                        {this.props.lanData.identity}</Text>
                                    <View style={styles.selectGroup}>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.identitySel === '' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="all-inclusive"
                                            onPress={() => this.setState({ identitySel: '' })}
                                        >{this.props.lanData.all}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.identitySel === 's' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="sheep"
                                            onPress={() => this.setState({ identitySel: 's' })}
                                        >{this.props.lanData.saint}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.identitySel === 'g' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="sheep"
                                            onPress={() => this.setState({ identitySel: 'g' })}
                                        >{this.props.lanData.gospelFriend}</Button>
                                    </View>
                                    <Text style={[this.props.ftszData.paragraph, this.props.themeData.Stheme]}>
                                        {this.props.lanData.group}</Text>
                                    <View style={styles.selectGroup}>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.groupSel === '' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="all-inclusive"
                                            onPress={() => this.setState({ groupSel: '' })}
                                        >{this.props.lanData.all}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.groupSel === '學齡前' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="baby-carriage"
                                            onPress={() => this.setState({ groupSel: '學齡前' })}
                                        >{this.props.lanData.beforeSchool}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.groupSel === '小學' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="human-child"
                                            onPress={() => this.setState({ groupSel: '小學' })}
                                        >{this.props.lanData.primarySchool}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.groupSel === '中學' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="human-child"
                                            onPress={() => this.setState({ groupSel: '中學' })}
                                        >{this.props.lanData.secondarySchool}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.groupSel === '大專' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="human-male"
                                            onPress={() => this.setState({ groupSel: '大專' })}
                                        >{this.props.lanData.teritiarySchool}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.groupSel === '青職' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="human-handsdown"
                                            onPress={() => this.setState({ groupSel: '青職' })}
                                        >{this.props.lanData.working}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.groupSel === '青壯' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="human"
                                            onPress={() => this.setState({ groupSel: '青壯' })}
                                        >{this.props.lanData.mature}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.groupSel === '中壯' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="human-handsup"
                                            onPress={() => this.setState({ groupSel: '中壯' })}
                                        >{this.props.lanData.middleAge}</Button>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.groupSel === '年長' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="human-handsup"
                                            onPress={() => this.setState({ groupSel: '年長' })}
                                        >{this.props.lanData.elder}</Button>
                                    </View>
                                </Dialog.Content>
                            </ScrollView>
                        </Dialog.ScrollArea>
                        <Dialog.Actions>
                            <Button
                                labelStyle={[this.props.ftszData.paragraph, this.props.themeData.XLtheme]}
                                onPress={() => this.setState({ alotsOp: false })}
                            >OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog
                        visible={this.state.districtOp}
                        style={this.props.themeData.LthemeB}
                        onDismiss={() => this.setState({ districtOp: false })}>
                        <Dialog.ScrollArea>
                            <ScrollView contentContainerStyle={{ paddingTop: 24 }}>
                                <Dialog.Content>
                                    <View style={styles.selectGroup}>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.level2 === '' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="all-inclusive"
                                            onPress={() => this.setState({ level2: '', level2id: 0 })}
                                        >{this.props.lanData.all}</Button>
                                        {this.props.level2.map((item) => (
                                            <Button style={[{ margin: 5, borderRadius: 18 },
                                            this.state.level2 === item.data ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                                labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                                onPress={() => {
                                                    this.setState({ level2: item.data, level2id: item.attr.id }, () => {
                                                        this.DistrictRender2();
                                                    })
                                                }}
                                            >{item.data}</Button>
                                        ))}
                                    </View>
                                    <Divider />
                                    <View style={styles.selectGroup}>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.level3 === '' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="all-inclusive"
                                            onPress={() => this.setState({ level3: '', level3id: 0 })}
                                        >{this.props.lanData.all}</Button>
                                        {this.props.level3.map((item) => (
                                            <Button style={[{ margin: 5, borderRadius: 18 },
                                            this.state.level3 === item.data ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                                labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                                onPress={() => {
                                                    this.setState({ level3: item.data, level3id: item.attr.id }, () => {
                                                        this.DistrictRender3();
                                                    })
                                                }}
                                            >{item.data}</Button>
                                        ))}
                                    </View>
                                    <Divider />
                                    <View style={styles.selectGroup}>
                                        <Button style={[{ margin: 5, borderRadius: 18 },
                                        this.state.level4 === '' ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                            labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                            icon="all-inclusive"
                                            onPress={() => this.setState({ level4: '', level4id: 0 })}
                                        >{this.props.lanData.all}</Button>
                                        {this.props.level4.map((item) => (
                                            <Button style={[{ margin: 5, borderRadius: 18 },
                                            this.state.level4 === item.data ? this.props.themeData.XLthemeB : this.props.themeData.SthemeB]}
                                                labelStyle={[this.props.ftszData.button, this.props.themeData.Ltheme]}
                                                onPress={() => {
                                                    this.setState({ level4: item.data, level4id: item.attr.id })
                                                }}
                                            >{item.data}</Button>
                                        ))}
                                    </View>
                                    <Divider />
                                </Dialog.Content>
                            </ScrollView>
                        </Dialog.ScrollArea>
                        <Dialog.Actions>
                            <Button
                                labelStyle={[this.props.ftszData.paragraph, this.props.themeData.XLtheme]}
                                onPress={() => this.setState({ districtOp: false })}
                            >OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        )
    }
}

function mapStateToProps(state) {
    //console.log("mapstate", state.tolAttReducer)
    return {
        lanData: state.languageReducer.lanData,
        ftszData: state.fontsizeReducer.ftszData,
        themeData: state.themeReducer.themeData,
        level2: state.level2Reducer.todos,
        level3: state.level3Reducer.todos,
        level4: state.level4Reducer.todos,
        tolAtt: state.tolAttReducer,
        sumAtt: state.sumAttReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({
            toggleLanguage, toogleFontsize, toogleTheme,
            districtLevel2, districtLevel3, districtLevel4,
            totalAttend, sumAttend,
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VisitScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    titleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: "90%",
        marginTop: 25,
        paddingHorizontal: 4,
    },
    selectGroup: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
})