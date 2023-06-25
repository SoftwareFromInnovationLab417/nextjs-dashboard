import OffCanvas from "@components/offCanvas";
import { AdminLayout } from "@layout";
import { API } from "@models/api";
import { Detail, SponsorPlan, mapMatchStatus } from "@models/detail";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, use, useContext, useEffect, useState } from "react";
import { Button, Card, Table, Image, Row, Col, Pagination, Form, FloatingLabel, Spinner, Alert } from "react-bootstrap";
import axiosInstance, { redirectAuth } from "src/axiosInstance";
import { GlobalContext, IdTable } from "src/globalData";

import EditForm from "@components/MeditForm";
import DetailForm from "@components/MdetialForm";
import { sponsor, sponsorPlan } from "@models/sponsorPlan";

const Event: NextPage = () => {
  const router = useRouter()
  const { globalData, setGlobalData } = useContext(GlobalContext)
  const idf = IdTable.get(globalData.identity)

  const [events, setEvents] = useState<Detail[]>([])

  const [showDetail, setShowDetail] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showSponsorPlan, setShowSponsorPlan] = useState(false)
  const [spId, setSpId] = useState(0)
  const [showIdx, setShowIdx] = useState(0)
  const [del, setDel] = useState(false)

  const [curPageIdx, setCurPageIdx] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  const [search, setSearch] = useState('')

  const [notify, setNotify] = useState(true)

  // reload the table list
  const reloadTable = async (page: number) => {
    console.log('page: ' + page)
    let url = `/match/admin_search`
    if (idf === 2)
      url = `/match/search`
    const params = { page: page.toString(), size: '5', name: search }
    const res: API = await axiosInstance.get(`${url}?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: globalData.token
      }
    })
    const { code, msg, data } = res
    console.log(res)
    // temporarily
    if (globalData.token === '') {
      redirectAuth(479, router)
    }
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
    console.log(d_e)

    // set dto
    setEvents(d_e)

    return true
  }

  useEffect(() => {
    reloadTable(curPageIdx)
  }, [globalData, router, showDetail, showEdit, del, SelectSp, notify])

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
                      {
                        idf !== 2 &&
                        <div>
                            <Button
                              variant="info"
                              style={{ margin: '10px 5px' }}
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
                        </div>
                      }
                      {
                        idf === 2 &&
                        <Button
                          variant="success"
                          style={{ margin: '0 5px' }}
                          onClick={
                            () => {
                              setShowSponsorPlan(!showSponsorPlan)
                            }
                          }>赞助计划</Button>
                      }
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
      <OffCanvas name="选择赛事计划" show={showSponsorPlan} onHide={setShowSponsorPlan} placement="start" >
        <div>
          {/* <Button onClick={() => {
            console.log(events[showIdx].matchId!)
            console.log(globalData.identity)
            console.log(showIdx)
          }}>Click</Button> */}
          {events &&
            <SelectSp match={events[showIdx]} token={globalData.token} id={globalData.id} n={notify} sn={setNotify} />
          }
        </div>
      </OffCanvas>
    </AdminLayout >
  )
}

interface SP {
  match: Detail;
  id: string;
  token: string;
  n: boolean;
  sn: Dispatch<SetStateAction<boolean>>
}

function SelectSp({ match, id, token, n, sn }: SP) {
  const router = useRouter()

  const [showt, setShowt] = useState<sponsor[]>([])
  const [showMsg, setShowMsg_] = useState('')
  const setShowMsg = (msg: string) => {
    setShowMsg_(msg)
    setTimeout(() => {
      setShowMsg_('')
    }, 2000)
  }
  useEffect(() => {
    async function init() {
      const url = '/advertandprize/searchall'
      const params = { userId: id, page: '1', size: '100' }
      const res: API = await axiosInstance.get(`${url}?${new URLSearchParams(params)}`, {
        headers: {
          Authorization: token
        }
      })

      const { code, msg, data } = res
      redirectAuth(code, router)
      const r: sponsor[] = []
      const t = data as sponsorPlan[]

      t.forEach((e) => {
        r.push({
          sponsorPlan: e
        })
      })

      setShowt(r)
    }

    init()
  }, [id])

  const submit = async (choice: string) => {
    const url = '/match/update'
    const params = { matchId: match.matchId, startTime: match.startTime, sponsorId: id, sponPlanId: choice }
    const res: API = await axiosInstance.post(url, params, {
      headers: {
        Authorization: token
      }
    })
    const { code, msg, data } = res
    redirectAuth(code, router)
    setShowMsg(msg)
  }

  if (showt.length === 0) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>广告词</th>
            <th>奖品</th>
            <th>金额</th>
            <th>图片</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {showt && showt.map((e, idx) => {
            return (
              <tr key={idx} >
                <td>{idx + 1}</td>
                <td>{e.sponsorPlan.advertising}</td>
                <td>{e.sponsorPlan.prize}</td>
                <td>{e.sponsorPlan.money + '.00'}</td>
                <td>
                  <div style={{ height: '0h', width: '5vw' }}>
                    <Image src={`${e.sponsorPlan.picture}`} alt="picture" fluid />
                  </div>
                </td>
                <td>
                  <Button
                    variant="secondary"
                    style={{ margin: '0 5px' }}
                    onClick={async () => {
                      await submit(e.sponsorPlan.sponPlanId)
                      sn(!n)
                    }}>确认</Button>

                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      {
        showMsg &&
        <Alert variant="success">{showMsg}</Alert>
      }
    </>
  )
}


export default Event

