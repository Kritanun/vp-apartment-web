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

export const getElectricityBillOverdueApi = ({
    user_id,
    building_name,
    room_id,
    page,
    size,
}) => {

    const authToken = localStorage.getItem('token') == null ? {} : { Authorization: `Bearer ${localStorage.getItem('token')}` }

    const params = removeEmpty({
        page: page,
        perPage: size,
        user_id: user_id,
        building_name: building_name,
        room_id: room_id
    })

    const config = {
        method: 'get',
        url: `/api/electricity_bill_overdue`,
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
            if(err?.response?.status == 401){
                localStorage.removeItem('token')
                localStorage.removeItem('auth')
                window.location.href = `${window.location.origin.toString()}${process.env.REACT_APP_BASENAME}`
            }
            return err
        })
}

export const approvePaymentOverdueApi = (id) => {

    const config = {
        method: 'patch',
        url: `/api/approve_payment_overdue/${id}`,
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
