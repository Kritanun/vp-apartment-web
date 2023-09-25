import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'
import { defaultInstance } from '../index'
import { removeEmpty } from '../../utils'
import { responseSuccess, responseError } from '../../utils/response'

export const mapField = (item, index) => {
    const id = item?.user_id
    return {
        index,
        key: uuidv4(),
        ...item,
    }
}

export const loginApi = ({
    username,
    password
}) => {

    const data = {
        username: username,
        password: password
    }

    const config = {
        method: 'post',
        url: `/api/login`,
        data
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            if(err?.response?.status == 401){
                localStorage.removeItem('token')
                localStorage.removeItem('auth')
                window.location.href = `${window.location.origin.toString()}${process.env.REACT_APP_BASENAME}`
            }
            return err
        })
}

export const logoutApi = ({ authToken }) => {

    const config = {
        method: 'post',
        url: `/api/logout`,
        headers: {
            Authorization: `Bearer ${authToken}`
        },
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            if(err?.response?.status == 401){
                localStorage.removeItem('token')
                localStorage.removeItem('auth')
                window.location.href = `${window.location.origin.toString()}${process.env.REACT_APP_BASENAME}`
            }
            return err
        })
}

export const registerApi = ({
    user_full_name,
    id_card_number,
    tel_number,
    email,
    username,
    password,
    room_id
}) => {

    const data = {
        user_full_name: user_full_name,
        id_card_number: id_card_number,
        tel_number: tel_number,
        email: email,
        username: username,
        password: password,
        room_id: room_id
    }

    const config = {
        method: 'post',
        url: `/api/register`,
        data
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            if(err?.response?.status == 401){
                localStorage.removeItem('token')
                localStorage.removeItem('auth')
                window.location.href = `${window.location.origin.toString()}${process.env.REACT_APP_BASENAME}`
            }
            return 400
        })
}

export const getMeApi = ({ authToken }) => {

    const config = {
        method: 'get',
        url: `/api/me`,
        headers: {
            Authorization: `Bearer ${authToken}`
        },
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            if(err?.response?.status == 401){
                localStorage.removeItem('token')
                localStorage.removeItem('auth')
                window.location.href = `${window.location.origin.toString()}${process.env.REACT_APP_BASENAME}`
            }
            return err
        })
}

export const forgetPasswordApi = ({ 
    user_name,
    tel_number,
    password
 }) => {

    const data = {
        user_name: user_name,
        tel_number: tel_number,
        password: password
    }

    const config = {
        method: 'post',
        url: `/api/forget_password`,
        data
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return res
        })
        .catch((err) => {
            if(err?.response?.status == 401){
                localStorage.removeItem('token')
                localStorage.removeItem('auth')
                window.location.href = `${window.location.origin.toString()}${process.env.REACT_APP_BASENAME}`
            }
            return err
        })
}