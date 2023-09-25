import { useState } from 'react'
import { useAsync } from 'react-use'
import _ from 'lodash'
import Styled from './styled'
import 'antd/dist/antd.css';
import './styled.css'
import moment from 'moment'
import {
  Spin,
  Card,
  Typography,
  Input,
  Form,
  Row,
  Col,
  Image,
  Button,
  Space,
  Tooltip,
  Modal,
  Select,
  Upload,
  Table,
  DatePicker
} from 'antd'
import {
  SwapOutlined,
  FileExcelOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  getDropdownRoomApi,
  getDropdownBuildingApi,
  getDropdownRoomTypeApi,
} from '../../services/filter'
import {
  getLeaveOrChangeRoomApi,
  updateCancelReservRoomApi,
  updateLeaveRoomApi,
  updateChangeRoomApi
} from '../../services/reserving';
const { Title, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;
const { TextArea } = Input;

export default function PageReservRoom() {

  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [actionId, setActionId] = useState(null)
  const [actionName, setActionName] = useState(null)
  const [form] = Form.useForm()
  const [loadingPage, setLoadingPage] = useState(true)

  const [filters, setFilters] = useState({
    page: 1,
    size: 10
  })

  const [filtersSearch, setFiltersSearch] = useState({

  })

  const [nameOfButtonSubmit, setNameOfButtonSubmit] = useState('Submit')

  const [dropdownRoomNo, setDropdownRoomNo] = useState([])
  const [dropdownRoomNoNotUsed, setDropdownRoomNoNotUsed] = useState([])
  const [dropdownBuilding, setDropdownBuilding] = useState([])
  const [dropdownRoomType, setDropdownRoomType] = useState([])

  const [disabledRoomChange, setDisabledRoomChange] = useState(true)
  const [disabledRequestDate, setDisabledRequestDate] = useState(true)

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
      title: 'ประเภทห้อง',
      dataIndex: 'room_type',
      key: 'room_type',
      width: 100,
    },
    {
      title: 'ผู้เช่า',
      dataIndex: 'user_full_name',
      key: 'user_full_name',
      width: 100,
    },
    {
      title: 'ราคา',
      dataIndex: 'rental_balance',
      key: 'rental_balance',
      width: 100,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: '5%',
      render: (text, record) => {
        return (
          <Space size="small">
            <Tooltip title={'ย้ายออก'}>
              <Button
                type="link"
                disabled={record.room_status == 'สำเร็จ' ? false : true}
                icon={<ExportOutlined />}
                onClick={() => {
                  setDisabledRoomChange(true)
                  setDisabledRequestDate(false)
                  form.setFieldsValue({
                    room_no: record.room_no,
                    building_name: record.building_name,
                    room_type: record.room_type,
                    room_detail: record.room_detail,
                    deposit_amount: record.deposit_amount,
                    rental_balance: record.rental_balance
                  })
                  setActionId(record.room_id)
                  setNameOfButtonSubmit('ย้ายออก')
                  setActionName('leave')
                  showModal2()
                }}
              />
            </Tooltip>
            <Tooltip title={'ย้ายห้อง'}>
              <Button
                type="link"
                disabled={record.room_status == 'สำเร็จ' ? false : true}
                icon={<SwapOutlined />}
                onClick={() => {
                  setDisabledRoomChange(false)
                  setDisabledRequestDate(false)
                  form.setFieldsValue({
                    room_no: record.room_no,
                    building_name: record.building_name,
                    room_type: record.room_type,
                    room_detail: record.room_detail,
                    deposit_amount: record.deposit_amount,
                    rental_balance: record.rental_balance,
                    change_room_id: ''
                  })
                  setActionId(record.room_id)
                  setNameOfButtonSubmit('ย้ายห้อง')
                  setActionName('change')
                  showModal2()
                }}
              />
            </Tooltip>
            <Tooltip title={'ยกเลิกการจอง'}>
              <Button
                type="link"
                disabled={record.room_status == 'จอง' ? false : true}
                icon={<FileExcelOutlined />}
                onClick={() => {
                  setDisabledRoomChange(true)
                  setDisabledRequestDate(true)
                  form.setFieldsValue({
                    room_no: record.room_no,
                    building_name: record.building_name,
                    room_type: record.room_type,
                    room_detail: record.room_detail,
                    deposit_amount: record.deposit_amount,
                    rental_balance: record.rental_balance,
                    change_room_id: ''
                  })
                  setActionId(record.room_id)
                  setNameOfButtonSubmit('ยกเลิกการจอง')
                  setActionName('cancel')
                  showModal2()
                }}
              />
            </Tooltip>
          </Space>
        )
      },
    }
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [contentViewModel, setContentViewModel] = useState('');
  const showModal = () => {
    setIsModalVisible(true);
  };

  const [isModal2Visible, setIsModal2Visible] = useState(false);
  const [isModal3Visible, setIsModal3Visible] = useState(false);

  const showModal2 = () => {
    setIsModal2Visible(true);
    setContentViewModel(
      // <div style={{ 'text-align': 'center', paddingBottom: 5 }}>
      //   <Image
      //     width={200}
      //     className="center-img"
      //     src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      //   />
      // </div>

    )
  };

  const handleCancel2 = () => {
    setIsModal2Visible(false);
  }


  const _list = async () => {
    setLoadingPage(true)
    let data = await getLeaveOrChangeRoomApi({ ...filters, ...filtersSearch })

    setTotal(data.total)
    setData(data)
    setLoadingPage(false)
  }

  const getDropdown = async () => {
    setLoadingPage(true)
    let dataRoom = await getDropdownRoomApi()

    let dataBuilding = await getDropdownBuildingApi()

    let dataRoomType = await getDropdownRoomTypeApi()

    let tempData = []
    let tempData2 = []
    dataRoom.data.map((item) => {
      tempData.push({
        label: `${item?.room_no} ตึก ${item?.building_name}`,
        value: item?.room_id,
      })

      if (item.room_status == 'ว่าง') {
        tempData2.push({
          label: `${item?.room_no} ตึก ${item?.building_name}`,
          value: item?.room_id,
        })
      }
    })

    setDropdownRoomNo(tempData)
    setDropdownRoomNoNotUsed(tempData2)

    tempData = []
    dataBuilding.data.map((item) => {
      tempData.push({
        label: item?.building_name,
        value: item?.building_name,
      })
    })

    setDropdownBuilding(tempData)

    tempData = []
    dataRoomType.data.map((item) => {
      tempData.push({
        label: item?.room_type,
        value: item?.room_type,
      })
    })

    setDropdownRoomType(tempData)

    setLoadingPage(false)
  }

  useAsync(async () => {
    // setLoadingPage(true)
    await _list({ ...filters, ...filtersSearch, page: 1 })
    await getDropdown()
    // setLoadingPage(false)
  }, [filters])

  return (
    <Styled className='page page-room'>
      <Spin spinning={loadingPage} tip="Loading...">
        <Card>
          <Title level={4}>Leave/Change Room</Title>
          <Form
            layout="horizontal"
          // onValuesChange={onFormLayoutChange}
          >
            <Row>
              <Col xs={24} lg={6} style={{ paddingRight: 10 }}>
                <Form.Item
                  label="ชื่อห้อง"
                  name="room_id">
                  <Select
                    showSearch
                    mode='multiple'
                    placeholder="Room"
                    // optionFilterProp="children"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        room_id: value
                      })
                    }}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={dropdownRoomNo}
                  >
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6} style={{ paddingRight: 10 }}>
                <Form.Item
                  label="ตึก"
                  name="building">
                  <Select
                    showSearch
                    mode='multiple'
                    placeholder="Building"
                    // optionFilterProp="children"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        building_name: value
                      })
                    }}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={dropdownBuilding}
                  >
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6} style={{ paddingRight: 10 }}>
                <Form.Item
                  label="ประเภทห้อง"
                  name="room_type">
                  <Select
                    showSearch
                    mode='multiple'
                    placeholder="Room Type"
                    // optionFilterProp="children"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        room_type: value
                      })
                    }}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={dropdownRoomType}
                  >
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Button
                  icon={<SearchOutlined />}
                  type="primary"
                  htmlType="submit"
                  style={{ float: 'right' }}
                  onClick={async () => {
                    await _list()
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
            <Button
              icon={<InfoCircleOutlined />}
              type='primary'
              onClick={() => { setIsModal3Visible(true) }}>
              รายอะเอียดสัญญา
            </Button>
          </Space>
          <Card>
            <Table
              columns={columns}
              dataSource={data?.items}
              scroll={{ x: 500 }}
              pagination={{
                current: filters.page,
                pageSize: filters.size,
                total,
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
          </Card>
        </Card>
        <Modal
          visible={isModal2Visible}
          title="Room Detail"
          onCancel={handleCancel2}
          footer={[
            <Button key="back" onClick={handleCancel2}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={async () => {
                form.submit()
              }}
            >
              {nameOfButtonSubmit}
            </Button>,
            // <Button key="submit" type="primary">
            //   ย้ายออก
            // </Button>,
          ]
          }
        >
          <Spin spinning={loadingPage} tip="Loading...">
            {contentViewModel}
            <Form
              form={form}
              onFinish={async (value) => {
                setLoadingPage(true)
                if (actionName == 'leave') {
                  await updateLeaveRoomApi({...value,leave_date: value.request_date}, actionId)
                } else if (actionName == 'change') {
                  await updateChangeRoomApi({...value, reserv_stay_in_date: value.request_date }, actionId)
                } else if (actionName == 'cancel') {
                  await updateCancelReservRoomApi(actionId)
                }
                handleCancel2()
                await _list()
              }}
            >
              <Form.Item
                label="ชื่อห้อง"
                name="room_name"
                labelCol={{ span: 6 }}>
                <Input disabled={true} placeholder="ชื่อห้อง" />
              </Form.Item>
              <Form.Item
                label="ประเภทห้อง"
                name="room_type"
                labelCol={{ span: 6 }}>
                <Input disabled={true} placeholder="ประเภทห้อง" />
              </Form.Item>
              {/* <Form.Item label="ชื่อคนเช่า" name="user_name" labelCol={{ span: 6 }}>
                <Select
                  mode="multiple"
                  style={{ width: '100%', paddingRight: 5 }}
                  placeholder="ชื่อคนเช่า"
                  disabled={true}
                >
                  <Option key={1}>ชื่อ นามสกุล</Option>
                  <Option key={2}>ชื่อ นามสกุล</Option>
                  <Option key={3}>ชื่อ นามสกุล</Option>
                </Select>
              </Form.Item> */}

              <Form.Item label="ห้องที่ต้องการย้าย" name="change_room_id" labelCol={{ span: 6 }}
              rules={[
                {
                  required: disabledRoomChange == true?false:true,
                  message: 'กรุณาเลือกวันที่เข้าอยู่',
                },
              ]}
              >
                <Select
                  disabled={disabledRoomChange}
                  showSearch
                  placeholder="Room"
                  optionFilterProp="children"
                  id='room_change_select'
                  // onChange={onChange}
                  // onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  options={dropdownRoomNoNotUsed}
                >
                </Select>
              </Form.Item>
              <Form.Item label="วันที่ที่ต้องการย้าย" name="request_date" labelCol={{ span: 6 }}
                rules={[
                  {
                    required: disabledRequestDate == true? false:true,
                    message: 'กรุณาเลือกวันที่เข้าอยู่',
                  },
                ]}>
                <DatePicker
                  style={{ width: '100%', paddingRight: 5 }}
                  placeholder="วันที่ที่ต้องการย้าย"
                  disabled={disabledRequestDate}
                  disabledDate={(current) => {
                    return moment().add(-1, 'days') >= current;
                  }}
                // onChange={ async (value)=>{
                //   setActionId(value)
                // }}
                >
                </DatePicker>
              </Form.Item>
            </Form>
          </Spin>
        </Modal >
        <Modal title="รายละเอียดสัญญา" visible={isModal3Visible} onOk={() => { }} onCancel={() => setIsModal3Visible(false)}>
          <div>
            <p><b>การย้ายห้อง</b></p>
            <p>สามารถย้ายห้องได้ ต้องทำเรื่องก่อนการวางบิล 7 วัน</p>
            <p><b>การย้ายออก</b></p>
            <p>สามารถย้ายออกได้ตอนสิ้นเดือน</p>
            <p><b>การยกเลิก</b></p>
            <p>คุณจะเสียเงินค่ามัดจำ</p>
          </div>
        </Modal>
      </Spin>
    </Styled >
  )
}
