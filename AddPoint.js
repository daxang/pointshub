import React, { useState,useEffect } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { Orbis } from "@orbisclub/orbis-sdk"
import { convertLegacyProps } from 'antd/es/button/button';
import WriteModal from './WriteModal';

let orbis = new Orbis();
const { TextArea } = Input;
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
const AddPoint = () => {
        const[user,setUser]=useState()
  const[value,setValue]=useState()
  const onFinish = (values) => {
    console.log('Received values of form:', values);
    setValue(values)
    createaPost()
  };
  async function getUserData(){
        let res = await orbis.isConnected()
        setUser(res.did)
    }
    useEffect(()=>{
          getUserData()
      },[])
  async function createaPost(){
    let res = await orbis.createPost(
      {body: "points",
       context:"kjzl6cwe1jw147bbp70af3uis3xpoz9j0h4ovcx3vwi2ewr5pxzcrlllyjm6f5k",
       tags:["dappofpoints"],
      data:value });
    if(res.status==200){
      console.log(res)
    }else{
      console.log(res)
    }
  }
  return (
    <div> 
        <WriteModal></WriteModal>
        </div>
   
  );
};
export default AddPoint;