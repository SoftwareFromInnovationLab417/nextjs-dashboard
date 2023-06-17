import OffCanvas from "@components/offCanvas";
import { AdminLayout } from "@layout";
import { API } from "@models/api";
import { Detail, mapMatchStatus } from "@models/detil";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { use, useContext, useEffect, useState } from "react";
import { Button, Card, Table, Image, Row, Col, Badge, Alert, Pagination, Form, FloatingLabel } from "react-bootstrap";
import axiosInstance, { redirectAuth } from "src/axiosInstance";
import { GlobalContext } from "src/globalData";

import EditForm from "@components/MeditForm";
import DetailForm from "@components/MdetialForm";

const Event: NextPage = () => {
  const router = useRouter()
  const { globalData, setGlobalData } = useContext(GlobalContext)

  const [events, setEvents] = useState<Detail[]>([])

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
    const url = `/match/admin_search`
    const params = { page: page.toString(), size: '5', name: search }
    const res: API = await axiosInstance.get(`${url}?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: globalData.token
      }
    })
    const { code, msg, data } = res
    console.log(res)
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
    const d_e: Detail[] = []

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
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Control type="text" placeholder="赛事名称" onChange={async (e) => {
                  const value = e.target.value
                  setSearch(value)
                }} />
              </Form.Group>
              <Form.Group as={Col}>
                <Button variant="primary" style={{ margin: '0 10px' }} onClick={async () => {
                  setCurPageIdx(1)
                  await reloadTable(1)
                }}>{'[>]'}</Button>
              </Form.Group>
            </Row>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>赛事名称</th>
                <th>赞助商名称</th>
                <th>赛事状态</th>
                <th>开始时间</th>
                <th>结束时间</th>
                <th>图片</th>
                <th>举办方名称</th>
              </tr>
            </thead>
            <tbody>
              {events && events.map((e, idx) => {
                return (
                  <tr key={idx} >
                    <td>{idx + 1}</td>
                    <td>{e.matchName}</td>
                    <td>{e.sponsor ? e.sponsor.nickName : null}</td>
                    <td>{mapMatchStatus(e.status!.toString())}</td>
                    <td>{e.startTime}</td>
                    <td>{e.endTime}</td>
                    <td>
                      <div style={{ height: '0h', width: '5vw' }}>
                        <Image src={`${e.picture}`} alt="picture" fluid />
                      </div>
                    </td>
                    <td>{ }</td>
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
                            const url = `/match/deleted?id=${events[showIdx].matchId}`
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

      <OffCanvas name="编辑赛事详细信息" show={showEdit} onHide={setShowEdit} placement="end">
        <div>
          <EditForm data={events[showIdx]} />
        </div>
      </OffCanvas>
      <OffCanvas name="查看赛事详细信息" show={showDetail} onHide={setShowDetail} placement="start">
        <div>
          <DetailForm data={events[showIdx]} />
        </div>
      </OffCanvas>
    </AdminLayout>
  )
}


export default Event

