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

export const ExportBillApi = ({
    export_ids,
    electricity_month,
    electricity_year,
}) => {

    const data = {
        export_ids: export_ids,
        electricity_month: parseInt(electricity_month),
        electricity_year: parseInt(electricity_year),
    }

    const config = {
        method: 'post',
        url: `/api/export/monthly_bill`,
        responseType: 'blob',
        data
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            saveFileFromResponse(res,`monthly_bill_${electricity_year}_${electricity_month}.zip`)
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


export const ExportOverdueBillApi = ({
    export_ids
}) => {

    const data = {
        export_ids: export_ids
    }

    const config = {
        method: 'post',
        url: `/api/export/overdue_monthly_bill`,
        responseType: 'blob',
        data
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            saveFileFromResponse(res,`overdue_bill_${moment().format('YYYY')}_${moment().format('MM')}.zip`)
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

export const ExportReservBillApi = ({
    room_id
}) => {

    const data = {
        room_id: room_id
    }

    const config = {
        method: 'post',
        url: `/api/export/reserv_bill`,
        responseType: 'blob',
        data
    }
    return defaultInstance
        .request(config)
        .then((res) => {
            saveFileFromResponsePDF(res,`overdue_bill_${moment().format('YYYY')}_${moment().format('MM')}.pdf`)
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

export const saveFileFromResponse = (response,filename) => {
    // const filenameRegex = /filename[^;=\n]*\*?=(?:utf-8'')?((['"]).*?\2|[^;\n\\/:*?"<>|]*)$/
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
    // const contentDispostion = response.request.getResponseHeader('Content-Disposition')
  
  
    const link = document.createElement('a')
  
    link.href = downloadUrl
  
    link.setAttribute('download', filename) //any other extension
  
    document.body.appendChild(link)
  
    link.click()
  
    link.remove()
  }

  export const saveFileFromResponsePDF = (response,filename) => {
    // const filenameRegex = /filename[^;=\n]*\*?=(?:utf-8'')?((['"]).*?\2|[^;\n\\/:*?"<>|]*)$/
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
    // const contentDispostion = response.request.getResponseHeader('Content-Disposition')
  
  
    window.open(downloadUrl, 'Download');  
  }
