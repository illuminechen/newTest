import React, { Component } from 'react'
import { View, StyleSheet, Alert, TextInput, ScrollView, AsyncStorage, FlatList } from 'react-native'
import {
    ActivityIndicator, Button, IconButton, List,
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
import { rollCall } from '../Actions/rollCall'
import { refreshProp } from '../Actions/refreshProp'

// others
import DateTimePicker from '@react-native-community/datetimepicker';// default calender picker
import { Actions } from 'react-native-router-flux' // pages navigation
import moment from 'moment' // time

class FrequListScreen extends Component {
    state = {
        freqList: [], endsort: [],
        searchData: '',
        nowDate: moment(new Date()).format("ww"),
        nowYear: moment(new Date()).format("yyyy"),
        nowMonth: moment(new Date()).format("MM"),
        showCalender: false, CalenderValue: new Date(), showSnackbar: false,
        orderAcord: '37', showOrderAcord: this.props.lanData.lordTableFull, orderAcordOp: false,
        isSelectAll: false, checkDeleteOp: false,
    }
    async componentDidMount() {
        try {
            const k = await AsyncStorage.getItem('freqListKey')
            let a = await AsyncStorage.getItem('frequList')
            let b = JSON.parse(a)[k]
            this.setState({
                orderAcord: b.orderAcord,
                showOrderAcord: b.orderAcord === '40' ? this.props.lanData.prayerFull
                    : b.orderAcord === '38' ? this.props.lanData.homeMetFull
                        : b.orderAcord === '39' ? this.props.lanData.grouMetFull
                            : b.orderAcord === '1473' ? this.props.lanData.gospVisFull
                                : b.orderAcord === '37' ? this.props.lanData.lordTableFull : '',
                freqList: b.member
            })
            await this.getTotalAtt(), await this.orderAtt()
        } catch (e) { console.log("componentDidMount", e) }

    }
    CalonChange = async (event, date) => {
        this.setState({
            CalenderValue: date,
            dateStart: moment(date).day("Monday").format("YYYY/MM/DD"),
            dateEnd: moment(date).day("Monday").day(7).format("YYYY/MM/DD"),
            nowDate: moment(date).format("ww"),
            nowYear: moment(date).format("yyyy"),
            nowMonth: moment(date).format("MM"),
            showCalender: false,
            showSnackbar: true,
        })
        if (event !== null) {
            await this.getTotalAtt()
            if (this.state.genderSel !== '') {
                await this.arrayFilter()
            } else { await this.orderCal() }
        }
    }
    getTotalAtt = async () => {
        const year = this.state.nowYear
        const week = this.state.nowDate
        await this.props.totalAttend(year, week, '0', '1', '', '',
            '', '', this.state.searchData)
        const totalFetch = await this.props.tolAtt.isFetching
        if (totalFetch === false) {
            let limit = await this.props.tolAtt.todos.count
            console.log("RCScreen limit", limit)
            await this.props.totalAttend(year, week, '0', limit, '', '',
                '', '', this.state.searchData)
        }
    }
    orderAtt = async () => {
        const getTolFetch = await this.props.tolAtt.isFetching
        let freqList = this.state.freqList
        let toltmp = []
        let keytmp = []
        if (getTolFetch === false) {
            const item = await this.props.tolAtt.todos.members
            freqList.forEach((value, index) => {
                keytmp.push(
                    item.map(m => m.member_id).indexOf(value.member_id)
                )
            })
            freqList.forEach((value, index) => {
                toltmp.push({
                    member_name: value.member_name, member_id: value.member_id,
                    lordT: item[keytmp[index]]['attend0'] === null ? 0 : 1,
                    prayerM: item[keytmp[index]]['attend1'] === null ? 0 : 1,
                    homeM: item[keytmp[index]]['attend2'] === null ? 0 : 1,
                    groupM: item[keytmp[index]]['attend3'] === null ? 0 : 1,
                    gospelV: item[keytmp[index]]['attend5'] === null ? 0 : 1
                })
            })
            console.log("orderAtt", toltmp)
            this.setState({ endsort: toltmp })
        }
    }
    rollCall = async (id, origAtt) => {
        //console.log("rollCall", id, origAtt)
        origAtt === 0 ?
            await this.props.rollCall(id, this.state.orderAcord, this.state.nowYear, this.state.nowDate, '1')
            : await this.props.rollCall(id, this.state.orderAcord, this.state.nowYear, this.state.nowDate, '0')
        let b = this.state.endsort.slice(0, 250)
        let index = b.map(member => member.member_id).indexOf(id)
        //console.log('index', index)
        let Att = ''
        this.state.orderAcord === "37" ? Att = 'lordT'
            : this.state.orderAcord === "40" ? Att = 'prayerM'
                : this.state.orderAcord === "38" ? Att = 'homeM'
                    : this.state.orderAcord === "39" ? Att = 'groupM'
                        : this.state.orderAcord === "1473" ? Att = 'gospelV' : ''
        origAtt === 0 ? b[index][Att] = 1 : b[index][Att] = 0
        this.setState({ endsort: b })
        console.log("changeState", this.state.endsort[index])
    }
    selectAll = async () => {
        let a = this.state.endsort
        let b = []
        a.forEach((value, index) => {
            b[index] = parseInt(a[index]['member_id'])
        })
        let Att = ''
        this.state.orderAcord === "37" ? Att = 'lordT'
            : this.state.orderAcord === "40" ? Att = 'prayerM'
                : this.state.orderAcord === "38" ? Att = 'homeM'
                    : this.state.orderAcord === "39" ? Att = 'groupM'
                        : this.state.orderAcord === "1473" ? Att = 'gospelV' : ''
        if (this.state.isSelectAll) {
            await this.props.rollCall(b, this.state.orderAcord, this.state.nowYear, this.state.nowDate, '0')
            a.forEach((value, index) => {
                a[index][Att] = 0
            })
            this.setState({ isSelectAll: false })
        } else {
            await this.props.rollCall(b, this.state.orderAcord, this.state.nowYear, this.state.nowDate, '1')
            a.forEach((value, index) => {
                a[index][Att] = 1
            })
            this.setState({ isSelectAll: true, endsort: a })
        }
    }
    arrayFilter = () => {
        let a = this.state.endsort
        const search = this.state.searchData
        let b = []
        if (search) {
            b = a.filter(e => e.member_name.includes(search))
            this.setState({ endsort: b })
        } else {
            this.orderAtt()
        }
    }
    deleteFrqLst = async () => {
        try {
            const k = await AsyncStorage.getItem('freqListKey')
            let a = await AsyncStorage.getItem('frequList')
            let b = JSON.parse(a)
            let remove = b.splice(k, 1)
            await AsyncStorage.setItem('frequList', JSON.stringify(b))
            this.setState({ checkDeleteOp: false })
            let flag = await this.props.refreshFlag.flag
            flag = flag + 1
            this.props.refreshProp(flag)
            Actions.pop()
        } catch (e) { console.log("deleteFrqLst error", e) }
    }
    editFrqLst = () => {

    }
    render() {
        const AttFetch = this.props.tolAtt.isFetching
        return (
            <View style={[styles.container, this.props.themeData.MthemeB]}>
                <View style={styles.searchCard}>
                    <TextInput
                        autoCapitalize='none' placeholderTextColor={this.props.themeData.Stheme}
                        placeholder={this.props.lanData.search} maxLength={20} blurOnSubmit={true}
                        onChangeText={text => this.setState({ searchData: text })}
                        onBlur={() => this.arrayFilter()}
                        value={this.state.searchData} textAlignVertical="center"
                        style={[
                            this.props.themeData.MthemeB, this.props.ftszData.paragraph,
                            this.props.themeData.SthemeBo, this.props.themeData.XLtheme, styles.textInput
                        ]}
                    />
                    <IconButton icon="calendar-search" size={25} color={this.props.themeData.SthemeC}
                        onPress={() => this.setState({ showCalender: true })} style={{ elevation: 15 }}
                    />
                    <IconButton icon="trash-can" size={25} color={this.props.themeData.SthemeC}
                        onPress={() => this.setState({ checkDeleteOp: true })} style={{ elevation: 15 }}
                    />
                    <IconButton icon="pen-plus" size={25} color={this.props.themeData.SthemeC}
                        onPress={() => this.editFrqLst()} style={{ elevation: 15 }}
                    />
                </View>
                <View style={styles.pickerView}>
                    <Button
                        mode="contained" icon="menu-down"
                        labelStyle={[this.props.ftszData.paragraph, this.props.themeData.Ltheme]}
                        style={[this.props.themeData.SthemeB, { borderRadius: 18, elevation: 12, marginHorizontal: 5 }]}
                        onPress={() => this.setState({ orderAcordOp: true })}
                    >{this.state.showOrderAcord}</Button>
                    <Button
                        mode="outlined"
                        labelStyle={[this.props.ftszData.paragraph, this.props.themeData.Ltheme]}
                        style={[this.props.themeData.SthemeB, { borderRadius: 18, elevation: 12, marginHorizontal: 5 }]}
                        onPress={() => this.selectAll()}
                    >{this.props.lanData.selectAll}</Button>
                </View>
                <Snackbar
                    visible={this.state.showSnackbar} duration={1500}
                    onDismiss={() => this.setState({ showSnackbar: false })}
                >{this.state.dateStart} ~ {this.state.dateEnd}
                </Snackbar>
                {this.state.showCalender && (
                    <DateTimePicker
                        mode="date" display="calendar"
                        value={this.state.CalenderValue}
                        onChange={this.CalonChange}
                    />
                )}
                {AttFetch ?
                    <View style={[styles.actInd, this.props.themeData.MthemeB]}>
                        <ActivityIndicator animating={true} color="gray" size='large' />
                    </View> :
                    <View style={[this.props.themeData.MthemeB, { flex: 1, width: "92%", justifyContent: 'center' }]}>
                        <FlatList
                            ref={(ref) => this.myScroll = ref}
                            data={(this.state.endsort).slice(0, 250)}
                            removeClippedSubviews={true}//default false
                            maxToRenderPerBatch={15}//default 10
                            updateCellsBatchingPeriod={120}//default 50 misec
                            initialNumToRender={8}//default 10
                            windowSize={15}//default 21
                            extraData={this.state.flatListRender}
                            keyExtractor={(item, key) => key}
                            renderItem={({ item }) => (
                                <List.Item
                                    title={item.member_name}
                                    titleStyle={[this.props.themeData.XLtheme, this.props.ftszData.paragraph]}
                                    right={props => <List.Icon {...props} icon={
                                        this.state.orderAcord === "37" ? item.lordT === 1 ? "check" : "close"
                                            : this.state.orderAcord === "40" ? item.prayerM === 1 ? "check" : "close"
                                                : this.state.orderAcord === "38" ? item.homeM === 1 ? "check" : "close"
                                                    : this.state.orderAcord === "39" ? item.groupM === 1 ? "check" : "close"
                                                        : this.state.orderAcord === "1473" ? item.gospelV === 1 ? "check" : "close" : "cancel"
                                    } color={this.props.themeData.SthemeC} style={this.props.ftszData.paragraph} />}
                                    onPress={() => this.rollCall(item.member_id,
                                        this.state.orderAcord === "37" ? item.lordT
                                            : this.state.orderAcord === "40" ? item.prayerM
                                                : this.state.orderAcord === "38" ? item.homeM
                                                    : this.state.orderAcord === "39" ? item.groupM
                                                        : this.state.orderAcord === "1473" ? item.gospelV : 0)}
                                />
                            )}
                        />
                    </View>}
                <Portal>
                    <Dialog
                        visible={this.state.orderAcordOp}
                        style={this.props.themeData.LthemeB}
                        onDismiss={() => this.setState({ orderAcordOp: false })}>
                        <Dialog.ScrollArea>
                            <ScrollView contentContainerStyle={{ paddingTop: 24 }}>
                                <Text style={[this.props.ftszData.paragraph, this.props.themeData.Stheme]}>
                                    {this.props.lanData.orderAccord}</Text>
                                <List.Item
                                    title={this.props.lanData.lordTableFull}
                                    titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                                    onPress={() => {
                                        this.setState({
                                            orderAcord: '37',
                                            showOrderAcord: this.props.lanData.lordTableFull,
                                            orderAcordOp: false
                                        })
                                    }} />
                                <List.Item
                                    title={this.props.lanData.prayerFull}
                                    titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                                    onPress={() => {
                                        this.setState({
                                            orderAcord: '40',
                                            showOrderAcord: this.props.lanData.prayerFull,
                                            orderAcordOp: false
                                        })
                                    }} />
                                <List.Item
                                    title={this.props.lanData.homeMetFull}
                                    titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                                    onPress={() => {
                                        this.setState({
                                            orderAcord: '38',
                                            showOrderAcord: this.props.lanData.homeMetFull,
                                            orderAcordOp: false
                                        })
                                    }} />
                                <List.Item
                                    title={this.props.lanData.grouMetFull}
                                    titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                                    onPress={() => {
                                        this.setState({
                                            orderAcord: '39',
                                            showOrderAcord: this.props.lanData.grouMetFull,
                                            orderAcordOp: false
                                        })
                                    }} />
                                <List.Item
                                    title={this.props.lanData.gospVisFull}
                                    titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                                    onPress={() => {
                                        this.setState({
                                            orderAcord: '1473',
                                            showOrderAcord: this.props.lanData.gospVisFull,
                                            orderAcordOp: false
                                        })
                                    }} />
                            </ScrollView>
                        </Dialog.ScrollArea>
                    </Dialog>
                    <Dialog
                        visible={this.state.checkDeleteOp}
                        style={this.props.themeData.LthemeB}
                        onDismiss={() => this.setState({ checkDeleteOp: false })}
                    >
                        <Dialog.Content>
                            <Text style={[this.props.ftszData.paragraph, this.props.themeData.Stheme]}>
                                {this.props.lanData.clearThisFrq}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                labelStyle={[this.props.ftszData.paragraph, this.props.themeData.XLtheme]}
                                onPress={() => this.deleteFrqLst()}
                            >OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        )
    }
}

function mapStateToProps(state) {
    //console.log("mapstate", state.refreshReducer)
    return {
        lanData: state.languageReducer.lanData,
        ftszData: state.fontsizeReducer.ftszData,
        themeData: state.themeReducer.themeData,
        level2: state.level2Reducer.todos,
        level3: state.level3Reducer.todos,
        level4: state.level4Reducer.todos,
        tolAtt: state.tolAttReducer,
        refreshFlag: state.refreshReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({
            toggleLanguage, toogleFontsize, toogleTheme,
            districtLevel2, districtLevel3, districtLevel4,
            totalAttend, sumAttend, rollCall,
            refreshProp
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FrequListScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    searchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: "90%",
        marginTop: 25,
        paddingHorizontal: 4,
    },
    textInput: {
        paddingLeft: 5,
        borderRadius: 18,
        borderWidth: 2,
        elevation: 12,
        marginVertical: 8,
        paddingVertical: 3,
        paddingLeft: 20,
        marginRight: 10,
        width: "60%",
    },
    pickerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    actInd: {
        height: "90%",
        alignItems: 'center',
        justifyContent: 'center',
    },
})