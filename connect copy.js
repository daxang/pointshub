import React, { useEffect, useState } from 'react'
import { Link,useNavigate  } from 'react-router-dom';

import { Button, Space, Input,List } from 'antd';
import { Orbis } from "@orbisclub/orbis-sdk"
import { shortAddress } from './utils/index';
let orbis = new Orbis();

export default function Connect() {
  let navigate = useNavigate()
  const wave=[{
    number:"1",
    content:"the site is: http://quillink.xyz. and our mail address is quillink.eth@mail3.me ;"
  },{
    number:"2",
    content:"now, some great storytellers have beeing sharing their stories in quillink, all the stories are wonderful worlds of fiery imagination;"
  },{
    number:"3",
    content:"0xlib, his novel is called 2057:united bunkers, its tag is :doomsday,network state. in 2050s, three huge bunker state try to survive by uniting together, to work with other civilizations far away and to fight against evil people like NEW USA;"
  },{
    key:"4",
    content:"fisher, his story is mythical creatures in shanhai: yayu. The monsters in myths and legends are truely exsiting in the world and hiding themselves around us , what they are doing is trying to seek an opportunity to bring harm and suffering to human beings;"
  },{
    number:"5",
    content:"Enjoy them!  and hope to read your story on day in quillink."
  }]
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
                <div className='connecthome' style={{height:"100%",display:"flex",justifyContent:"center",alignItems:"center",background:"rgba(99, 99, 99, 0.8)",fontFamily:"Cardo"}} >
                  <div style={{width:"70",textAlign:"center"}}>
                    <h2 style={{fontSize:"44px",color:"white",textAlign:"left"}}>To Learn, To Live, To Love, To Build</h2>
                    <h2 style={{fontSize:"44px",color:"white"}}>Foster Your Points</h2>
                    <h2 style={{fontSize:"44px",color:"white"}}>On Everything, In Everywhere</h2>
                    <h2 style={{fontSize:"44px",color:"white"}}>And Record Them</h2>
                    <h2 style={{fontSize:"44px",color:"white"}}>Here! Forever! For You!</h2>
                    <div style={{marginTop:"30px",marginBottom:"50px"}}>
                        <Space wrap >
                            <Button type="primary" onClick={connect}>Connect</Button>
                        </Space>
                    </div>
                    <div className='waveofsea' style={{width:"50%",margin:"0 auto",background:"white",borderRadius:"10px",padding:"10px",textAlign:"left"}}>
                        <div style={{fontWeight:"regular",color:"darkgray",marginBottom:"10PX"}}>hi，this is quillink, a web3 story dapp built for every storytellers. if you like to read or create stories, please come to quillink;</div>
                          <List
                          dataSource={wave}
                          renderItem={(item) => (
                              <List.Item style={{borderBottom:"none",borderLeft:"1PX SOLID lightgray"}}>
                                  <div style={{width:"5px",height:"5px",borderRadius:"5PX",background:"darkgray",marginLeft:"-27px",marginBottom:"-12px"}}></div>
                                  {item.content}
                                  </List.Item>
                              
                          )}
                          />

                          </div>  
                  </div>

                </div>  
        )

}

