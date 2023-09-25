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
        electricity_total_amount: item.electricity_amount + item.trash_amount + item.water_amount
    }
}

export const getElectricityBillApi = ({
    month,
    year,
    building_name,
    room_id,
    page,
    size,
}) => {
    const authToken = localStorage.getItem('token') == null ? {} : { Authorization: `Bearer ${localStorage.getItem('token')}` }

    const params = removeEmpty({
        page: page,
        perPage: size,
        month: month,
        year: year,
        building_name: building_name,
        room_id: room_id
    })

    const config = {
        method: 'get',
        url: `/api/electricity_bill`,
        headers: {
            ...authToken
        },
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
            console.log(err.response)
            if(err?.response?.status == 401){
                localStorage.removeItem('token')
                localStorage.removeItem('auth')
                window.location.href = `${window.location.origin.toString()}${process.env.REACT_APP_BASENAME}`
            }
            return err
        })
}

export const createElectricityBillApi = ({
    room_id,
    electricity_month,
    electricity_year,
    electricity_start_unit,
    electricity_end_unit,
    water_start_unit,
    water_end_unit,
    electricity_amount,
    trash_amount,
    comsumption_water,
    water_amount,
    discount,
    add_amount
}) => {

    const data = {
        room_id: room_id,
        electricity_month: electricity_month,
        electricity_year: electricity_year,
        electricity_start_unit: electricity_start_unit,
        electricity_end_unit: electricity_end_unit,
        electricity_amount: electricity_amount,
        trash_amount: trash_amount,
        comsumption_water: comsumption_water,
        water_start_unit: water_start_unit,
        water_end_unit: water_end_unit,
        water_amount: water_amount,
        discount: discount,
        add_amount: add_amount
    }

    const config = {
        method: 'post',
        url: `/api/electricity_bill`,
        data
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

export const updateElectricityBillApi = ({
    room_id,
    electricity_month,
    electricity_year,
    comsumption_electricity,
    electricity_amount,
    trash_amount,
    comsumption_water,
    water_amount,
    discount,
    add_amount
}, id) => {

    const data = {
        room_id: room_id,
        electricity_month: electricity_month,
        electricity_year: electricity_year,
        comsumption_electricity: comsumption_electricity,
        electricity_amount: electricity_amount,
        trash_amount: trash_amount,
        comsumption_water: comsumption_water,
        water_amount: water_amount,
        discount: discount,
        add_amount: add_amount
    }

    const config = {
        method: 'patch',
        url: `/api/electricity_bill/${id}`,
        data
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

export const deleteElectricityBillApi = (id) => {

    const config = {
        method: 'delete',
        url: `/api/electricity_bill/${id}`,
    }
    return defaultInstance
        .request(config)
        .then((res) => {

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

export const approvePaymentApi = (id) => {

    const config = {
        method: 'patch',
        url: `/api/approve_payment/${id}`,
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