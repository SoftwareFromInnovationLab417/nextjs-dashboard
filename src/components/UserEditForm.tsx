import { API } from "@models/api";
import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, useContext, useState } from "react";
import { Alert, Button, Col, FloatingLabel, Form, Row, Image } from "react-bootstrap";
import axiosInstance, { redirectAuth } from "src/axiosInstance";
import { GlobalContext } from "src/globalData";
import { User } from "@models/user";

interface DynamicalData { }

function addField<
  T extends Object,
  K extends string,
  V
>(obj: T, key: K, value: V): T & Record<K, V> {
  return {
    ...obj,
    [key]: value
  } as T & Record<K, V>;
}

interface EDProp {
  title: string;
  context: any;
  disabled?: boolean;
  image?: boolean;
  setContext?: (arg0: string) => void;
}

interface EditProps {
  data: User;
}

function EditForm({ data }: EditProps) {
  const router = useRouter()
  // edit object
  const [detail, setDetail] = useState(data);
  // edit success window
  const [editSuc, setEditSuc] = useState(false);
  // server token
  const { globalData, setGlobalData } = useContext(GlobalContext)

  // dynamically set object fields
  let submitObj: DynamicalData = {}

  // timeout show edit success window
  const setShow = () => {
    setEditSuc(true)
    setTimeout(() => {
      setEditSuc(false)
    }, 2000)
  }

  // submit the picture url from cdn response
  const submitChange = async () => {
    const url = '/managerInfo/update'
    const res: API = await axiosInstance.post(url,
      addField(submitObj, 'userId', detail.userId), {
      headers: {
        Authorization: globalData.token,
        'Content-Type': 'application/json',
      }
    })

    const { code, msg, data } = res
    redirectAuth(code, router)
    if (code === 200) {
      setShow()
    }
  }

  return (
    <div>
      <ED title='用户管理' context={null} />
      <ED title='昵称' context={detail.nickName} setContext={
        (arg) => {
          let t_d = detail
          t_d.nickName = arg
          submitObj = addField(submitObj, 'nickName', arg)
          setDetail(t_d)
        }} />
      <ED title='账号' context={detail.account} setContext={
        (arg) => {
          let t_d = detail
          t_d.account = arg
          submitObj = addField(submitObj, 'account', arg)
          setDetail(t_d)
        }} />
      <ED title='密码' context={'安全原因无法显示'} setContext={
        (arg) => {
          let t_d = detail
          t_d.password = arg
          submitObj = addField(submitObj, 'password', arg)
          setDetail(t_d)
        }} />
      <ED title='身份' context={detail.status} setContext={
        (arg) => {
          let t_d = detail
          t_d.status = arg
          submitObj = addField(submitObj, 'status', arg)
          setDetail(t_d)
        }} />
      <ED title='姓名' context={detail.name} setContext={
        (arg) => {
          let t_d = detail
          t_d.name = arg
          submitObj = addField(submitObj, 'status', arg)
          setDetail(t_d)
        }} />
      <Row>
        <Col>
          <Button variant="primary" onClick={submitChange}>修改完毕</Button>
        </Col>
        <Col>
          {
            editSuc &&
            <Button variant="outline-success" disabled>修改成功</Button>
          }
        </Col>
      </Row>
    </div>
  );
}



function getFileExtensionFromUrl(url: string): string {
  return url.split('.').pop() || '';
}


async function onUpload(upload_file: File, g_token: string): Promise<string> {
  const file_ext = getFileExtensionFromUrl(upload_file.name);
  if (!file_ext) return ''
  // request token
  const url = `/file/upload/token?type=${file_ext}`
  const res = await axiosInstance.get(url, {
    headers: {
      Authorization: g_token
    }
  })
  const token = res.data.token
  const CDNAddress = res.data.cdnaddress

  console.log(token)
  console.log(CDNAddress)

  const data = new FormData()
  data.append('token', token)
  data.append('file', upload_file, upload_file.name)
  const ures = await axios.post('http://up-z2.qiniup.com', data)
  const key = ures.data.key
  console.log(CDNAddress + key)

  const upload_url = '/file/cache/url'
  const res3 = await axiosInstance.get(`${upload_url}?filename=${key}`, {
    headers: {
      Authorization: g_token
    }
  })
  return CDNAddress + key
}

function ED({ title, context, setContext, disabled, image }: EDProp) {
  // base64 show
  const [img, setImg] = useState('')
  const { globalData, setGlobalData } = useContext(GlobalContext)
  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files![0];
    const reader = new FileReader();

    reader.onload = async () => {
      const imageRaw = reader.result as string
      setImg(imageRaw);
      const imgUrl = await onUpload(file, globalData.token)
      setContext!(imgUrl)
    };

    reader.readAsDataURL(file);
  }
  if (image) {
    return (
      <div style={{ margin: '10px 0' }}>
        <span>{title}</span>
        {img &&
          <div style={{ height: '0h', width: '20vw', margin: '10px 0' }}>
            <Image src={img} alt="Uploaded Image" fluid />
          </div>
        }
        <Form.Control type="file" onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          await handleFileUpload(e)
        }} />
      </div >
    )
  }
  return (
    <div>
      {context ?
        <div style={{ margin: '10px 0' }}>
          <span>{title}</span>

          <FloatingLabel
            controlId="floatingInput"
            label={context}
            className="mb-3"
          >
            {
              disabled ?
                <Form.Control
                  type="text"
                  placeholder="Disabled input"
                  aria-label="Disabled input example"
                  disabled
                  readOnly
                /> :
                <Form.Control type="text" placeholder='修改' onChange={(e) => {
                  const value = e.target.value
                  if (!value || value.trim() === '' || value === context) return
                  setContext!(value)
                }} />
            }
          </FloatingLabel>
        </div>
        :
        <Alert variant='primary'>
          {title}
        </Alert>
      }
    </div>
  )
}

export default EditForm