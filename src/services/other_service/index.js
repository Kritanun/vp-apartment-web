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

export const getOtherServiceApi = () => {

    const config = {
        method: 'get',
        url: `/api/other_service`,
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

export const createOtherServiceApi = ({
    other_service_name,
    other_serivce_desc,
    other_service_localtion,
    service_fee,
    other_service_unit
}) => {

    const data = {
        other_service_name: other_service_name,
        other_serivce_desc: other_serivce_desc,
        other_service_localtion: other_service_localtion,
        service_fee: service_fee,
        other_service_unit: other_service_unit
    }

    const config = {
        method: 'post',
        url: `/api/other_service`,
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

export const updateOtherServiceApi = ({
    other_service_name,
    other_serivce_desc,
    other_service_localtion,
    service_fee,
    other_service_unit
},id) => {

    const data = {
        other_service_name: other_service_name,
        other_serivce_desc: other_serivce_desc,
        other_service_localtion: other_service_localtion,
        service_fee: service_fee,
        other_service_unit: other_service_unit
    }

    const config = {
        method: 'patch',
        url: `/api/other_service/${id}`,
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

export const deleteOtherServiceApi = (id) => {

    const config = {
        method: 'delete',
        url: `/api/other_service/${id}`,
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