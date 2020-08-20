import { TOLATT_TODOS, TOLATT_SUCCESS, TOLATT_FAILURE } from './constants'

export function totalAttend(year, week, start, limit, sex, member_status, status, role, search) {
    //console.log("year,week", year,week)
    return (dispatch) => {
        dispatch(getToDos())

        return (
            fetch(`https://www.chlife-stat.org/list_members.php?start=${start}&limit=${limit}&year=${year}&week=${week}&sex=${sex}&member_status=${member_status}&status=${status}&role=${role}&search_col=member_name&search=${search}&churches%5B%5D=0%2C0&filter_mode=churchStructureTab&roll_call_list=`,{
                method: 'GET',
                //body: JSON.stringify(data),
                headers: new Headers({
                    'cookie': 'PHPSESSID=ruddbpe6pgjvgr9poucbnb1el3'
                })
            })
            )
            .then(res => res.json())
            .then(json => {

                return (dispatch(getToDosSuccess(json)))
            })
            .catch(err => dispatch(getToDosFailure(err)))
    }
}

function getToDos() {

    return {
        type: TOLATT_TODOS
    }
}

function getToDosSuccess(data) {
//console.log("totalAtt_success", data.summary)
    return {
        type: TOLATT_SUCCESS,
        data
    }
}

function getToDosFailure() {
    return {
        type: TOLATT_FAILURE
    }
}