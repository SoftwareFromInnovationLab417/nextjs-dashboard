import { AdminLayout } from "@layout";
import { API } from "@models/api";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { use, useContext, useState } from "react";
import { Button, Card, Table, Image, Alert } from "react-bootstrap";
import axiosInstance, { redirectAuth } from "src/axiosInstance";
import { GlobalContext } from "src/globalData";

interface TData {
  a1: string;
  a2: string;
  a3: string;
  a4: string;
  a5: string;
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
    a1: '1667822270043664386',
    a2: '校园活动中心',
    a3: '校方',
    a4: '李龙',
    a5: '17822222222',
  },
  {
    a1: '1667822270043664386',
    a2: '校园活动中心',
    a3: '校方',
    a4: '马露',
    a5: '17822222222',
  },
  {
    a1: '1667822270043664386',
    a2: '校园活动中心',
    a3: '校方',
    a4: '',
    a5: '17822222222',
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
          审核主办方
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>举办方id</th>
                <th>举办方名称</th>
                <th>举办方单位</th>
                <th>举办方联系人</th>
                <th>联系人电话</th>
                <th>审核</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, idx) => {
                return (
                  <tr key={idx} >
                    <td>{idx + 1}</td>
                    <td style={{ width: '10vw' }}>{e.a1}</td>
                    <td>{e.a2}</td>
                    <td>{e.a3}</td>
                    <td>{e.a4}</td>
                    <td>{e.a5}</td>
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

