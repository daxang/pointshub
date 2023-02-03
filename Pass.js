import React, { useEffect, useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Link,useNavigate } from "react-router-dom";
import { Button, Space, List, Row, Col, Input,Modal, Form,Select , Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined,LoadingOutlined,ExportOutlined  } from '@ant-design/icons';

import { Orbis } from "@orbisclub/orbis-sdk"
import "../App.css"
import { shortAddress } from './utils/index';
let orbis = new Orbis();

export const Userinfo = createContext()
export const Userinfos = () => useContext(Userinfo)
const { TextArea } = Input;

export const Newpoint = createContext()
export const Anewpoint = () => useContext(Newpoint)

export default function Pass() {
  let navigate = useNavigate()
  const [userinfos, setUserinfos] = useState({})
  const [showusername, setShowusername] = useState()

  async function getUserData() {
    let res = await orbis.isConnected()
    if (res.status === 200) {
      console.log("连接成功")
      console.log(res)
      let add = res.did.slice(17, 59)
      console.log(add)
      let add_ = shortAddress(add)
      // setAddress(add_)
      if (res.details.profile) {
        setUserinfos({ username: res.details.profile.username, userid: res.did, userens: res.details.metadata.ensName, userdes: res.details.profile.description, useradd: add, usershortadd: add_ })
        setShowusername(true)
      }
      else {
        setUserinfos({ userid: res.did, userens: res.details.metadata.ensName, useradd: add, usershortadd: add_ })
        setShowusername(false)
      }
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
  async function leave() {
    let res = await orbis.logout()
    setShowusername(false)
    console.log(res)
    if(res.status==200){
        navigate("/connect")
    }
    getUserData()
  }
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  async function updateUserProfile(){
    var contract= document.getElementById("passcontract").value
    var protocol = document.getElementById("passprotocol").value
    var passtag = document.getElementById("passtag").value
    console.log(contract+protocol+passtag)
    if(contract!=null && protocol!=null){
        console.log("let us rock")
        let res= await orbis.updateProfile({
            data:{passcontract:contract,passprotocol:protocol,passtag:passtag}
        })
        if(res==200){
            console.log(res)
        }else{
            console.log(res)
        }
    }else{
        console.log("something wrong")
    }
  }
  return (
          <div className='home' style={{ width: "100%",paddingTop: "30PX" }}>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}} >
              <div style={{ width:"70%",maxWidth:"916px"}} >
                <Row style={{ paddingBottom: "30PX", borderBottom: "1px solid #E9F1F6" }}>
                  <Col flex={1} style={{ height: "30px", lineHeight: "30px", textAlign: "left",fontWeight:"bold",color:"#7bdcb5" }}> <span>RECORD POINTS FOREVER!</span></Col>
                  <Col flex={4} style={{ height: "30px", lineHeight: "30px", textAlign: "right" }}>
                    {userinfos.username?
                    <div> 
                      <span style={{marginRight:"20px"}}>{userinfos.username}</span>
                      <a style={{border:"none",background:"none"}} onClick={leave} > 
                         <Space style={{color:"gray"}}><ExportOutlined /></Space>
                      </a></div>
                   :
                   <div>
                    <span>{userinfos.usershortadd}
                    </span> 
                    <button style={{border:"none",color:"gray"}} onClick={leave} >
                       <Space><ExportOutlined /></Space>
                       </button>
                       </div>}
                   
                    </Col>
                </Row>

                <Row style={{ justifyContent: "space-between" }}>
                  <Col flex={1} style={{ borderRight: "1px solid #E9F1F6", marginTop: "0", paddingTop: "30px" }}>
                    <div style={{ marginBottom: "20px", }}>
                      <a>CONTENT PASS</a>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <a>THREADS SEA</a>
                    </div>
                    <div>
                      <a>YOUR TAGS</a>
                    </div>
                  </Col>
                  <Col flex={4} style={{marginLeft: "20PX", paddingTop: "30px" }}>
                    <div style={{background:"white",borderRadius:"5px",padding:"10px",border:"1px solid #E9F1F6"}}>
                        <h3>YOUR CONTENT PASS</h3>
                        <Divider></Divider>
                        <span style={{marginTop:"-20px"}}>set a content pass for your contents, it is good for privacy</span>

                        <div>
                            <span>current content pass :</span>
                            <p>
                                <a>0xf75fd01d2262b07d92dca7f19bd6a3457060d7db</a>
                                <br></br>
                                <a>Mimic Shhans</a>
                                <br></br>
                                <a>ERC-721
                                 </a>
                            </p>
                            <div>
                                <a>change</a>
                            </div>

                        </div>
                        <div>
                            <div>
                                <a>contract:</a>
                                <Input
                                 id="passcontract"></Input>
                            </div>
                           
                            <div>
                                <a>protocol:</a>
                                <Select
                                id="passprotocol"
                                    showSearch
                                    placeholder="Select a protocol"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={[
                                    {
                                        value: 'ERC721',
                                        label: 'ERC-721',
                                    },
                                    {
                                        value: 'ERC1155',
                                        label: 'ERC-1155',
                                    },
                                    {value: 'ERC20',
                                    label: 'ERC-20',
                                    },
                                    ]}
                                >
                                 </Select>
                            </div>
                                
                            <div>
                                <a>pass tag:</a>
                                <Input id="passtag">
                                 </Input>
                            </div>
                            <a onClick={updateUserProfile}>shengcheng</a>
                                
                        </div>
                    </div>
                  

                    <div>
                 
                    </div>
                  </Col>
                </Row>

              </div>
            </div>


          </div>
  )
}


