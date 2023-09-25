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
        ...item,
    }
}

export const getSummaryDashboardApi = ({
    month,
    year,
}) => {

    const params = removeEmpty({
        month: parseInt(month),
        year: parseInt(year),
    })

    const config = {
        method: 'get',
        url: `/api/dashboard_monthly_summary`,
        params
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

export const getUsageRoomDashboardApi = ({
    year,
    room_id
}) => {

    const params = removeEmpty({
        year: year,
        room_id: room_id,
    })

    const config = {
        method: 'get',
        url: `/api/dashboard_statistics_usage_room`,
        params
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
