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
        ...item
    }
}

export const getFeedbackApi = ({
    is_read,
    page,
    size,
}) => {

    const params = removeEmpty({
        page: page,
        perPage: size,
        is_read: is_read
    })

    const config = {
        method: 'get',
        url: `/api/feed_back`,
        params: params
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

export const createFeedbackApi = ({
    feed_back_title,
    feed_back_desc,
    room_no,
    building_name
}) => {

    const data = {
        feed_back_title: feed_back_title,
        feed_back_desc: feed_back_desc,
        room_no: room_no,
        building_name: building_name
    }

    const config = {
        method: 'post',
        url: `/api/feed_back`,
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

export const updateFeedbackApi = ({
    is_read,
},id) => {

    const data = {
        is_read: is_read,
    }

    const config = {
        method: 'patch',
        url: `/api/feed_back/${id}`,
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
