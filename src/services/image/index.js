import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'
import { defaultInstance } from '../index'
import { removeEmpty } from '../../utils'
import { responseSuccess, responseError } from '../../utils/response'

export const mapField = (item, index) => {
    const id = item?.user_id
    console.log(`${process.env.REACT_APP_SERVICE_URL}${item.file_path}`)
    return {
        index,
        key: uuidv4(),
        ...item,
        file_path: `${process.env.REACT_APP_SERVICE_URL}${item.file_path}`
    }
}

export const getImageApi = ({
    room_id,
    other_serviec_id,
    location_id,
    reserv_bill
}) => {

    const params = removeEmpty({
        location_id: location_id,
        other_serviec_id: other_serviec_id,
        room_id: room_id,
        reserv_bill: reserv_bill
    })

    const config = {
        method: 'get',
        url: `/api/upload_images`,
        params
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

export const createImageApi = ({
    room_id,
    other_service_id,
    location_id,
    reserv_bill
},not_del_ids,images) => {

    const formData = new FormData()
    _.map(images,(item,idx)=>{
        formData.append(`image_${idx}`, item)
    })
    
    if(room_id != null){
        formData.append(`room_id`, room_id)
    }

    if(reserv_bill != null){
        formData.append(`reserv_bill`, reserv_bill)
    }

    if(other_service_id != null){
        formData.append(`other_service_id`, other_service_id)
    }

    if(location_id != null){
        formData.append(`location_id`, location_id)
    }

    if(not_del_ids.length != 0){
        formData.append(`not_del_ids`, not_del_ids.join())
    }

    const config = {
        method: 'post',
        url: `/api/upload_images`,
        data: formData
    }
    return defaultInstance
        .request(config)
        .then((res) => {
           return res
        })
        .catch((err) => {
            return err
        })
}