import { AdminLayout } from "@layout";
import { API } from "@models/api";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { use, useContext, useState } from "react";
import { Button, Card, Table, Image, Alert } from "react-bootstrap";
import axiosInstance, { redirectAuth } from "src/axiosInstance";
import { GlobalContext } from "src/globalData";

interface TData {
  organizersId: string;
  placeId: string;
  matchName: string;
  startTime: string;
  endTime: string;
  picture: string;
  introduction: string;
  tag: string;
}

const mp = new Map([
  ['6', '体育馆 103'],
  ['7', 'B1 101'],
  ['8', 'B2 102'],
])

const mp2 = new Map([
  ['1667822270043664386', '华为公司'],
  ['1667821866467733506', '小米公司'],
])

const events: TData[] = [
  {
    organizersId: '1667822270043664386',
    placeId: '6',
    matchName: '篮球火校园赛',
    startTime: '2023-06-28 14:00:40',
    endTime: '2023-06-30 17:00:12',
    picture: 'http://qny.chatea-lovely.top/school_match/2023/06/17/264abf13a1f444f9.png',
    introduction: '篮球火校园赛，赛出风采',
    tag: '篮球，运动，竞技',
  },
  {
    organizersId: '1667822270043664386',
    placeId: '7',
    matchName: '青春羽毛球',
    startTime: '2023-06-29 14:02:15',
    endTime: '2023-06-30 17:00:11',
    picture: 'http://qny.chatea-lovely.top/school_match/2023/06/17/264abf13a1f444f9.png',
    introduction: '跳',
    tag: '羽毛球，运动，竞技',
  },
  {
    organizersId: '1667821866467733506',
    placeId: '8',
    matchName: '计算机算法大赛',
    startTime: '2023-06-29 14:00:40',
    endTime: '2023-07-29 17:00:01',
    picture: 'http://qny.chatea-lovely.top/school_match/2023/06/17/264abf13a1f444f9.png',
    introduction: 'rap',
    tag: '知识，算法，竞赛',
  },
]

const Event: NextPage = () => {
  const router = useRouter()
  const { globalData, setGlobalData } = useContext(GlobalContext)
  const [show, setShow] = useState(false)

  const Show = () => {
    setShow(true)
    setTimeout(() => {
      setShow(false)
    }, 2000)
  }

  const submit = async (idx: number) => {
    const data = events[idx]
    const url = '/match/add'

    const res: API = await axiosInstance.post(url, data, {
      headers: {
        Authorization: globalData.token
      }
    })

    redirectAuth(res.code, router)
    console.log(res)
    if (res.code == 200) {
      Show()
    }
  }

  return (
    <AdminLayout>
      <Card>
        <Card.Header>
          审核赛事
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>举办方</th>
                <th>场馆</th>
                <th>赛事名</th>
                <th>开始时间</th>
                <th>结束时间</th>
                <th>图片</th>
                <th>赛事介绍</th>
                <th>赛事标签</th>
                <th>审核</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, idx) => {
                return (
                  <tr key={idx} >
                    <td>{idx + 1}</td>
                    <td style={{ width: '10vw' }}>{mp2.get(e.organizersId)}</td>
                    <td>{mp.get(e.placeId)}</td>
                    <td>{e.matchName}</td>
                    <td>{e.startTime}</td>
                    <td>{e.endTime}</td>
                    <td>
                      <div style={{ height: '0h', width: '5vw' }}>
                        <Image src={`${e.picture}`} alt="picture" fluid />
                      </div>
                    </td>
                    <td>{e.introduction}</td>
                    <td>{e.tag}</td>
                    <td>
                      <Button
                        style={{ width: '8vw' }}
                        variant="secondary"
                        onClick={
                          async () => {
                            await submit(idx)
                          }
                        }>审核通过</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      {
        show &&
        <Alert variant="primary">添加成功</Alert>
      }
    </AdminLayout>
  )
}


export default Event

