import React, { Component } from 'react'
import { View, StyleSheet, Alert, TextInput, ScrollView, AsyncStorage, FlatList } from 'react-native'
import {
    ActivityIndicator, Button, IconButton,
    Dialog, Text, Divider, Portal, List, FAB
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
import { Actions } from 'react-native-router-flux' // pages navigation
import moment from 'moment' // time

class AddFreqScreen extends Component {
    state = {
        searchData: '',
        alotsOp: false,
        genderSel: '', statusSel: '', identitySel: '', groupSel: '',
        districtOp: false,
        level2Menu: false, level2: '', level2id: 0,
        level3Menu: false, level3: '', level3id: 0,
        level4Men: false, level4: '', level4id: 0,
        orderAcord: '37', showOrderAcord: this.props.lanData.lordTableFull, orderAcordOp: false,
        endsort: [], freqList: [], freqListName: '',
        freqCheckOp: false, freqListNameOp: false,
        flatListRender: 0, limit: 0, isAllSelect: false,
    }
    async componentDidMount() {
        await this.getTotalAtt(), await this.orderCal()
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
            this.setState({ limit: parseInt(limit) })
            console.log("addFreq limit", limit)
            await this.props.totalAttend(year, week, '0', limit, this.state.genderSel, this.state.statusSel,
                this.state.identitySel, this.state.groupSel, this.state.searchData)
            const year_from = month - 6 > 0 ? year : year - 1
            const month_from = month - 6 > 0 ? month - 6 : month + 6
            const year_to = month - 1 > 0 ? year : year - 1
            const month_to = month - 1 > 0 ? month - 1 : 11 + month
            await this.props.sumAttend(this.state.orderAcord, year_from, month_from, year_to, month_to,
                this.state.searchData, this.state.genderSel, this.state.statusSel, this.state.identitySel,
                this.state.groupSel, limit)
        }
    }
    orderCal = async () => {
        const orderCalFetch = await this.props.sumAtt.isFetching
        let tmp = []
        let tmpp = []
        if (orderCalFetch === false) {
            const item = await this.props.sumAtt.todos.stats.rows
            item.forEach((objectss) => {
                tmp.push({
                    '21': objectss["21"] === null ? 0 : parseInt(objectss["21"]),
                    '22': objectss["22"] === null ? 0 : parseInt(objectss["22"]),
                    '23': objectss["23"] === null ? 0 : parseInt(objectss["23"]),
                    '24': objectss["24"] === null ? 0 : parseInt(objectss["24"]),
                    '25': objectss["25"] === null ? 0 : parseInt(objectss["25"]),
                    '26': objectss["26"] === null ? 0 : parseInt(objectss["26"]),
                    '27': objectss["27"] === null ? 0 : parseInt(objectss["27"]),
                    '28': objectss["28"] === null ? 0 : parseInt(objectss["28"]),
                    '29': objectss["29"] === null ? 0 : parseInt(objectss["29"]),
                    '30': objectss["30"] === null ? 0 : parseInt(objectss["30"]),
                    '31': objectss["31"] === null ? 0 : parseInt(objectss["31"]),
                    '32': objectss["32"] === null ? 0 : parseInt(objectss["32"]),
                    '33': objectss["33"] === null ? 0 : parseInt(objectss["33"]),
                    '34': objectss["34"] === null ? 0 : parseInt(objectss["34"]),
                    '35': objectss["35"] === null ? 0 : parseInt(objectss["35"]),
                    '36': objectss["36"] === null ? 0 : parseInt(objectss["36"]),
                    '37': objectss["37"] === null ? 0 : parseInt(objectss["37"]),
                    '38': objectss["38"] === null ? 0 : parseInt(objectss["38"]),
                    '39': objectss["39"] === null ? 0 : parseInt(objectss["39"])
                })
            })
            tmpp = tmp.map(o => Object.keys(o).reduce((t, p) => t + o[p], 0));
        }
        const getTolFetch = await this.props.tolAtt.isFetching
        let toltmp = []
        if (getTolFetch === false) {
            const item = await this.props.tolAtt.todos.members
            item.forEach((obj, index) => {
                toltmp.push({
                    member_name: obj['member_name'],
                    member_id: obj['member_id'],
                    path: obj['path'],
                    church_name: obj['church_name'],
                    sex: obj['sex'],
                    sum: tmpp[index],
                    freq: 0,
                })
            })
        }
        toltmp.sort((a, b) => { return b.sum - a.sum })
        this.setState({ endsort: toltmp })
        //console.log("getTodalAtt", toltmp)
        console.log("getTotalAtt size", (JSON.stringify(toltmp).length) / 1024, "Kbyte")
        this.setState(prevState => ({ flatListRender: prevState.flatListRender + 1 }))
    }
    arrayFilter = async () => {
        if (this.state.statusSel || this.state.identitySel || this.state.groupSel) {
            await this.getTotalAtt()
            console.log("recalApi", this.state.groupSel)
        }
        await this.orderCal()
        const obj = this.state.endsort
        const gender = this.state.genderSel
        const search = this.state.searchData
        var temp = []
        var districtemp = []
        const ttmp = JSON.stringify(this.state.level2id + this.state.level3id + this.state.level4id).length
        if (this.state.level2id || this.state.level3id || this.state.level4id) {
            if (ttmp === 1) {
                this.setState({ districtOp: false })
            } else if (ttmp === 8) {
                temp = obj.filter(e => e.path.split(',')[1] === this.state.level2id)
                this.setState({ districtOp: false })
                search || gender ? districtemp = temp : this.setState({ endsort: temp })
            } else if (ttmp === 11) {
                temp = obj.filter(e => e.path.split(',')[2] === this.state.level3id)
                this.setState({ districtOp: false })
                search || gender ? districtemp = temp : this.setState({ endsort: temp })
            } else if (ttmp === 14) {
                temp = obj.filter(e => e.path.split(',')[3] === this.state.level4id)
                this.setState({ districtOp: false })
                search || gender ? districtemp = temp : this.setState({ endsort: temp })
            }
        }
        if (gender === 'm') {
            if (search) {
                districtemp === [] ?
                    temp = districtemp.filter(e => e.sex === '男')
                    : temp = obj.filter(e => e.sex === '男')
                this.setState({ endsort: temp.filter(e => e.member_name.includes(search)), alotsOp: false })
            } else {
                districtemp === [] ?
                    temp = districtemp.filter(e => e.sex === '男')
                    : temp = obj.filter(e => e.sex === '男')
                this.setState({ endsort: temp, alotsOp: false })
            }
        } else if (gender === 'f') {
            if (search) {
                districtemp === [] ?
                    temp = districtemp.filter(e => e.sex === '女')
                    : temp = obj.filter(e => e.sex === '女')
                this.setState({ endsort: temp.filter(e => e.member_name.includes(search)), alotsOp: false })
            } else {
                districtemp === [] ?
                    temp = districtemp.filter(e => e.sex === '女')
                    : temp = obj.filter(e => e.sex === '女')
                this.setState({ endsort: temp, alotsOp: false })
            }
        } else if (gender === '') {
            if (search) {
                districtemp === [] ?
                    temp = districtemp.filter(e => e.member_name.includes(search))
                    : temp = obj.filter(e => e.member_name.includes(search))
                this.setState({ endsort: temp, alotsOp: false })
            } else this.setState({ alotsOp: false })
        }
    }
    reOrder = async () => {
        await this.getTotalAtt()
        await this.orderCal()
        this.setState({ orderAcordOp: false })
    }
    clearFilter = () => {
        this.setState({
            searchData: '', genderSel: '', statusSel: '', identitySel: '', groupSel: '',
            level2id: 0, level3id: 0, level4id: 0
        }, async () => { await this.getTotalAtt(), await this.orderCal() })
    }
    newMember = (name, id, freq) => {
        if (freq === 0) {
            let newMember = this.state.freqList
            newMember.push({
                member_name: name,
                member_id: id
            })
            let insertFlag = this.state.endsort.slice(0, 250)
            let index = insertFlag.map(m => m.member_id).indexOf(id)
            insertFlag[index]['freq'] = 1
            this.setState({ freqList: newMember, endsort: insertFlag })
            //console.log("newMember", this.state.freqList, this.state.endsort[index])
        } else if (freq === 1) {
            let remMember = this.state.freqList
            let fIndex = remMember.map(e => e.member_id).indexOf(id)
            let remove = remMember.splice(fIndex, 1)
            let remFlag = this.state.endsort.slice(0, 250)
            let index = remFlag.map(m => m.member_id).indexOf(id)
            remFlag[index]['freq'] = 0
            this.setState({ freqList: remMember, endsort: remFlag })
            //console.log("remove newMemeber", this.state.endsort[index])
        }
    }
    finalCheck = async () => {
        if (this.state.freqListName === '') {
            const title = this.props.lanData.listName
            return (
                Alert.alert(
                    title, title,
                    [{ text: 'OK'/*, onPress: () => console.log('OK Pressed')*/ },]
                )
            )
        } else {
            this.setState({ freqCheckOp: false })
            let a = this.state.freqList
            let b = []
            b.push({ name: this.state.freqListName, orderAcord: this.state.orderAcord, member: a })
            try {
                let c = await AsyncStorage.getItem('frequList')
                if (c === null) {
                    await AsyncStorage.setItem('frequList', JSON.stringify(b))
                    Actions.MainScreen()
                } else {
                    let d = []
                    d = JSON.parse(c)
                    let e = []
                    d.forEach(obj => {
                        e.push({
                            member: obj.member, name: obj.name, orderAcord: obj.orderAcord
                        }, { name: this.state.freqListName, orderAcord: this.state.orderAcord, member: a })
                    })
                    await AsyncStorage.setItem('frequList', JSON.stringify(e))
                    Actions.pop()
                }
            } catch (e) { console.log("finalCheck error", e) }
        }
    }
    selectAll = () => {
        if (this.state.isAllSelect === false) {
            const limit = this.state.limit
            if (limit > 499) {
                const title = this.props.lanData.tooManyTi
                const msg = this.props.lanData.tooManyMsg
                return (
                    Alert.alert(
                        title, msg,
                        [{ text: 'OK'/*, onPress: () => console.log('OK Pressed')*/ },]
                    )
                )
            } else {
                let newMember = []
                let obj = this.state.endsort
                obj.forEach(objj => {
                    newMember.push({
                        member_name: objj.member_name,
                        member_id: objj.member_id
                    })
                })
                obj.forEach((value, index) => { obj[index]['freq'] = 1 })
                this.setState({ freqList: newMember, endsort: obj, isAllSelect: true })
            }
        } else {
            let reMember = this.state.endsort
            reMember.forEach((value, index) => { reMember[index]['freq'] = 0 })
            this.setState({ freqList: [], endsort: reMember, isAllSelect: false })
        }
    }
    render() {
        const AttFetch = this.props.tolAtt.isFetching || this.props.sumAtt.isFetching
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
                    <IconButton icon="tune-vertical" size={25} color={this.props.themeData.SthemeC}
                        onPress={() => this.setState({ alotsOp: true })} style={{ elevation: 15 }}
                    />
                    <IconButton icon="account-group" size={25} color={this.props.themeData.SthemeC}
                        onPress={this.DistrictRender} style={{ elevation: 15 }}
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
                        onPress={() => this.clearFilter()}
                    >{this.props.lanData.clearAll}</Button>
                    <Button
                        mode="outlined"
                        labelStyle={[this.props.ftszData.paragraph, this.props.themeData.Ltheme]}
                        style={[this.props.themeData.SthemeB, { borderRadius: 18, elevation: 12, marginHorizontal: 5 }]}
                        onPress={() => this.selectAll()}
                    >{this.props.lanData.selectAll}</Button>
                </View>
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
                                    descriptionStyle={[this.props.themeData.Stheme, this.props.ftszData.paragraph]}
                                    description={item.church_name}
                                    right={props => <List.Icon {...props} icon={
                                        item.freq === 1 ? "check" : ""
                                    } color={this.props.themeData.SthemeC} style={this.props.ftszData.paragraph} />}
                                    onPress={() => this.newMember(item.member_name, item.member_id, item.freq)}
                                />
                            )}
                        />
                    </View>}
                <Portal>
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
                                onPress={() => this.arrayFilter()}
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
                                onPress={() => this.arrayFilter()}
                            >OK</Button>
                        </Dialog.Actions>
                    </Dialog>
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
                                            showOrderAcord: this.props.lanData.lordTableFull
                                        })
                                    }} />
                                <List.Item
                                    title={this.props.lanData.prayerFull}
                                    titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                                    onPress={() => {
                                        this.setState({
                                            orderAcord: '40',
                                            showOrderAcord: this.props.lanData.prayerFull
                                        })
                                    }} />
                                <List.Item
                                    title={this.props.lanData.homeMetFull}
                                    titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                                    onPress={() => {
                                        this.setState({
                                            orderAcord: '38',
                                            showOrderAcord: this.props.lanData.homeMetFull
                                        })
                                    }} />
                                <List.Item
                                    title={this.props.lanData.grouMetFull}
                                    titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                                    onPress={() => {
                                        this.setState({
                                            orderAcord: '39',
                                            showOrderAcord: this.props.lanData.grouMetFull
                                        })
                                    }} />
                                <List.Item
                                    title={this.props.lanData.gospVisFull}
                                    titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                                    onPress={() => {
                                        this.setState({
                                            orderAcord: '1473',
                                            showOrderAcord: this.props.lanData.gospVisFull
                                        })
                                    }} />
                            </ScrollView>
                        </Dialog.ScrollArea>
                        <Dialog.Actions>
                            <Button
                                labelStyle={[this.props.ftszData.paragraph, this.props.themeData.XLtheme]}
                                onPress={() => this.reOrder()}
                            >OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog
                        visible={this.state.freqCheckOp}
                        style={this.props.themeData.LthemeB}
                        onDismiss={() => this.setState({ freqCheckOp: false })}>
                        <Dialog.ScrollArea>
                            <ScrollView contentContainerStyle={{ paddingTop: 24 }}>
                                <View>
                                    <TextInput
                                        autoCapitalize='none' placeholderTextColor={this.props.themeData.Stheme}
                                        placeholder={this.props.lanData.listName} maxLength={20} blurOnSubmit={true}
                                        onChangeText={text => this.setState({ freqListName: text })}
                                        value={this.state.freqListName} textAlignVertical="center"
                                        style={[
                                            this.props.themeData.MthemeB, this.props.ftszData.paragraph,
                                            this.props.themeData.SthemeBo, this.props.themeData.XLtheme, styles.txInDialog
                                        ]}
                                    />
                                    {this.state.freqList.map((item) => (
                                        <List.Item
                                            title={item.member_name}
                                            titleStyle={[this.props.themeData.Stheme, this.props.ftszData.subhead]}
                                        />
                                    ))}
                                </View>
                            </ScrollView>
                        </Dialog.ScrollArea>
                        <Dialog.Actions>
                            <Button
                                labelStyle={[this.props.ftszData.paragraph, this.props.themeData.XLtheme]}
                                onPress={() => this.finalCheck()}
                            >OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <FAB style={styles.fab} icon="check" small
                    label={this.props.lanData.ListConfirm}
                    onPress={() => this.setState({ freqCheckOp: true })} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AddFreqScreen)

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
    pickerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
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
    txInDialog: {
        paddingLeft: 5,
        borderRadius: 18,
        borderWidth: 1,
        marginVertical: 8,
        paddingVertical: 3,
        paddingLeft: 20,
        marginRight: 10,
        width: "80%",
    },
    selectGroup: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    actInd: {
        height: "90%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})