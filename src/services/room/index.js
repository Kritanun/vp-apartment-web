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

export const getRoomApi = ({
    page,
    size,
    room_id,
    building_name,
    room_type,
    rental_balance
}) => {

    const authToken = localStorage.getItem('token') == null ? {} : { Authorization: `Bearer ${localStorage.getItem('token')}` }

    const params = removeEmpty({
        page: page,
        perPage: size,
        room_id: room_id,
        building_name: building_name,
        room_type: room_type,
        rental_balance: rental_balance
    })

    const config = {
        method: 'get',
        url: `/api/room`,
        headers: {
            ...authToken
        },
        params
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return {
                items: _.map(res.data?.data, mapField),
                total: res.data.total,
                page: res.data.page,
                size: res.data.size,
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

export const createRoomApi = ({
    room_no,
    building_name,
    room_type,
    room_detail,
    deposit_amount,
    rental_balance
}) => {

    const data = {
        room_no: room_no,
        building_name: building_name,
        room_type: room_type,
        room_detail: room_detail,
        deposit_amount: deposit_amount,
        rental_balance: rental_balance
    }

    const config = {
        method: 'post',
        url: `/api/room`,
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

export const updateRoomApi = ({
    room_no,
    building_name,
    room_type,
    room_detail,
    deposit_amount,
    rental_balance
},id) => {

    const data = {
        room_no: room_no,
        building_name: building_name,
        room_type: room_type,
        room_detail: room_detail,
        deposit_amount: deposit_amount,
        rental_balance: rental_balance
    }

    const config = {
        method: 'patch',
        url: `/api/room/${id}`,
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

export const deleteRoomApi = (id) => {

    const config = {
        method: 'delete',
        url: `/api/room/${id}`,
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

export const getRoomSummaryApi = () => {
    
    const config = {
        method: 'get',
        url: `/api/room/summary`,
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            return {
                data: res.data
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

export const updateRoomOutstandingBalanceApi = ({
    outstanding_balance
},id) => {

    const data = {
        outstanding_balance: outstanding_balance,
    }

    const config = {
        method: 'patch',
        url: `/api/room_outstanding_balance/${id}`,
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