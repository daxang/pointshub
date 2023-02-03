import React, { useEffect, useState,useContext  } from 'react'
import{Userinfo}from "../AppRouter"
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Input,List } from 'antd';
import { Orbis } from "@orbisclub/orbis-sdk"
import { shortAddress } from './utils/index';
let orbis = new Orbis();

export default function Points() {
    const[points,setPoints]=useState()
    const userinfos=useContext(Userinfo)
    const mypoints=[]
    const [allmyoints,setAllmypoints]=useState()
    async function getPoints(){
        let { data, error } = await orbis.getPosts({context:"kjzl6cwe1jw147bbp70af3uis3xpoz9j0h4ovcx3vwi2ewr5pxzcrlllyjm6f5k"});
        if(data){
            console.log(data)
            
            for(var i=0;i<data.length;i++){
                var oneitem=data[i]
                if(oneitem.content.tags){
                    console.log("here")
                    if(oneitem.content.tags[0]=="dappofpoints" &&oneitem.creator_details.did==userinfos.userid){
                    console.log("there")
                        mypoints.push(oneitem)
                    } 
                }
               
            }
            console.log(mypoints)
            console.log("hi")
            setAllmypoints(mypoints)
        }
    }
    useEffect(() => {
        getPoints()
        console.log(userinfos)
      }, []
      )

        return (
                <div className='connecthome' style={{width:"100%",height:"100%",margin:"0 auto"}} >
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={allmyoints}
                        renderItem={item => (
                            <List.Item >
                                <div className="content-list">
                                     <div className="source">
                                            {item}
                                    </div>
                                   
                                </div>
                            </List.Item>
                        )}
                    />
               
                </div>  


        )

}

