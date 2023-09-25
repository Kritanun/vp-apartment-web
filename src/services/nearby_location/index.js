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

export const getNearbyLocationApi = () => {

    const config = {
        method: 'get',
        url: `/api/nearby_location`,
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

export const createNearbyLocationApi = ({
    location_name,
    location_detail,
    map
}) => {

    const data = {
        location_name: location_name,
        location_detail: location_detail,
        map: map
    }

    const config = {
        method: 'post',
        url: `/api/nearby_location`,
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

export const updateNearbyLocationApi = ({
    location_name,
    location_detail,
    map
},id) => {

    const data = {
        location_name: location_name,
        location_detail: location_detail,
        map: map
    }

    const config = {
        method: 'patch',
        url: `/api/nearby_location/${id}`,
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

export const deleteNearbyLocationApi = (id) => {

    const config = {
        method: 'delete',
        url: `/api/nearby_location/${id}`,
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