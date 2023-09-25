import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'
import { defaultInstance } from '../index'
import { removeEmpty } from '../../utils'
import { responseSuccess, responseError } from '../../utils/response'

export const mapField = (item, index) => {
    const id = item?.user_id
    const orgStructure = item?.employee?.org_structure
    return {
        index,
        key: uuidv4(),
        ...item,
    }
}

export const getDropdownRoomApi = () => {

    const config = {
        method: 'get',
        url: `/api/dropdown/room`
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return {
                data: _.map(res.data, mapField)
            }
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
export const getAllRoomAvailableApi = () => {

    const config = {
        method: 'get',
        url: `/api/dropdown/room/available`
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return {
                data: _.map(res.data, mapField)
            }
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

export const getDropdownBuildingApi = () => {

    const config = {
        method: 'get',
        url: `/api/dropdown/building`,
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return {
                data: _.map(res.data, mapField)
            }
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

export const getDropdownRoomTypeApi = () => {

    const config = {
        method: 'get',
        url: `/api/dropdown/room_type`,
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return {
                data: _.map(res.data, mapField)
            }
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

export const getDropdownBalanceRoomApi = () => {

    const config = {
        method: 'get',
        url: `/api/dropdown/balance_room`,
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return {
                data: _.map(res.data, mapField)
            }
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

export const getDropdownUserApi = () => {

    const config = {
        method: 'get',
        url: `/api/dropdown/user`,
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return {
                data: _.map(res.data, mapField)
            }
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

export const getDropdownRoomStatusApi = () => {

    const config = {
        method: 'get',
        url: `/api/dropdown/room_status`,
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return {
                data: _.map(res.data, mapField)
            }
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