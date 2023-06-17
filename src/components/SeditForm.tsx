import { API } from "@models/api";
import { sponsor } from "@models/sponsorPlan";
import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, useContext, useState } from "react";
import { Alert, Button, Col, FloatingLabel, Form, Row, Image } from "react-bootstrap";
import axiosInstance, { redirectAuth } from "src/axiosInstance";
import { GlobalContext } from "src/globalData";

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
  setContext?: (arg: string) => void;
}

interface EditProps {
  data: sponsor;
}

export function EditForm({ data }: EditProps) {
  const router = useRouter()
  // edit object
  const [detail, setDetail] = useState(data);
  // edit success window
  const [editSuc, setEditSuc] = useState(false);
  // server token
  const { globalData, setGlobalData } = useContext(GlobalContext)

  const opt: string[] = []

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
    const url = '/advertandprize/manager/update'

    const res: API = await axiosInstance.post(url,
      addField(submitObj, 'sponPlanId', detail.sponsorPlan.sponPlanId!), {
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
      <ED title='赞助信息' context={null} />
      <ED title='赞助商名称' context={detail.userTableDTO.nickName} />
      <ED title='赞助商电话' context={detail.userTableDTO.phone} />
      <ED title='广告词' context={detail.sponsorPlan.advertising} setContext={
        (arg) => {
          let t_d = detail
          t_d.sponsorPlan.advertising = arg
          submitObj = addField(submitObj, 'advertising', arg)
          setDetail(t_d)
        }} />
      <ED title='奖品' context={detail.sponsorPlan.prize} setContext={
        (arg) => {
          let t_d = detail
          t_d.sponsorPlan.prize = arg
          submitObj = addField(submitObj, 'prize', arg)
          setDetail(t_d)
        }} />
      <ED title='金额' context={detail.sponsorPlan.money} setContext={
        (arg) => {
          let t_d = detail
          t_d.sponsorPlan.money = arg
          submitObj = addField(submitObj, 'money', arg)
          setDetail(t_d)
        }} />
      <ED title='图片' context={detail.sponsorPlan.picture} image={true} setContext={
        (arg: string) => {
          let t_d = detail
          t_d.sponsorPlan.picture = arg
          submitObj = addField(submitObj, 'picture', arg)
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
      </Row >
    </div >
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

export function ED({ title, context, setContext, disabled, image }: EDProp) {
  // image show base64 / url from cdn
  const [img, setImg] = useState(context)
  // server token
  const { globalData, setGlobalData } = useContext(GlobalContext)

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files![0];

    const reader = new FileReader();

    reader.onload = async () => {
      const imageRaw = reader.result as string
      // set base64 image first
      setImg(imageRaw);
      // upload image file object
      const imgUrl = await onUpload(file, globalData.token)
      setContext!(imgUrl)
    };

    // read base64 first
    reader.readAsDataURL(file);
  }

  // switch render image+choice or label+form
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
