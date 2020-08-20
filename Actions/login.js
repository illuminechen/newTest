import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_TODOS } from './constants'

export function login(account, church_id, district, language, pwd) {
//console.log("pass massage", account)
    return (dispatch) => {
        dispatch(getToDos())

  
            fetch('https://www.chlife-stat.org/authenticate_oldold.php?', {
                method: 'POST',
                body:`account=${account.account}&church_id=${account.church_id}&district=${account.district}&language=${account.language}&pwd=${account.pwd}`,
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'cookie' : 'PHPSESSID=rue44eko3tk208rtm0g8fnuub4'
                }),
            })
        
            .then(res =>{ 
               
                return res.text()
                
            }).then(function(html) {
                  
                dispatch(getToDosSuccess(String(html).length))   
            })
            
            .catch(err => dispatch(getToDosFailure(err), /*console.log('err',err)*/))
        }
}

function getToDos() {

    return {
        type: LOGIN_TODOS
    }
}

function getToDosSuccess(data) {

    return {
        type: LOGIN_SUCCESS,
        data
    }
}

function getToDosFailure() {
    return {
        type: LOGIN_FAILURE
    }
}