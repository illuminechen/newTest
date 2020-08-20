import { SUMATT_TODOS, SUMATT_SUCCESS, SUMATT_FAILURE } from './constants'

export function sumAttend(meeting, year_from, month_from, year_to, month_to, search, sex, member_status, status, role, limit) {
    return (dispatch) => {
        dispatch(getToDos())

        return (
            fetch(`https://www.chlife-stat.org/list_attendace.php?start=&meeting=${meeting}&search=${search}&search_col=member_name&year_from=${year_from}&month_from=${month_from}&year_to=${year_to}&month_to=${month_to}&sex=${sex}&member_status=${member_status}&status=${status}&role=${role}&birth_year=&baptized_year=&limit=${limit}&churches%5B%5D=0%2C0`, {
                method: 'GET',
                //body: JSON.stringify(data),
                headers: new Headers({
                    'cookie': 'PHPSESSID=mvgv35lnt2iulo1ut42tbku8n5'
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
        type: SUMATT_TODOS
    }
}

function getToDosSuccess(data) {
    //console.log("sumAtt_success", data)
    return {
        type: SUMATT_SUCCESS,
        data
    }
}

function getToDosFailure() {
    return {
        type: SUMATT_FAILURE
    }
}