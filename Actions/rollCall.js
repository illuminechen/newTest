import { ROLLCALL_TODOS, ROLLCALL_SUCCESS, ROLLCALL_FAILURE } from './constants'

export function rollCall() {
    return (dispatch) => {
        dispatch(getToDos())

        return (
            fetch(``, {
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