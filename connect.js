import React, { useEffect, useState } from 'react'
import { Link,useNavigate  } from 'react-router-dom';

import { Button, Space, Input,List } from 'antd';
import { Orbis } from "@orbisclub/orbis-sdk"
import { shortAddress } from './utils/index';
let orbis = new Orbis();

export default function Connect() {
  let navigate = useNavigate()
  
  async function connect() {
    let res = await orbis.connect();
    /** Check if connection is successful or not */
    if(res.status === 200) {
            console.log("连接成功")
            navigate("/")
            console.log(res)
            let add=res.did.slice(17,59)
            console.log(add)
            let add_=shortAddress(add)
          // setAddress(add_)
   } else {
      console.log("Error connecting to Ceramic: ", res);
    }
    }
        return (
                <div className='connecthome' style={{height:"100%",display:"flex",justifyContent:"center",alignItems:"center",background:"rgba(99, 99, 99, 0.8)"}} >
                  <div style={{width:"700px",textAlign:"left"}}>
                    <span style={{fontSize:"20px",color:"#7bdcb5",fontFamily:"FOFER",fontWeight:"lighter"}}> To Learn, To Live, To Love, To Build </span>
                    <br></br>
                    <br></br>

                    <span style={{fontSize:"20px",color:"#7bdcb5",fontWeight:"lighter"}}>Foster Your Points</span>
                    <br></br>
                    <br></br>

                    <span style={{fontSize:"20px",color:"#7bdcb5",fontWeight:"lighter"}}>On Everything, In Everywhere. And</span>
                    <br></br>
                    <br></br>
                    <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
                      <div>
                        <span style={{fontSize:"30px",fontWeight:"bold",color:"white",background:"#7bdcb5",padding:"10px"}}>Record Your Points In Life Forever!</span>
                        </div>
                      <div style={{marginLeft:"20PX",height:"60px",border:"1px solid red",width:"120px",lineHeight:"60px",textAlign:"center",border:"1px solid #7bdcb5",}}>
                          <Space wrap >
                              <a type="text" onClick={connect} style={{fontSize:"19px",fontWeight:"bold",color:"#7bdcb5",padding:"5px"}}>CONNECT</a>
                          </Space>
                      </div>
                    </div>
                  </div>

                </div>  
        )

}

