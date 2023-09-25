import { useState } from 'react'
import { useAsync } from 'react-use'
import _ from 'lodash'
import Styled from './styled'
import {
  Table,
  Card,
  Typography,
  Input,
  Form,
  Row,
  Col,
  DatePicker,
  Button,
  Space,
  Tooltip,
  Modal,
  Select,
  InputNumber,
  Spin,
  notification
} from 'antd'
import {
  DeleteOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ExportOutlined,
  SearchOutlined,
  CheckOutlined
} from '@ant-design/icons'
import moment from 'moment'
import { ExportBillApi } from '../../services/export'
import {
  getElectricityBillApi,
  createElectricityBillApi,
  updateElectricityBillApi,
  deleteElectricityBillApi,
  approvePaymentApi
}
  from '../../services/electricity_bill'
import { getDropdownRoomApi, getDropdownBuildingApi } from '../../services/filter'
import {updateRoomOutstandingBalanceApi} from '../../services/room';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;


export default function PageElectricity() {
  const [visibleModelCreate, setVisibleModelCreate] = useState(false)
  const [data, setData] = useState([])
  const [exportIds, setExportIds] = useState([])
  const [searchMonth, setSearchMonth] = useState(moment().format('MM'))
  const [searchYear, setSearchYear] = useState(moment().format('YYYY'))
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('auth')))

  const [filters, setFilters] = useState({
    page: 1,
    size: 10,
    // month: moment().format('MM'),
    // year: moment().format('YYYY'),
  })

  const [filtersSearch, setFiltersSearch] = useState({

  })

  const [total, setTotal] = useState(0)
  const [water_start_unit, setWaterStartUnit] = useState(null)
  const [water_end_unit, setWaterEndUnit] = useState(null)
  const [outstanding_balance, setOutstandingBalance] = useState(null)
  const [electricity_start_unit, setElectricityStartUnit] = useState(null)
  const [electricity_end_unit, setElectricityEndUnit] = useState(null)
  const [dropdownRoomNo, setDropdownRoomNo] = useState([])
  const [dropdownRoomByStatus, setDropdownRoomByStatus] = useState([])
  const [dropdownBuilding, setDropdownBuilding] = useState([])
  const [form] = Form.useForm()
  const [actionId, setActionId] = useState(null)
  const [loadingPage, setLoadingPage] = useState(true)
  const getDropdown = async () => {
    setLoadingPage(true)
    let dataRoom = await getDropdownRoomApi()

    let dataBuilding = await getDropdownBuildingApi()

    let tempData = []
    let tempData2 = []
    dataRoom.data.map((item) => {
      tempData.push({
        label: `${item?.room_no} ตึก ${item?.building_name}`,
        value: item?.room_id,
      })

      if (item.room_status == 'สำเร็จ' || item.room_status == 'ขอย้ายห้อง' || item.room_status == 'ขอย้ายออก') {
        tempData2.push({
          label: `${item?.room_no} ตึก ${item?.building_name}`,
          value: item?.room_id,
        })
      }
    })

    setDropdownRoomNo(tempData)
    setDropdownRoomByStatus(tempData2)

    tempData = []
    dataBuilding.data.map((item) => {
      tempData.push({
        label: item?.building_name,
        value: item?.building_name,
      })
    })

    setDropdownBuilding(tempData)
    setLoadingPage(false)
  }

  const confirmDelete = (delId) => {
    Modal.confirm({
      title: "Delete",
      icon: <ExclamationCircleOutlined />,
      content: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่",
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        await deleteElectricityBillApi(delId)
        _list()
      }
    });
  }

  const columns = [
    {
      title: 'เลขห้อง',
      dataIndex: 'room_no',
      key: 'room_no',
      width: 100,
    },
    {
      title: 'ตึก',
      dataIndex: 'building_name',
      key: 'building_name',
      width: 100,
    },
    {
      title: 'ค่าไฟประจำเดือน',
      dataIndex: 'electricity_month',
      key: 'electricity_month',
      width: 100,
      render: (text, record) => {
        let month_text = [
          "",
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม"]
        return (
          month_text[record.electricity_month]
        )
      }
    },
    {
      title: 'ค่าเช่าห้อง',
      dataIndex: 'rental_balance',
      key: 'rental_balance',
      width: 100,
    },
    {
      title: 'หน่วยที่ใช้น้ำ',
      dataIndex: 'water_start_unit',
      key: 'water_start_unit',
      width: 100,
      render: (text, record) => {
        return (
          `${record.water_start_unit} - ${record.water_end_unit}`
        )
      }
    },
    {
      title: 'ค่าน้ำ',
      dataIndex: 'water_amount',
      key: 'water_amount',
      width: 100,
    },
    {
      title: 'หน่วยที่ใช้ไฟฟ้า',
      dataIndex: 'electricity_start_unit',
      key: 'electricity_start_unit',
      width: 100,
      render: (text, record) => {
        return (
          `${record.electricity_start_unit} - ${record.electricity_end_unit}`
        )
      }
    },
    {
      title: 'ค่าไฟฟ้า',
      dataIndex: 'electricity_amount',
      key: 'electricity_amount',
      width: 100,
    },
    {
      title: 'ค่าเก็บขยะ',
      dataIndex: 'trash_amount',
      key: 'trash_amount',
      width: 100,
    },
    {
      title: 'รวมเงินค่าไฟฟ้า',
      dataIndex: 'total',
      key: 'total',
      width: 100,
    },
    {
      title: 'ส่วนลด',
      dataIndex: 'discount',
      key: 'discount',
      width: 100,
    },
    {
      title: 'ค่าบริการเพิ่มเติม',
      dataIndex: 'add_amount',
      key: 'add_amount',
      width: 100,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status_payment',
      key: 'status_payment',
      width: 100,
      render: (text, record) => {
        return (
          record.status_payment == 0 ? 'ยังไม่ได้ชำระ' : 'ชำระแล้ว'
        )
      }
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: '5%',
      render: (text, record) => {
        return (
          <Space size="small">
            <Tooltip title={'Comfirm Payment'}>
              <Button
                type="link"
                disabled={record.status_payment == 1?true: authUser != null && authUser?.user.is_admin == 1 ? false : true}
                icon={<CheckOutlined />}
                onClick={async () => {
                  showPropsConfirm(record.electricity_bill_id,record.room_id)
                }}
              />
            </Tooltip>
            <Tooltip title={'Edit'}>
              <Button
                type="link"
                disabled={authUser != null && authUser?.user.is_admin == 1 ? false : true}
                icon={<SettingOutlined />}
                onClick={async () => {
                  setActionId(record.electricity_bill_id)
                  setVisibleModelCreate(true)
                  form.setFieldsValue({
                    room_id: record.room_id,
                    electicity_date: moment(`${record.electricity_year}-${record.electricity_month}-01`),
                    building_name: record.building_name,
                    electricity_amount: record.electricity_amount,
                    trash_amount: record.trash_amount,
                    water_amount: record.water_amount,
                    water_end_unit: record.water_end_unit,
                    water_start_unit: record.water_start_unit,
                    electricity_end_unit: record.electricity_end_unit,
                    electricity_start_unit: record.electricity_start_unit,
                    discount: record.discount
                  })
                  setWaterStartUnit(record.water_start_unit)
                  setWaterEndUnit(record.water_end_unit)
                  setElectricityStartUnit(record.electricity_start_unit)
                  setElectricityEndUnit(record.electricity_end_unit)
                }}
              />
            </Tooltip>
            <Tooltip title={'Delete'}>
              <Button
                type="link"
                danger
                disabled={authUser != null && authUser?.user.is_admin == 1 ? false : true}
                icon={<DeleteOutlined />}
                onClick={() => {
                  setActionId(record.electricity_bill_id)
                  confirmDelete(record.electricity_bill_id)
                }}
              />
            </Tooltip>
          </Space>
        )
      },
    }
  ];

  const showPropsConfirm = (bill_id,room_id) => {
    confirm({
      title: 'คุณต้องการยืนยันการจ่ายเงินไช่หรือไม่?',
      icon: <ExclamationCircleOutlined />,
      content:
        
        <Row style={{paddingTop:'5px'}}>
          <Col span={6}>ยอดที่ติดค้าง</Col>
          <Col span={18}>
            <InputNumber id='outstanding_balance_input' onChange={(value) => {
            }} style={{ width: '100%' }}></InputNumber>
          </Col>
        </Row>
      ,
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk: async () => {
        await approvePaymentApi(bill_id)
        let outstanding_balance = document.getElementById('outstanding_balance_input')?.value || null
        if( outstanding_balance != null )
          await updateRoomOutstandingBalanceApi({outstanding_balance: parseInt(outstanding_balance)},room_id)
        await _list()
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  const modelCreateCancel = () => {
    setVisibleModelCreate(false)
  };

  const modelCreateShow = () => {
    setVisibleModelCreate(true)
  }

  const _list = async () => {
    setLoadingPage(true)
    let data = await getElectricityBillApi({ ...filters, ...filtersSearch })

    setData(data);
    // setFilters({
    //   ...filters,
    //   total: data.total
    // })
    setTotal(data.total)
    setLoadingPage(false)
  }

  const createBill = async (value) => {
    console.log(value)
    await createElectricityBillApi({
      ...value,
      electricity_month: moment(value.electicity_date).format('MM'),
      electricity_year: moment(value.electicity_date).format('YYYY')
    })

    await modelCreateCancel()
    await getDropdown()
    await _list()
  }

  const updateBill = async (value) => {
    await updateElectricityBillApi({
      ...value,
      electricity_month: moment(value.electicity_date).format('MM'),
      electricity_year: moment(value.electicity_date).format('YYYY')
    }, actionId)

    await modelCreateCancel()
    await getDropdown()
    await _list()
  }

  const calculateWater = async(start_val,end_val) =>{
    if( start_val != null && end_val != null){
      form.setFieldsValue({
        water_amount: ((end_val - start_val) * 25).toFixed(2)
      })
    }
  }

  const calculateElectricity = async(start_val,end_val) =>{
    if( start_val != null && end_val != null){
      let unit = end_val - start_val
      let cost = 0
      if(unit > 200){
        cost = (200 * 7) + ( (unit - 200) * 4.5 )
      }else{
        cost = unit * 7
      }
      form.setFieldsValue({
        
        electricity_amount: (cost).toFixed(2)
      })
    }
  }

  useAsync(async () => {
    // setLoadingPage(true)
    await getDropdown()
    await _list()
    setAuthUser(JSON.parse(localStorage.getItem('auth')))
    // setLoadingPage(false)
  }, [filters])

  return (
    <Styled className='page page-electricity'>
      <Spin spinning={loadingPage} tip="Loading...">

        <Card>
          <Title level={4}>Electricity</Title>
          <Form
            layout="horizontal"
          // onValuesChange={onFormLayoutChange}
          >
            <Row>
              <Col xs={24} lg={6} style={{ paddingRight: 5 }}>
                <Form.Item label="เลขห้อง">
                  <Select
                    mode="multiple"
                    allowClear
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={dropdownRoomNo}
                    style={{ width: '100%' }}
                    placeholder="เลขห้อง"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        room_id: value
                      })
                    }}
                  >
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item label="ตึก" name="building">
                  <Select
                    mode="multiple"
                    style={{ width: '100%', paddingRight: 5 }}
                    placeholder="ตึก"
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={dropdownBuilding}
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        building_name: value
                      })
                    }}
                  >
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6} style={{ paddingRight: 5 }}>
                <Form.Item label="เดือน ปี">
                  <DatePicker
                    // defaultValue={moment()}
                    style={{ width: '100%' }}
                    picker="month"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        month: moment(value).format('MM'),
                        year: moment(value).format('YYYY')
                      })
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6} style={{ paddingRight: 5 }}>
                <Button
                  icon={<SearchOutlined />}
                  type="primary"
                  htmlType="submit"
                  style={{ float: 'right' }}
                  onClick={async (value) => {
                    setLoadingPage(true)
                    await _list()
                    setSearchMonth(filtersSearch.month)
                    setSearchYear(filtersSearch.year)
                    setLoadingPage(false)
                  }}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card>
          <Space style={{ paddingBottom: 5 }}>
            <Button type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setActionId(null)
                modelCreateShow()
                form.resetFields()
              }}
              disabled={authUser != null && authUser?.user.is_admin == 1 ? false : true}
            >
              Create
            </Button>
            <Button
              block
              type="danger"
              icon={<ExportOutlined />}
              onClick={async () => {
                if (exportIds.length == 0) {
                  notification.warn({
                    message: `แจ้งเตือน`,
                    description:
                      'กรุณาเลือกข้อมูลที่ต้องการส่งออก',
                  })
                } else {
                  await ExportBillApi({ export_ids: exportIds, electricity_month: searchMonth || moment().format('MM'), electricity_year: searchYear || moment().format('YYYY') })
                }
              }}
            >
              Export
            </Button>
          </Space>
          <Form>
            <Table
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys, selectedRows) => {
                  let tempData = []

                  selectedRows.map(item => {
                    tempData.push(item.room_id)
                  })

                  setExportIds(tempData)
                }
              }}
              columns={columns}
              dataSource={data?.items}
              scroll={{ x: 500 }}
              pagination={{
                current: filters.page,
                pageSize: filters.size,
                total: total,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} items`
              }}
              onChange={async (pagination) => {
                await setFilters({
                  ...filters,
                  page: pagination.current,
                  size: pagination.pageSize,
                })
              }}
            />
          </Form>
        </Card>

        <Modal
          title={actionId == null ? "Create" : "Update"}
          visible={visibleModelCreate}
          onOk={async () => {
            form.submit()
          }}
          // confirmLoading={confirmLoading}
          onCancel={modelCreateCancel}
        >
          <Spin spinning={loadingPage} tip="Loading...">
            <Form
              form={form}
              onFinish={(value) => {
                setLoadingPage(true)
                if (actionId == null) {
                  createBill(value)
                } else {
                  updateBill(value)
                }

              }}
            >
              <Form.Item
                label="เลขห้อง"
                name="room_id"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณาเลือกห้อง',
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="เลขห้อง"
                  options={dropdownRoomByStatus}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                // onChange={handleChange}
                >
                </Select>
              </Form.Item>
              {/* <Form.Item label="ตึก" name="building_name" labelCol={{ span: 6 }}>
            <Select
              showSearch
              style={{ width: '100%', paddingRight: 5 }}
              placeholder="ตึก"
              options={dropdownBuilding}
            >
            </Select>
          </Form.Item> */}
              <Form.Item 
                label="ค่าไฟประจำเดือน" 
                name="electicity_date" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณาเลือกค่าไฟประจำเดือน',
                  },
                ]}
                >
                <DatePicker
                  style={{ width: '100%' }}
                  picker="month"
                />
              </Form.Item>
              <Form.Item 
                label="ใช้น้ำตั้งแต่" 
                name="water_start_unit" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกหน่วยที่ใช้น้ำ',
                  },
                ]}
                >
                
                <InputNumber onChange={(value) => {
                  setWaterStartUnit(value)
                  calculateWater(value,water_end_unit)
                }} style={{ width: '100%' }} placeholder='หน่วยที่ใช้น้ำเริ่มต้น' />
              </Form.Item>
              <Form.Item 
                label="ใช้น้ำจนถึง" 
                name="water_end_unit" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกหน่วยที่ใช้น้ำ',
                  },
                ]}
                >
                <InputNumber onChange={(value) => {
                  setWaterEndUnit(value)
                  calculateWater(water_start_unit,value)
                }} style={{ width: '100%' }} placeholder='หน่วยที่ใช้น้ำล่าสุด' />
              </Form.Item>
              <Form.Item 
                label="ค่าน้ำ" 
                name="water_amount" 
                labelCol={{ span: 6 }}
              >
                <InputNumber disabled={true} style={{ width: '100%' }} placeholder='ค่าน้ำ' />
              </Form.Item>
              <Form.Item 
                label="ใช้ไฟฟ้าตั้งแต่" 
                name="electricity_start_unit" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกหน่วยที่ใช้น้ำ',
                  },
                ]}
                >
                
                <InputNumber onChange={(value) => {
                  setElectricityStartUnit(value)
                  calculateElectricity(value,electricity_end_unit)
                }} style={{ width: '100%' }} placeholder='หน่วยที่ใช้ไฟฟ้าเริ่มต้น' />
              </Form.Item>
              <Form.Item 
                label="ใช้ไฟฟ้าจนถึง" 
                name="electricity_end_unit" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกหน่วยที่ใช้น้ำ',
                  },
                ]}
                >
                <InputNumber onChange={(value) => {
                  setElectricityEndUnit(value)
                  calculateElectricity(electricity_start_unit,value)
                }} style={{ width: '100%' }} placeholder='หน่วยที่ใช้ไฟฟ้าล่าสุด' />
              </Form.Item>
              <Form.Item 
                label="ค่าไฟฟ้า" 
                name="electricity_amount" 
                labelCol={{ span: 6 }}
              >
                <InputNumber disabled={true} style={{ width: '100%' }} placeholder='ค่าไฟฟ้า' />
              </Form.Item>
              <Form.Item 
                label="ค่าเก็บขยะ" 
                name="trash_amount" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกค่าเก็บขยะ',
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} placeholder='ค่าเก็บขยะ' />
              </Form.Item>
              <Form.Item 
                label="ส่วนลด" 
                name="discount" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกส่วนลด',
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} placeholder='ส่วนลด' />
              </Form.Item>
              <Form.Item 
                label="ค่าบริการเพิ่มเติม" 
                name="add_amount" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกค่าบริการเพิ่มเติม',
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} placeholder='ค่าบริการเพิ่มเติม' />
              </Form.Item>
              <Form.Item
                style={{display:'none'}} 
                label="outstanding_balance" 
                name="outstanding_balance" 
                labelCol={{ span: 6 }}
              >
                <InputNumber style={{ width: '100%' }} placeholder='outstanding_balance' />
              </Form.Item>
              {/* <Form.Item label="รวมเงินค่าไฟฟ้า" name="electicity_date" labelCol={{ span: 6 }}>
            <InputNumber style={{ width: '100%' }} placeholder='รวมเงินค่าไฟฟ้า' />
          </Form.Item> */}
            </Form>
          </Spin>
        </Modal>
      </Spin>
    </Styled>
  )
}
