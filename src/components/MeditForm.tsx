import { API } from "@models/api";
import { Detail, mapMatchStatus } from "@models/detil";
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
  setContext?: (arg0: string) => void;
}

interface EditProps {
  data: Detail;
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
    const url = '/match/admin_update'
    const res: API = await axiosInstance.post(url,
      addField(submitObj, 'matchId', detail.matchId!), {
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
      <ED title='赛事信息' context={null} />
      <ED title='赛事状态' context={detail.matchStatus} setContext={
        (arg) => {
          let t_d = detail
          t_d.matchStatus = arg
          submitObj = addField(submitObj, 'matchStatus', arg)
          setDetail(t_d)
        }} />
      <ED title='赛事名称' context={detail.matchName} setContext={
        (arg) => {
          let t_d = detail
          t_d.matchName = arg
          submitObj = addField(submitObj, 'matchName', arg)
          setDetail(t_d)
        }} />
      <ED title='开始时间' context={detail.startTime} setContext={
        (arg) => {
          let t_d = detail
          t_d.startTime = arg
          submitObj = addField(submitObj, 'startTime', arg)
          setDetail(t_d)
        }} />
      <ED title='结束时间' context={detail.endTime} setContext={
        (arg) => {
          let t_d = detail
          t_d.endTime = arg
          submitObj = addField(submitObj, 'endTime', arg)
          setDetail(t_d)
        }} />
      <ED title='图片' context={detail.picture} image={true} setContext={
        (arg) => {
          let t_d = detail
          t_d.picture = arg
          console.log('set context: ' + arg)
          submitObj = addField(submitObj, 'picture', arg)
          setDetail(t_d)
        }} />
      <ED title='赛事介绍' context={detail.introduction} setContext={
        (arg) => {
          let t_d = detail
          t_d.introduction = arg
          submitObj = addField(submitObj, 'introduction', arg)
          setDetail(t_d)
        }} />
      <ED title='赛事标签' context={detail.tag} setContext={
        (arg) => {
          let t_d = detail
          t_d.tag = arg
          submitObj = addField(submitObj, 'tag', arg)
          setDetail(t_d)
        }} />
      {
        detail.organizer && <div>
          <ED title='主办方信息' context={null} />
          <ED title='昵称' context={detail.organizer!.nickName} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.organizer!.nickName = arg
              setDetail(t_d)
            }} />
          <ED title='电话号码' context={detail.organizer!.phone} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.organizer!.phone = arg
              setDetail(t_d)
            }} />
        </div>
      }
      {
        detail.sponsor && <>
          <ED title='赞助商信息' context={null} />
          <ED title='昵称' context={detail.sponsor.nickName} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.sponsor!.nickName = arg
              setDetail(t_d)
            }} />
          <ED title='电话号码' context={detail.sponsor.phone} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.sponsor!.phone = arg
              setDetail(t_d)
            }} />
        </>
      }
      {
        detail.sponsorPlan && <>
          <ED title='赞助计划' context={null} />
          <ED title='广告词' context={detail.sponsorPlan.advertising} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.sponsorPlan!.advertising = arg
              setDetail(t_d)
            }} />
          <ED title='奖品' context={detail.sponsorPlan.prize} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.sponsorPlan!.prize = arg
              setDetail(t_d)
            }} />
          <ED title='金额' context={detail.sponsorPlan.money} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.sponsorPlan!.money = arg
              setDetail(t_d)
            }} />
          <ED title='图片地址' context={detail.sponsorPlan.picture} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.sponsorPlan!.picture = arg
              setDetail(t_d)
            }} />
        </>
      }
      {
        detail.stadium && <>
          <ED title='场馆' context={null} />
          <ED title='所属楼栋' context={detail.stadium.building} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.stadium!.building = arg
              setDetail(t_d)
            }} />
          <ED title='具体编号' context={detail.stadium.number} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.stadium!.number = arg
              setDetail(t_d)
            }} />
          <ED title='场馆设备' context={detail.stadium.equipment} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.stadium!.equipment = arg
              setDetail(t_d)
            }} />
        </>
      }
      {
        detail.auditor && <>
          <ED title='审核人' context={null} />
          <ED title='电话号码' context={detail.auditor.phone} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.auditor!.phone = arg
              setDetail(t_d)
            }} />
          <ED title='真实姓名' context={detail.auditor.name} disabled={true} setContext={
            (arg) => {
              let t_d = detail
              t_d.auditor!.name = arg
              setDetail(t_d)
            }} />
        </>
      }

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