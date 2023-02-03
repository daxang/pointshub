import React, { useEffect, useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button, Space, List, Row, Col, Input, Modal, Form, Tooltip, Divider, Select, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined, ExportOutlined } from '@ant-design/icons';

import { Orbis } from "@orbisclub/orbis-sdk"
import "../App.css"
import { shortAddress } from './utils/index';
import moment from "moment"
let orbis = new Orbis();

export const Userinfo = createContext()
export const Userinfos = () => useContext(Userinfo)
const { TextArea } = Input;
const { Option } = Select;
export const Newpoint = createContext()
export const Anewpoint = () => useContext(Newpoint)

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 18,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 0,
    },
  },
};

export default function AppRouter() {
  let navigate = useNavigate()
  const [alluserinfos, setAlluserinfos] = useState({})
  const [userinfos, setUserinfos] = useState({})
  const [showusername, setShowusername] = useState()
  const [havepass, setHavepass] = useState(false)
  const [passinfos, setPassinfos] = useState({})
  const [form] = Form.useForm();
  const mypoints = []
  const addedpoints=[]
  const [allmypoints, setAllmypoints] = useState()
  const [anewpoint, setAnewpoint] = useState({})
  const [state, setState] = useState()
  const [gateout, setGateout] = useState(false)

  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [changepassloading, setChangepassloading] = useState(false)
  const [recordloading, setRecordloading] = useState(false)
  const [open, setOpen] = useState(false);
  const [editpassopen, setEditpassopen] = useState(false)
  const [changepassopen, setChangepassopen] = useState(false)
  const [passprotocol, setPassprotocol] = useState()
  const onFinish = (values) => {
    console.log('Received values of form:', values);
    console.log(values)
    createaPost(values)
  };
  const showModal = () => {
    let newpoint = document.getElementById("newpoint").value
    console.log(newpoint)
    setAnewpoint(newpoint)
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const cancelchangepass = () => {
    setEditpassopen(false)
  }
  const CancelEdit = () => {
    setEditProfileModalOpen(false);
  };

  async function getUserData() {
    let res = await orbis.isConnected()
    if (res.status === 200) {
      console.log(res)
      console.log("连接成功")
      let add = res.did.slice(17, 59)
      console.log(add)
      let add_ = shortAddress(add)
      setAlluserinfos(res.details)
      if (res.details.profile) {
        setUserinfos({ username: res.details.profile.username, userid: res.did, userens: res.details.metadata.ensName, userdes: res.details.profile.description, useradd: add, usershortadd: add_ })
        setShowusername(true)
        if (res.details.profile.data) {
          setHavepass(true)
          setPassinfos(res.details.profile.data.contentpass)
        }

      }
      else {
        setUserinfos({ userid: res.did, userens: res.details.metadata.ensName, useradd: add, usershortadd: add_ })
        setShowusername(false)
      }
      getPoints(res.did)
      setGateout(true)

    } else {
      navigate("/connect")
      console.log("Error connecting to Ceramic: ", res);
      setUserinfos(false)
    }


  }
  useEffect(() => {
    getUserData()
  }, []
  )

  useEffect(() => {
    function rightCartData() {
      const item = JSON.parse(localStorage.getItem('ceramic-session'))
      if (item) {
        setState(item);
      }
    }
    window.addEventListener('storage', rightCartData)

    return () => {
      window.removeEventListener('storage', rightCartData)
    }
  }, [])

  async function getPoints(iden) {
    let { data, error } = await orbis.getPosts({ context: "kjzl6cwe1jw147bbp70af3uis3xpoz9j0h4ovcx3vwi2ewr5pxzcrlllyjm6f5k", tag: "dappofpoints" });
    if (data) {
      console.log(data)
      for (var i = 0; i < data.length; i++) {
        var oneitem = data[i]
        console.log(oneitem)
        if (oneitem.creator_details.did == iden) {


          //list.push({creat_date:data[i].timestamp,threads:[{0:data[i].content.body}]})
          var time = data[i].timestamp
          var time01 = moment(time * 1000).format('YYYY/MM/DD HH:mm:ss')
          if (oneitem.content.data) {
            var pointslist = oneitem.content.data.points
            if (pointslist) {
              console.log(oneitem.content.body)
              console.log(pointslist)
              pointslist.unshift(oneitem.content.body)

              mypoints.push({ date: time01, threads: pointslist, many: true })
            }
          } else {
            mypoints.push({ date: time01, threads: [oneitem.content.body], many: false })
          }
        }
      }
      console.log(mypoints)
      if (mypoints.length > data.length) {
        setAllmypoints(mypoints.slice(0, mypoints.length / 2))
      } else {
        setAllmypoints(mypoints)
      }
      console.log("i am mypoints")
    }
  }
  async function leave() {
    let res = await orbis.logout()
    setShowusername(false)
    console.log(res)
    if (res.status == 200) {
      navigate("/connect")
    }
    getUserData()
  }
async function addanewpoint(id){
  console.log("start to add")
  let { data, error } = await orbis.getPost(id)
  if(data){
    console.log(data)
    var time = data.timestamp
     var time01 = moment(time * 1000).format('YYYY/MM/DD HH:mm:ss')
     console.log(data.content.data)
      if (data.content.data) {
        var pointslist=data.content.data.points
        console.log(data.content.body)
        console.log(pointslist)
        pointslist.unshift(data.content.body)
        allmypoints.unshift({ date: time01, threads: pointslist, many: true })
      }
     else {
      console.log(mypoints)
      console.log("hi")
      allmypoints.unshift({ date: time01, threads: [data.content.body], many: false })
      console.log({ date: time01, threads: [data.content.body], many: false })
    }
  }else{
    console.log(error)
  }
  console.log(allmypoints)

}

  async function postapoint() {
    let newpoint = document.getElementById("newpoint").value
    console.log(newpoint)
    if (newpoint) {
      setRecordloading(true)
      let res = await orbis.createPost({
        body: newpoint,
        context: "kjzl6cwe1jw147bbp70af3uis3xpoz9j0h4ovcx3vwi2ewr5pxzcrlllyjm6f5k",
        tags: [{ slug: "dappofpoints", title: "dappofpoints" }],
      })
      if (res.status == 200) {
        setRecordloading(false)
        console.log(res.doc)
        console.log("getpoints again")
        addanewpoint(res.doc)
      } else {
        console.log("error")
        console.log(res)
        setRecordloading(false)
      }
    }
  }
  async function editprofileopen() {
    setEditProfileModalOpen(true)
  }
  async function editProfile() {
    var username = document.getElementById("username").value
    var personaldes = document.getElementById("personaldes").value
    if (username) {
      setLoading(true)
      console.log(username)
      if(havepass){
        console.log(passinfos)
        let res = await orbis.updateProfile({
          username: username,
          description: personaldes,
          data:{contentpass:passinfos}
        })
        if(res.status==200){
          console.log(res)
          setEditProfileModalOpen(false)
          getUserData()
        }else{
          console.log("error")
        }
      }else{
        let res = await orbis.updateProfile({
          username: username,
          description: personaldes,
          data:passinfos
        })
        if(res.status==200){
          console.log(res)
          setEditProfileModalOpen(false)
          getUserData()
        }else{
          console.log("error")
        }

      }
    
      }
    }

  const onFinishAddPass = (values) => {
    console.log(values)
    changepass(values)
  }
  async function changepass(values) {

    if (userinfos.username && userinfos.userdes) {
      let res = await orbis.updateProfile({
        username: userinfos.username,
        description: userinfos.userdes,
        data: { contentpass: values }
      })
      if (res.status = 200) {
        console.log("added a new pass")
        setEditpassopen(false)
        getUserData()
      } else {
        console.log(res)
      }
    } else if (userinfos.username && !userinfos.userdes) {
      let res = await orbis.updateProfile({
        username: userinfos.username,
        data: { contentpass: values }
      })
      if (res.status = 200) {
        console.log("added a new pass")
        setEditpassopen(false)
        getUserData()

      } else {
        console.log(res)
      }
    } else {
      let res = await orbis.updateProfile({
        data: { contentpass: values }
      })
      if (res.status = 200) {
        console.log("added a new pass")
        setEditpassopen(false)
        getUserData()
      } else {
        console.log(res)
      }
    }
  }


  async function createaPost(values) {
    let headofthread = document.getElementById("headofthread").value
    console.log(headofthread)
    if (headofthread != null) {
      setRecordloading(true)
      let res = await orbis.createPost(
        {
          body: headofthread,
          context: "kjzl6cwe1jw147bbp70af3uis3xpoz9j0h4ovcx3vwi2ewr5pxzcrlllyjm6f5k",
          tags: [{ slug: "dappofpoints", title: "dappofpoints" }],
          data: values
        });
      if (res.status == 200) {
        setRecordloading(false)
        console.log(res)
        setOpen(false)
        addanewpoint(res.doc)
      } else {
        setRecordloading(false)
        console.log(res)
      }
    }

  }
  const onChangeSwitch = (checked) => {
    console.log(`switch to ${checked}`);
  };

  return (
    <div className='home' style={{ width: "100%", paddingTop: "30PX" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
        <div style={{ width: "70%", maxWidth: "916px" }} >
          <Row style={{ paddingBottom: "30PX", borderBottom: "1px solid #E9F1F6" }}>
            <Col flex={1} style={{ height: "30px", lineHeight: "30px", textAlign: "left", fontWeight: "bold", color: "#7bdcb5" }}> <span>RECORD POINTS FOREVER!</span></Col>
            <Col flex={4} style={{ height: "30px", lineHeight: "30px", textAlign: "right" }}>

              <div>
                <a style={{ marginRight: "20px", color: "#758A99" }} onClick={editprofileopen}>{userinfos.username}</a>
                {userinfos.username ? <br></br> : ""}

                <a style={{ marginRight: "20px", color: "#758A99" }} onClick={editprofileopen}>{userinfos.usershortadd}</a>
                <a style={{ border: "none", background: "none" }} onClick={leave} >
                  {userinfos.usershortadd ? <Space style={{ color: "gray" }}><ExportOutlined /></Space>
                    : <Space><LoadingOutlined style={{ color: "green", fontSize: "14PX", marginRight: "20px" }} /></Space>
                  }

                </a></div>

              <Modal
                title="Edit Profile"
                open={editProfileModalOpen}
                onOk={editProfile}
                onCancel={CancelEdit}
                footer={[
                  <Button key="back" onClick={handleCancel}>
                    cancel
                  </Button>,
                  <Button key="submit" style={{ background: "#7bdcb5", color: "white" }} loading={loading} onClick={editProfile}>
                    Submit
                  </Button>,
                ]}
              >
                <Input placeholder='username' defaultValue={userinfos.username} style={{ marginBottom: "10px" }} id="username"></Input>
                <TextArea placeholder='personal description' defaultValue={userinfos.userdes} id="personaldes" autoSize></TextArea>
              </Modal>

            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "20%", borderRight: "1px solid #E9F1F6", marginTop: "0", paddingTop: "30px", fontSize: "16px" }}>
              <div style={{ marginBottom: "20px", }}>
                <a onClick={() => setEditpassopen(true)} style={{ color: "#758A99" }}>Content Pass</a>
                <Modal
                  centered
                  open={editpassopen}
                  onCancel={cancelchangepass}
                  width={666}
                  title="Current Content Pass:"
                  footer={null}
                >
                  {
                    havepass ? <div style={{ width: "531px", marginLeft: "47px" }}>
                      <div style={{ paddingTop: "30px" }}>
                        <p style={{ height: "45px", lineHeight: "45px", border: "1px solid #E9F1F6", borderRadius: "5px", textAlign: "center", background: "#7bdcb5" }}>
                          <span style={{ color: "gray" }}>CONTRACT:</span>
                          <a style={{ textAlign: "center", color: "white", marginLeft: "20px" }}>{passinfos.contract}</a>
                        </p>
                        <p style={{ marginTop: "45px", height: "45px", lineHeight: "45px", border: "1px solid #E9F1F6", background: "#7bdcb5 ", textAlign: "center", borderRadius: "5px" }}>
                          <span style={{ color: "gray", }}>PROTOCOL:</span>  <a style={{ marginLeft: "15px", color: "white" }}>{passinfos.protocol}</a>
                          <span style={{ marginLeft: "45px", color: "gray", }}>PASSTAG:</span><a style={{ marginLeft: "15px", color: "white" }}>{passinfos.passtag}
                          </a></p>
                      </div>

                    </div> :
                      <div style={{ width: "100%", textAlign: "center", marginTop: "30px" }}>you have no content pass!</div>
                  }


                  <div style={{ marginBottom: "50px", marginTop: "45PX", marginLeft: "47px", width: "531px" }}>
                    <div style={{ textAlign: "center" }}>
                      {changepassopen ?
                        <a onClick={() => setChangepassopen(false)} style={{ color: "red", fontWeight: "lighter", fontStyle: "italic" }}>no,dont try</a> :
                        <a onClick={() => setChangepassopen(true)} style={{ color: "#7bdcb5", fontWeight: "lighter", fontStyle: "italic" }}>try a new pass</a>}

                    </div>
                    {changepassopen ?
                      <Form
                      name="control-hooks"
                      form={form}
                      onFinish={onFinishAddPass}
                      style={{ marginTop: "30px" ,width:"100%"}}
                      >
                        <Form.Item
                          label="contract"
                          name="contract"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item label="protocol"
                        name="protocol"
                        rules={[
                            {
                              required: true,
                            },
                          ]} >
                          <Select 
                          >
                            <Option value="ERC-721">ERC-721</Option>
                            <Option value="ERC-1155">ERC-115</Option>
                            <Option value="ERC-20">ERC-20</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          label="passtag"
                          name="passtag"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          wrapperCol={{
                            offset: 8,
                            span: 16,
                          }}
                        >
                          <Button htmlType="submit" style={{ background: "#7bdcb5", color: "white" }}>
                            add this pass
                          </Button>
                        </Form.Item>
                      </Form> : ""}

                  </div>

                </Modal>
              </div>
              <div style={{ marginBottom: "20px", }}>
                <a style={{ color: "#758A99" }}>Mint Lab</a>
              </div>
              <div>
                <a style={{ color: "#758A99" }}>Points Sea</a>
              </div>
              <Divider></Divider>
              <div>
                <a style={{ color: "#758A99" }}>All The Tags</a>
              </div>
            </div>
            <div style={{ width: "80%", marginLeft: "20PX", paddingTop: "30px" }}>
              <div style={{ background: "white", borderRadius: "5px", padding: "10px", border: "1px solid #E9F1F6" }}>
                <TextArea id="newpoint" placeholder="input your point here, if it is a thread, please click the plus button below" style={{ minHeight: "100px" }} autoSize bordered={false} />
                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", verticalAlign: "middle" }}>
                  <div style={{ height: "20px", lineHeight: "20px" }}>
                    <Tooltip title="add a thread" color="#A4E2C6" >
                      <Button type="text" style={{ fontSize: "10px", border: "none", color: "#7bdcb5" }} icon={<PlusOutlined />} onClick={showModal} />
                    </Tooltip>
                    <Modal
                      open={open}
                      title=""
                      onOk={handleOk}
                      onCancel={handleCancel}
                      footer={[
                      ]}
                      style={{ width: "100%" }}
                    >
                      <TextArea id="headofthread" placeholder='add the headpoint of your new thread' autoSize bordered={false} style={{ width: "83%", minHeight: "60px", marginBottom: "20PX" }} defaultValue={anewpoint}></TextArea>
                      <Divider ></Divider>
                      <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} onFinish={onFinish} style={{ paddingTop: "20PX" }}>
                        <Form.List
                          name="points"
                          rules={[
                            {
                              validator: async (_, names) => {
                                if (!names || names.length < 1) {
                                  return null;
                                }
                              },
                            },
                          ]}
                        >
                          {(fields, { add, remove }, { errors }) => (
                            <>
                              {fields.map((field, index) => (
                                <Form.Item
                                  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}

                                  required={false}
                                  key={field.key}
                                >
                                  <Form.Item
                                    {...field}
                                    validateTrigger={['onChange', 'onBlur']}
                                    noStyle
                                  >
                                    <TextArea
                                      placeholder="add you another point here"
                                      style={{
                                        width: '100%',
                                        minHeight: "60px",
                                        marginTop: "-40PX"
                                      }}
                                      bordered={false}
                                      autoSize
                                    />
                                  </Form.Item>
                                  {fields.length > 0 ? (
                                    <MinusCircleOutlined
                                      className="dynamic-delete-button"
                                      onClick={() => remove(field.name)}
                                      style={{ marginTop: "-60px", marginLeft: "100%" }}
                                    />
                                  ) : null}
                                  <Divider></Divider>
                                </Form.Item>
                              ))}
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => add()}
                                  style={{
                                    width: '30%',
                                  }}
                                  icon={<PlusOutlined />}
                                >
                                  Add Point
                                </Button>

                                <Form.ErrorList errors={errors} />
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                        <Form.Item>
                          <Button type="primary" htmlType="submit" style={{ marginLeft: "90%", background: "#7bdcb5" }} loading={recordloading}>
                            Record
                          </Button>
                        </Form.Item>
                      </Form>
                    </Modal>
                  </div>
                  <div style={{ marginLeft: "30px", height: "30px", lineHeight: "30px" }} >
                    <Button style={{ background: "#7bdcb5", color: "white" }} shape="round" onClick={postapoint} loading={recordloading}>Record</Button>
                  </div>
                </div>
              </div>


              <div>
                <Divider></Divider>
                <div className='points'>
                  {allmypoints ?
                    <List style={{ marginLeft: "20px" }}
                      dataSource={allmypoints}
                      renderItem={(item) => (
                        <List.Item style={{ background: "white", marginBottom: "10PX", marginLeft: "-20px", borderBottom: "none", borderRadius: "5px", border: "1px solid #E9F1F6" }}>
                          {
                            item.many ?
                              <div style={{ width: "100%" }}>
                                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                                  <div>
                                    <span style={{ fontSize: "10px", fontStyle: "italic", color: "gray" }}>{item.date}</span>
                                  </div>
                                  <div>
                                    <Tooltip title="encrypt your content.building"  color="#A4E2C6">
                                      <Switch size="small" onChange={onChangeSwitch} />
                                    </Tooltip>
                                  </div>
                                </div>

                                <Divider style={{ marginTop: "3PX", marginBottom: "6px", width: "50%" }}></Divider>
                                <List
                                  dataSource={item.threads}
                                  renderItem={(one) => (
                                    <List.Item style={{ borderBottom: "none", borderLeft: "1PX SOLID lightgray" }}>
                                      <div style={{ width: "5px", height: "5px", borderRadius: "5PX", background: "darkgray", marginLeft: "-27px", marginBottom: "-12px" }}></div>
                                      {one}
                                    </List.Item>
                                  )}
                                />
                              </div>

                              :
                              <div style={{ width: "100%" }}>
                                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                                  <div>
                                    <span style={{ fontSize: "10px", fontStyle: "italic", color: "gray" }}>{item.date}</span>
                                  </div>
                                  <div>
                                  <Tooltip title="encrypt your content.building" color="#A4E2C6">
                                    <Switch size="small" onChange={onChangeSwitch} />
                                    </Tooltip>
                                  </div>
                                </div>
                                <Divider style={{ marginTop: "3PX", marginBottom: "6px", width: "50%" }}></Divider>
                                <List
                                  style={{ marginLeft: "-20px" }}
                                  dataSource={item.threads}
                                  renderItem={(one) => (
                                    <List.Item style={{ borderBottom: "none" }}>
                                      <div style={{ whiteSpace: "pre-line " }}>{one}</div>
                                      <span v-html="replaceWithBr(one)"></span>
                                    </List.Item>

                                  )}
                                />
                              </div>

                          }


                        </List.Item>

                      )}
                    /> :
                    <div>
                      <Space><LoadingOutlined style={{ color: "green", fontSize: "14PX", marginRight: "20px" }} /></Space>
                      <span style={{ fontStyle: "italic" }}>retrieving records from blockchain </span></div>}


                </div>
              </div>
            </div>
          </div>

        </div>
      </div>


    </div>
  )
}


