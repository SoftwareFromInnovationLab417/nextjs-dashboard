import { NextPage } from 'next'
import { AdminLayout } from '@layout'
import { Button, Card, Form } from 'react-bootstrap'
import React, { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axiosInstance'
import { GlobalContext } from 'src/globalData'
import { useRouter } from 'next/router'
import { API } from '@models/api'
import OffCanvas from '@components/offCanvas'

type Props = {

}

const Introduction: NextPage<Props> = (props) => {
  const router = useRouter();

  const [introductions, setIntroductions] = useState('')
  const { globalData, setGlobalData } = useContext(GlobalContext)

  const [show, setShow] = useState(false)

  const [introduction, setIntroduction] = useState('')
  const [introductionDay, setIntroductionDay] = useState('')
  useEffect(() => {
    async function init() {
      const res: API = await axiosInstance.get("/match/notice/get",
        {
          headers: {
            Authorization: globalData.token
          }
        }
      )
      const { code, msg, data } = res;
      if (code === 479) {
        router.push("/login")
      }
      console.log(res.data)
      setIntroductions(res.data)
    }
    init()
  }, [globalData.token, router])

  const submitIntroduction = async () => {
    const url = '/match/notice/push'
    const params = { note: introduction, day: introductionDay };
    // console.log(globalData.token)
    const token = globalData.token
    const res = await axiosInstance.post(`${url}?${new URLSearchParams(params)}`, null,
      {
        headers: {
          Authorization: `${token}`
        }
      }
    )


    {
      const res: API = await axiosInstance.get("/match/notice/get",
        {
          headers: {
            Authorization: globalData.token
          }
        }
      )
      const { code, msg, data } = res;
      if (code === 479) {
        router.push("/login")
      }
      console.log(res.data)
      setIntroductions(res.data)
    }
  }


  return (
    <AdminLayout>
      <Card>
        <Card.Header>
          公告
        </Card.Header>
        <Card.Body>
          {
            introductions &&
            <p>{introductions}</p>
          }
        </Card.Body>
      </Card>
      <Button variant="secondary" style={{ margin: "10px 0" }} onClick={() => setShow(!show)}>
        添加公告
      </Button>
      <OffCanvas name='添加公告' show={show} onHide={setShow} placement='top'>
        <Form>
          <Form.Group controlId="exampleForm.ControlTextarea1" style={{ margin: '10px 0' }}>
            <Form.Label>公告内容</Form.Label>
            <Form.Control as="textarea" rows={2} onChange={(e) => setIntroduction(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlTextarea1" style={{ margin: '10px 0' }}>
            <Form.Label>公告展示天数</Form.Label>
            <Form.Control as="textarea" rows={1} onChange={(e) => setIntroductionDay(e.target.value)} />
          </Form.Group>
          <Button style={{ margin: '10px 0' }} onClick={submitIntroduction}>添加公告</Button>
        </Form>
      </OffCanvas>
    </AdminLayout>
  )
}


const IntroductionForm: NextPage = () => {
  return (
    <div></div>
  )
}

export default Introduction