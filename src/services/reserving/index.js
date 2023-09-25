import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'
import { defaultInstance } from '../index'
import { removeEmpty } from '../../utils'
import { responseSuccess, responseError } from '../../utils/response'
import moment from 'moment'
export const mapField = (item, index) => {
    const id = item?.user_id
    return {
        index,
        key: uuidv4(),
        ...item
    }
}

export const getReservingRoomApi = ({
    page,
    size,
    room_id,
    building_name,
    room_type,
    rental_balance
}) => {

    const params = {
        page: page,
        size: size,
        room_id: room_id,
        building_name: building_name,
        room_type: room_type,
        rental_balance: rental_balance
    }

    const config = {
        method: 'get',
        url: `/api/reserving_room`,
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

export const getLeaveOrChangeRoomApi = ({
    page,
    size,
    room_id,
    building_name,
    room_type,
    rental_balance
}) => {

    const authToken = localStorage.getItem('token') == null ? {} : { Authorization: `Bearer ${localStorage.getItem('token')}` }

    const params = {
        page: page,
        perPage: size,
        room_id: room_id,
        building_name: building_name,
        room_type: room_type,
        rental_balance: rental_balance
    }

    const config = {
        method: 'get',
        url: `/api/leave_change_room`,
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

export const getAllRequestRoomApi = ({
    page,
    size,
    room_id,
    building_name,
    room_type,
    rental_balance,
    room_status
}) => {

    const params = {
        page: page,
        size: size,
        room_id: room_id,
        building_name: building_name,
        room_type: room_type,
        rental_balance: rental_balance,
        room_status: room_status
    }

    const config = {
        method: 'get',
        url: `/api/all_requrst_room`,
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

export const updateReservingRoomApi = ({
    user_id,
    reserv_stay_in_date
}, id) => {

    const data = {
        user_id: user_id,
        reserv_stay_in_date: reserv_stay_in_date.format('YYYY-MM-DD'),
        request_date: moment().format('YYYY-MM-DD')

    }

    const config = {
        method: 'patch',
        url: `/api/reserving_room/reserv/${id}`,
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

export const updateChangeRoomApi = ({
    change_room_id,
    reserv_stay_in_date
}, id) => {

    const data = {
        change_room_id: change_room_id,
        reserv_stay_in_date: moment(reserv_stay_in_date).format('YYYY-MM-DD'),
        request_date: moment().format('YYYY-MM-DD')
    }

    const config = {
        method: 'patch',
        url: `/api/reserving_room/change_room/${id}`,
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

export const updateLeaveRoomApi = ({
    leave_date
}, id) => {

    const data = {
        leave_date: moment(leave_date).format('YYYY-MM-DD'),
        request_date: moment().format('YYYY-MM-DD')
    }

    const config = {
        method: 'patch',
        url: `/api/reserving_room/leave/${id}`,
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

export const updateCancelReservRoomApi = (id) => {

    // const data = {
    //     leave_date: leave_date
    // }

    const config = {
        method: 'patch',
        url: `/api/reserving_room/cancel_reserv/${id}`,
        // data
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

export const updateApproveRoomApi = (id,value) => {
    console.log(value)
    const data = {
        effective_date: value.effective_date != undefined? value.effective_date.format('YYYY-MM-DD') : null
    }

    const config = {
        method: 'patch',
        url: `/api/reserving_room/approve/${id}`,
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

export const updateRejectRoomApi = (id) => {

    // const data = {
    //     leave_date: leave_date
    // }

    const config = {
        method: 'patch',
        url: `/api/reserving_room/reject/${id}`,
        // data
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