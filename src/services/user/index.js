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

export const getUserApi = ({
    page,
    size,
    room_id,
    user_id
}) => {

    const authToken = localStorage.getItem('token') == null ? {} : { Authorization: `Bearer ${localStorage.getItem('token')}` }

    const params = removeEmpty({
        page: page,
        perPage: size,
        room_id: room_id,
        user_id: user_id,
    })

    const config = {
        method: 'get',
        url: `/api/user`,
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


export const updateUserApi = ({
    user_full_name,
    id_card_number,
    email,
    tel_number,
},id) => {

    const data = {
        user_full_name: user_full_name,
        id_card_number: id_card_number,
        email: email,
        tel_number: tel_number
    }

    const config = {
        method: 'patch',
        url: `/api/user/${id}`,
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