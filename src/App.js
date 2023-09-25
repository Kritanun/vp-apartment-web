import React from 'react';
import { useState } from 'react'
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './App.css';
import { Button, Layout, Menu, Modal, Form, Input, Spin, notification, Space, Image, Select } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  PushpinOutlined,
  WalletOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  UserOutlined,
  CrownOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Routes,
  Link,
} from "react-router-dom";
import './App.less'
import PageElectricity from './pages/electricity';
import PageElectricityOverdue from './pages/electricity_overdue';
import PageRoom from './pages/room';
import PageOtherService from './pages/other_service';
import PageNearby from './pages/nearby';
import PageUser from './pages/user';
import PageReservRoom from './pages/reserv_room';
import PageLeaveRoom from './pages/leave_room';
import PageReportRoom from './pages/report_room';
import PageHome from './pages/home';
import PageMonthlyDashboard from './pages/monthly_dashboard';
import PageFeedBack from './pages/feed_back';
import PageFeedBackAdmin from './pages/feed_back_admin';
import PageUsageRoomDashboard from './pages/usage_room_dashboard';
import { getAllRoomAvailableApi } from './services/filter'

import logo from './images/logo.png'

import { loginApi, getMeApi, logoutApi, registerApi, forgetPasswordApi } from './services/auth';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu

const getDropdown = async () => {
  // setLoadingPage(true)
  let dataRoom = await getAllRoomAvailableApi()

  // let dataBuilding = await getDropdownBuildingApi()

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

  // setDropdownRoomNo(tempData)
  return tempData

  // tempData = []
  // dataBuilding.data.map((item) => {
  //   tempData.push({
  //     label: item?.building_name,
  //     value: item?.building_name,
  //   })
  // })

  // setDropdownBuilding(tempData)
  // setLoadingPage(false)
}

class MySider extends React.Component {
  
  state = {
    collapsed: true,
    auth: null,
    visibleModelCreate: false,
    visibleModelSignUp: false,
    visibleModelForget: false,
    loadingPage: false
  };
  dropdownRoomByStatus = []

  toggle = () => {
    this.setState({
      ...this.state,
      collapsed: !this.state.collapsed,
    });
  };

  permissionMenu = () => {

    // คนเข้ามาดูปกติ
    if (JSON.parse(localStorage.getItem('auth')) == null) {
      return (
        <>
          <SubMenu key="location" title="บริการเสริม" icon={<PushpinOutlined />}>
            <Menu.Item key="location/other_service">
              <NavLink to="/location/other_service">การบริการอื่นๆ</NavLink>
            </Menu.Item>
            <Menu.Item key="location/nearby">
              <NavLink to="/location/nearby">สถานที่ใกล้เคียง</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="reserving" title="ต้องการจองห้อง" icon={<CalendarOutlined />}>
            <Menu.Item key="room">
              <NavLink to="/reserving/room">จองห้อง</NavLink>
            </Menu.Item>
          </SubMenu>
          {/* <Menu.Item key="feed_back" icon={<CommentOutlined />}>
            <NavLink to="/feed_back">แจ้งปัญหา</NavLink>
          </Menu.Item> */}
        </>
      )
    } else if (JSON.parse(localStorage.getItem('auth')).user.is_admin == 1) {
      return (
        <>
          <SubMenu key="electricity" title="ค่าเช่าห้อง" icon={<WalletOutlined />}>
            <Menu.Item key="electricity/detail">
              <NavLink to="/electricity/detail">ข้อมูลค่าน้ำ-ไฟ</NavLink>
            </Menu.Item>
            <Menu.Item key="electricity/overdue">
              <NavLink to="/electricity/overdue">ค้างชำระ</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="reserving" title="ต้องการจองห้อง" icon={<CalendarOutlined />}>
            <Menu.Item key="room">
              <NavLink to="/reserving/room">จองห้อง</NavLink>
            </Menu.Item>
            <Menu.Item key="leave">
              <NavLink to="/reserving/leave">การย้าย/ยกเลิก</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="location" title="บริการเสริม" icon={<PushpinOutlined />}>
            <Menu.Item key="location/other_service">
              <NavLink to="/location/other_service">การบริการอื่นๆ</NavLink>
            </Menu.Item>
            <Menu.Item key="location/nearby">
              <NavLink to="/location/nearby">สถานที่ใกล้เคียง</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="master" title="ห้อง" icon={<AppstoreOutlined />}>
            <Menu.Item key="master/room">
              <NavLink to="/master/room">ห้องพัก</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="user" title="ผู้ใช้" icon={<UserOutlined />}>
            <Menu.Item key="detail">
              <NavLink to="/user/detail">ข้อมูลผู้เช่า</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="staging" title="สถานะของระบบ" icon={<CrownOutlined />}>
            {/* <Menu.Item key="1">สถานะการณ์เปลื่ยนแปลงห้องพัก</Menu.Item> */}
            {/* <Menu.Item key="2">รายงานห้องที่ค้างชำระ</Menu.Item> */}
            <Menu.Item key="resering_room">
              <NavLink to="/staging/resering_room">การจอง/การย้ายออก</NavLink>
            </Menu.Item>
            <Menu.Item key="monthly_dashboard">
              <NavLink to="/staging/monthly_dashboard">รายงานยอดรายเดือน</NavLink>
            </Menu.Item>
            <Menu.Item key="usage_room_dashboard">
              <NavLink to="/staging/usage_room_dashboard">รายงานสรุปการใช้งาน</NavLink>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="feed_back" icon={<CommentOutlined />}>
            <NavLink to="/feed_back/admin">แจ้งปัญหา/สอบถามเพิ่มเติ่ม</NavLink>
          </Menu.Item>
        </>)
    } else if (JSON.parse(localStorage.getItem('auth')).user.is_admin == 0) {
      return (
        <>
          <SubMenu key="electricity" title="ค่าเช่าห้อง" icon={<WalletOutlined />}>
            <Menu.Item key="electricity/detail">
              <NavLink to="/electricity/detail">ข้อมูลค่าน้ำ-ไฟ</NavLink>
            </Menu.Item>
            <Menu.Item key="electricity/overdue">
              <NavLink to="/electricity/overdue">ค้างชำระ</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="reserving" title="ต้องการจองห้อง" icon={<CalendarOutlined />}>
            <Menu.Item key="room">
              <NavLink to="/reserving/room">จองห้อง</NavLink>
            </Menu.Item>
            <Menu.Item key="leave">
              <NavLink to="/reserving/leave">การย้าย/ยกเลิก</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="location" title="บริการเสริม" icon={<PushpinOutlined />}>
            <Menu.Item key="location/other_service">
              <NavLink to="/location/other_service">การบริการอื่นๆ</NavLink>
            </Menu.Item>
            <Menu.Item key="location/nearby">
              <NavLink to="/location/nearby">สถานที่ใกล้เคียง</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="master" title="ห้อง" icon={<AppstoreOutlined />}>
            <Menu.Item key="master/room">
              <NavLink to="/master/room">ห้องพัก</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="user" title="ผู้ใช้" icon={<UserOutlined />}>
            <Menu.Item key="detail">
              <NavLink to="/user/detail">ข้อมูลผู้เช่า</NavLink>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="feed_back" icon={<CommentOutlined />}>
            <NavLink to="/feed_back">แจ้งปัญหา/สอบถามเพิ่มเติ่ม</NavLink>
          </Menu.Item>
        </>)
    }
  }

  render() {
    return (
      <>
        <Router basename={process.env.REACT_APP_BASENAME}>
          <Layout>
            <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}>
              <div className="logo" >
                <Image src={logo} preview={false}  width={48} height={32} ></Image>
              </div>
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['/home']}
              >
                <Menu.Item key="home" icon={<HomeOutlined />}>
                  <NavLink to="/home">หน้าหลัก</NavLink>
                </Menu.Item>
                {/* Guest */}
                {
                  this.permissionMenu()
                }

              </Menu>

              <div style={{ textAlign: "center", paddingTop: "20px" }}>
                <a onClick={async () => {
                  await logoutApi({ authToken: localStorage.getItem('token') })
                  localStorage.removeItem('token')
                  localStorage.removeItem('auth')
                  this.setState({
                    ...this.state,
                    auth: null
                  })
                  // window.location.href = `${window.location.origin.toString()}${process.env.REACT_APP_BASENAME}`

                }}
                >
                  <LogoutOutlined /> Log out
                </a>
              </div>
            </Sider>
            <Layout className="site-layout">
              <Header className="site-layout-background" style={{ padding: 0, backgroundColor: '#001529'}}>
                {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: 'trigger IconT',
                  onClick: this.toggle,
                })}
                {
                  JSON.parse(localStorage.getItem('auth')) == null ?
                    // <span style={{ float: 'right', paddingRight: 10 }}>
                    <Space style={{ float: 'right', paddingRight: 20, display: 'block ruby' }} wrap>
                      <Button
                        icon={<UserAddOutlined />}
                        style={{ marginLeft: 5 }}
                        onClick={async() => {
                          if(this.formCreate){
                            this.formCreate.resetFields()
                          }
                          this.dropdownRoomByStatus = await getDropdown()
                          this.setState({
                            ...this.state,
                            visibleModelSignUp: true
                          })
                        }}
                      >
                        Sign Up
                      </Button>
                      <Button
                        type='primary'
                        icon={<LoginOutlined />}
                        style={{ marginLeft: 5 }}
                        onClick={() => {
                          if(this.formLogin){
                            this.formLogin.resetFields()
                          }
                          this.setState({
                            ...this.state,
                            visibleModelCreate: true
                          })
                        }}
                      >
                        Sign In
                      </Button>
                      {/* // </span> */}
                    </Space>
                    :
                    <div  style={{ float: 'right', paddingRight: 50, width: 200, textAlign: 'right' ,color: '#a6adb4'}}>
                      {JSON.parse(localStorage.getItem('auth')).user.user_full_name}
                    </div>
                }

              </Header>
              <Content
                className="site-layout-background"
                style={{
                  margin: '24px 16px',
                  padding: 24,
                  minHeight: 'auto',
                }}
              >
                <Routes>
                  <Route
                    exact
                    path="/"
                    element={
                      <PageHome />
                    }
                  />
                  <Route
                    exact
                    path="/home"
                    element={
                      <PageHome />
                    }
                  />
                  <Route
                    exact
                    path="/electricity/detail"
                    element={
                      <PageElectricity />
                    }
                  />
                  <Route
                    path="/electricity/overdue"
                    element={
                      <PageElectricityOverdue />
                    }
                  />
                  <Route
                    path="/master/room"
                    element={
                      <PageRoom />
                    }
                  />
                  <Route
                    path="/location/other_service"
                    element={
                      <PageOtherService />
                    }
                  />
                  <Route
                    path="/location/nearby"
                    element={
                      <PageNearby />
                    }
                  />
                  <Route
                    path="/user/detail"
                    element={
                      <PageUser />
                    }
                  />
                  <Route
                    path="/reserving/room"
                    element={
                      <PageReservRoom />
                    }
                  />
                  <Route
                    path="/reserving/leave"
                    element={
                      <PageLeaveRoom />
                    }
                  />
                  <Route
                    path="/staging/resering_room"
                    element={
                      <PageReportRoom />
                    }
                  />
                  <Route
                    path="/staging/monthly_dashboard"
                    element={
                      <PageMonthlyDashboard />
                    }
                  />
                  <Route
                    path="/feed_back"
                    element={
                      <PageFeedBack />
                    }
                  />
                  <Route
                    path="/feed_back/admin"
                    element={
                      <PageFeedBackAdmin />
                    }
                  />
                  <Route
                    path="/staging/usage_room_dashboard"
                    element={
                      <PageUsageRoomDashboard />
                    }
                  />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        </Router>
        <Modal
          title="Sign In"
          visible={this.state.visibleModelCreate}
          onOk={async () => {
            // this.form.submit()
          }}
          // confirmLoading={confirmLoading}
          onCancel={() => {
            this.setState({
              ...this.state,
              visibleModelCreate: false
            })
          }}
          footer={[]}
        >
          <Spin spinning={this.state.loadingPage} tip="Loading...">
            <Form
              ref={(form)=>this.formLogin=form}
              onFinish={async (value) => {
                this.setState({
                  ...this.state,
                  loadingPage: true
                })
                let tokenData = await loginApi(value)
                if (tokenData.token != null || tokenData.token != undefined) {
                  await localStorage.setItem('token', tokenData.token)
                  let me = await getMeApi({ authToken: tokenData.token })
                  localStorage.setItem('auth', JSON.stringify(me))
                  this.setState({
                    ...this.state,
                    auth: me.user,
                    visibleModelCreate: false,
                    loadingPage: false
                  })
                  window.location.href = `${window.location.origin.toString()}${process.env.REACT_APP_BASENAME}`
                } else {
                  notification.warn({
                    message: `แจ้งเตือน`,
                    description:
                      'บัญชี/รหัสผ่าน ไม่ถูกต้อง',
                  })
                  this.setState({
                    ...this.state,
                    loadingPage: false
                  })
                }


              }}
            >
              <Form.Item
                label="Username"
                name="username"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกชื่อผุ๋ใช้',
                  },
                ]}
              >
                <Input placeholder='ชื่อผุ๋ใช้' />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกรหัสผ่าน',
                  },
                ]}
              >
                <Input.Password placeholder='รหัสผ่าน' />
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={()=>{
                  if(this.formForget){
                    this.formForget.resetFields()
                  }
                  this.setState({
                    ...this.state,
                    loadingPage: false,
                    
                    visibleModelForget: true
                  })
                }} style={{ marginRight: 5 }}>
                  Forget password
                </Button>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </div>
            </Form>
          </Spin>
        </Modal>
        <Modal
          title="Create"
          visible={this.state.visibleModelSignUp}
          onOk={async () => {

          }}
          footer={[]}
          // confirmLoading={confirmLoading}
          onCancel={() => {
            this.setState({
              ...this.state,
              visibleModelSignUp: false
            })
          }}
        >
          <Spin spinning={this.state.loadingPage} tip="Loading...">
            <Form
              ref={(form)=>this.formCreate=form}
              onFinish={async (value) => {
                this.setState({
                  ...this.state,
                  loadingPage: true
                })
                let register = await registerApi(value)

                if( register == 400 ){
                  notification.error({
                    message: `แจ้งเตือน`,
                    description:
                      'Username เคยใช้แล้ว',
                  })
                  this.setState({
                    ...this.state,
                    loadingPage: false,
                    visibleModelSignUp: true
                  })
                }else{
                  this.setState({
                    ...this.state,
                    loadingPage: false,
                    visibleModelSignUp: false
                  })
                }
                

                
              }}
            >
              <Form.Item
                name='user_full_name'
                label="ชื่อ-นามสกุล"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกชื่อ-นามสกุล',
                  },
                ]}
              >
                <Input placeholder='ชื่อ-นามสกุล' />
              </Form.Item>
              {/* <Form.Item
                name='id_card_number'
                label="เลขบัตรประชาชน"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกเลขบัตรประชาชน',
                  },
                ]}
              >
                <Input showCount maxLength={13} placeholder='เลขบัตรประชาชน' />
              </Form.Item> */}
              <Form.Item
                name='email'
                label="E-mail"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: false,
                    type: 'email',
                    message: 'กรุณากรอก E-mail',
                  },
                ]}
              >
                <Input placeholder='E-mail' />
              </Form.Item>
              <Form.Item
                name='tel_number'
                label="เบอร์โทรติดต่อ"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกเบอร์โทรติดต่อ',
                  },
                ]}
              >
                <Input showCount maxLength={10} placeholder='เบอร์โทรติดต่อ' />
              </Form.Item>
              <Form.Item
                label="Username"
                name="username"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกชื่อผุ๋ใช้',
                  },
                ]}
              >
                <Input placeholder='ชื่อผุ๋ใช้' />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกรหัสผ่าน',
                  },
                ]}
              >
                <Input.Password placeholder='รหัสผ่าน' />
              </Form.Item>
              <Form.Item
                label="เลขห้อง"
                name="room_id"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: false,
                    message: 'กรุณาเลือกห้อง',
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="เลขห้อง"
                  options={this.dropdownRoomByStatus}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                // onChange={handleChange}
                >
                </Select>
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={()=>{
                  if(this.formForget){
                    this.formForget.resetFields()
                  }
                  this.setState({
                    ...this.state,
                    loadingPage: false,
                    
                    visibleModelForget: true
                  })
                }}
                style={{ marginRight: 5 }}>
                  Forget password
                </Button>
                <Button type="primary" htmlType="submit">
                  Sign Up
                </Button>
              </div>
            </Form>
          </Spin>
        </Modal>
        <Modal
          title="Forget password"
          visible={this.state.visibleModelForget}
          onOk={async () => {

          }}
          footer={[]}
          // confirmLoading={confirmLoading}
          onCancel={() => {
            this.setState({
              ...this.state,
              visibleModelForget: false
            })
          }}
        >
          <Spin spinning={this.state.loadingPage} tip="Loading...">
            <Form
              ref={(form)=>this.formForget=form}
              onFinish={async (value) => {
                this.setState({
                  ...this.state,
                  loadingPage: true
                })
                let forget_password = await forgetPasswordApi(value)
                
                if(forget_password.status == 200){
                  this.setState({
                    ...this.state,
                    loadingPage: false,
                    visibleModelForget: false,
                    visibleModelCreate: false,
                    visibleModelSignUp: false
                 })
                 notification.info({
                  message: `แจ้งเตือน`,
                  description:
                    'ทำการรีเซ็ตรหัสผ่านสำเร็จ',
                })
                }else{
                  notification.warn({
                    message: `แจ้งเตือน`,
                    description:
                      'ทำการรีเซ็ตรหัสผ่านไม่สำเร็จ',
                  })
                }

                if(this.state.visibleModelForget == false){
                  this.formForget.resetFields()
                }
                
              }}
            >
              <Form.Item
                label="Username"
                name="user_name"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกชื่อผุ๋ใช้',
                  },
                ]}
              >
                <Input placeholder='ชื่อผุ๋ใช้' />
              </Form.Item>
              <Form.Item
                name='tel_number'
                label="หมายเลขโทรศัพท์"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกหมายเลขโทรศัพท์',
                  },
                ]}
              >
                <Input showCount maxLength={10} placeholder='หมายเลขโทรศัพท์' />
              </Form.Item>
              <Form.Item
                label="New Password"
                name="password"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกรหัสผ่าน',
                  },
                ]}
              >
                <Input.Password placeholder='รหัสผ่าน' />
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                  Forget password
                </Button>
              </div>
            </Form>
          </Spin>
        </Modal>
      </>
    );
  }
}

function App() {

  return (
    <>
      <MySider />
    </>
  );
}


export default App;
