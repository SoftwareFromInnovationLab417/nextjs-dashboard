
import OffCanvas from "@components/offCanvas";
import { AdminLayout } from "@layout";
import { API } from "@models/api";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { use, useContext, useEffect, useState } from "react";
import { Button, Card, Table, Image, Row, Col, Badge, Alert, Pagination, Form, FloatingLabel } from "react-bootstrap";
import axiosInstance, { redirectAuth } from "src/axiosInstance";
import { GlobalContext } from "src/globalData";

import EditForm from "@components/SeditForm";
import DetailForm from "@components/SdetialForm";
import { sponsor } from "@models/sponsorPlan";

const Event: NextPage = () => {
  const router = useRouter()
  const { globalData, setGlobalData } = useContext(GlobalContext)

  const [events, setEvents] = useState<sponsor[]>([])

  const [showDetail, setShowDetail] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showIdx, setShowIdx] = useState(0)
  const [del, setDel] = useState(false)

  const [curPageIdx, setCurPageIdx] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  const [search, setSearch] = useState('')
  // reload the table list
  const reloadTable = async (page: number) => {
    console.log('page: ' + page)
    const url = `/advertandprize/manager/search`
    let params = { page: page.toString(), size: '5' }
    const res: API = await axiosInstance.get(`${url}?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: globalData.token
      }
    })
    const { code, msg, data } = res
    redirectAuth(code, router)

    if (code === 300) {
      setHasNext(false)
      setEvents([])
      return
    }
    else
      setHasNext(true)

    // raw data
    const evs: any[] = data

    // dto data
    const d_e: sponsor[] = []

    // assign value
    if (evs && evs.length !== 0)
      evs.map((e) => {
        d_e.push(e);
      })
    // console.log(d_e)

    // set dto
    setEvents(d_e)

    return true
  }

  // used by the sponsor login
  const reloadTableUserId = async (page: number) => {
    console.log('page: ' + page)
    const url = `/advertandprize/searchall`
    let params = { userId: globalData.id, page: page.toString(), size: '5' }
    const res: API = await axiosInstance.get(`${url}?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: globalData.token
      }
    })
    const { code, msg, data } = res
    redirectAuth(code, router)

    if (code === 300) {
      setHasNext(false)
      setEvents([])
      return
    }
    else
      setHasNext(true)

    // raw data
    const evs: any[] = data

    // dto data
    const d_e: sponsor[] = []

    // assign value
    if (evs && evs.length !== 0)
      evs.map((e) => {
        d_e.push(e);
      })
    // console.log(d_e)

    // set dto
    setEvents(d_e)

    return true
  }

  useEffect(() => {
    reloadTable(curPageIdx)
  }, [globalData, router, showDetail, showEdit, del])

  return (
    <AdminLayout>
      <Card>
        <Card.Header>
          赛事
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>赞助商名称</th>
                <th>赞助商电话</th>
                <th>广告词</th>
                <th>奖品</th>
                <th>金额</th>
                <th>图片</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events && events.map((e, idx) => {
                return (
                  <tr key={idx} >
                    <td>{idx + 1}</td>
                    <td>{e.userTableDTO.nickName}</td>
                    <td>{e.userTableDTO.phone}</td>
                    <td>{e.sponsorPlan.advertising}</td>
                    <td>{e.sponsorPlan.prize}</td>
                    <td>{e.sponsorPlan.money}</td>
                    <td>
                      <div style={{ height: '0h', width: '5vw' }}>
                        <Image src={`${e.sponsorPlan.picture}`} alt="picture" fluid />
                      </div>
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        style={{ margin: '0 5px' }}
                        onClick={
                          () => {
                            setShowDetail(!showDetail)
                            setShowIdx(idx)
                          }
                        }>查看</Button>
                      <Button
                        variant="info"
                        style={{ margin: '0 5px' }}
                        onClick={
                          () => {
                            setShowEdit(!showEdit)
                            setShowIdx(idx)
                          }
                        }>编辑</Button>
                      <Button
                        variant="danger"
                        style={{ margin: '0 5px' }}
                        onClick={
                          async () => {
                            setShowIdx(idx)
                            const url = `/advertandprize/delete?sponsorPlanId=${events[showIdx].sponsorPlan.sponPlanId}`
                            const res = await axiosInstance.get(url, {
                              headers: {
                                Authorization: globalData.token
                              }
                            })
                            console.log(res)
                            setDel(!del)
                          }
                        }>删除</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination>
              {
                curPageIdx > 1 &&
                <Pagination.Prev onClick={
                  async () => {
                    await reloadTable(curPageIdx - 1)
                    setCurPageIdx(curPageIdx - 1)
                  }} />
              }
              <Pagination.Item>{curPageIdx}</Pagination.Item>
              {
                hasNext &&
                <Pagination.Next onClick={
                  async () => {
                    await reloadTable(curPageIdx + 1)
                    setCurPageIdx(curPageIdx + 1)
                  }} />
              }
            </Pagination>
          </div>
        </Card.Body>
      </Card>

      <OffCanvas name="编辑赞助计划详细信息" show={showEdit} onHide={setShowEdit} placement="end">
        <div>
          <EditForm data={events[showIdx]} />
        </div>
      </OffCanvas>
      <OffCanvas name="查看赞助计划详细信息" show={showDetail} onHide={setShowDetail} placement="start">
        <div>
          <DetailForm data={events[showIdx]} />
        </div>
      </OffCanvas>
    </AdminLayout>
  )
}


export default Event

