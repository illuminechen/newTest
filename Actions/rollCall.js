import { ROLLCALL_TODOS, ROLLCALL_SUCCESS, ROLLCALL_FAILURE } from './constants'

export function rollCall(member_ids, meeting, year, week, attend) {
    return (dispatch) => {
        dispatch(getToDos())

        return (
            fetch('https://www.chlife-stat.org/edit_member_activity.php', {
                method: 'POST',
                body: `member_ids=${member_ids}&meeting=${meeting}&year=${year}&week=${week}&attend=${attend}`,
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'cookie': 'PHPSESSID=jumoqvikmsjtmemg6h28mracg0'
                }),
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
        type: ROLLCALL_TODOS
    }
}

function getToDosSuccess(data) {
    //console.log("rollCall_success", data.summary)
    return {
        type: ROLLCALL_SUCCESS,
        data
    }
}

function getToDosFailure() {
    return {
        type: ROLLCALL_FAILURE
    }
}