import OffCanvas from "@components/offCanvas";
import { AdminLayout } from "@layout";
import { API } from "@models/api";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button, Card, Table, Image, Pagination, Alert } from "react-bootstrap";
import axiosInstance, { redirectAuth } from "src/axiosInstance";
import { GlobalContext, IdTable } from "src/globalData";

import { EditForm, ED } from "@components/SeditForm";
import DetailForm from "@components/SdetialForm";
import { sponsor } from "@models/sponsorPlan";
import axios from "axios";

const Event: NextPage = () => {
  const router = useRouter()
  const { globalData, setGlobalData } = useContext(GlobalContext)
  const idf = IdTable.get(globalData.identity)

  const [events, setEvents] = useState<sponsor[]>([])

  const [showDetail, setShowDetail] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showEditMsg, setShowEditMsg_] = useState(-1)
  const setShowEdtMsg = (idx: number) => {
    setShowEditMsg_(idx)
    setTimeout(() => {
      setShowEditMsg_(-1)
    }, 2000)
  }
  const [showAdd, setShowAdd] = useState(false)
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
        d_e.push({ sponsorPlan: e, userTableDTO: undefined });
      })
    // console.log(d_e)

    // set dto
    setEvents(d_e)

    return true
  }

  useEffect(() => {
    if (idf !== 2)
      reloadTable(curPageIdx)
    else
      reloadTableUserId(curPageIdx)
  }, [globalData, router, showDetail, showEdit, del])

  return (
    <AdminLayout>
      <Card>
        <Card.Header>
          赞助计划
        </Card.Header>
        <Button
          style={{ margin: '10px' }}
          variant='outline-info'
          onClick={
            () => {
              setShowAdd(!showAdd)
            }
          }
        >
          添加赞助计划
        </Button>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                {
                  idf !== 2 &&
                  <th>赞助商名称</th>
                }
                {
                  idf !== 2 &&
                  <th>赞助商电话</th>
                }
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
                    {
                      idf !== 2 &&
                      <td>{e.userTableDTO!.nickName}</td>
                    }
                    {
                      idf !== 2 &&
                      <td>{e.userTableDTO!.phone}</td>
                    }
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
                        onClick={
                          () => {
                            setShowDetail(!showDetail)
                            setShowIdx(idx)
                          }
                        }>查看</Button>
                      {
                        idf === 2 &&
                        <>
                          <Button
                            variant="info"
                            style={{ margin: '0 5px' }}
                            onClick={
                              async () => {
                                const url = '/advertandprize/judge'
                                const param = { sponsorPlanId: globalData.id }
                                const res: API = await axiosInstance.get(`${url}?${new URLSearchParams(param)}`, {
                                  headers: {
                                    Authorization: globalData.token
                                  }
                                })
                                const code = res.code
                                redirectAuth(code, router)
                                if (code === 4400) {
                                  setShowEdit(!showEdit)
                                  setShowIdx(idx)
                                } else {
                                  setShowEdtMsg(idx)
                                }
                              }
                            }>编辑</Button>
                          {
                            showEditMsg === idx &&
                            <Alert variant="danger" style={{ margin: '5px' }}>比赛已开赛, 请联系管理员</Alert>
                          }
                        </>
                      }
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

      <OffCanvas name="添加赞助计划详细信息" show={showAdd} onHide={setShowAdd} placement="start">
        <div>
          <AddForm />
        </div>
      </OffCanvas>
      <OffCanvas name="编辑赞助计划详细信息" show={showEdit} onHide={setShowEdit} placement="end">
        <div>
          <EditForm data={events[showIdx]} sp={idf === 2} />
        </div>
      </OffCanvas>
      <OffCanvas name="查看赞助计划详细信息" show={showDetail} onHide={setShowDetail} placement="start">
        <div>
          <DetailForm data={events[showIdx]} sp={idf === 2} />
        </div>
      </OffCanvas>
    </AdminLayout>
  )
}



interface TD {
  advertising: string;
  prize: string;
  money: string;
  picture: string;
}

function AddForm() {
  const router = useRouter()
  const [o, setO] = useState<TD>({ advertising: '', prize: '', money: '', picture: '' })

  // edit success window
  const [editSuc, setEditSuc] = useState(false);

  const setShow = () => {
    setEditSuc(true)
    setTimeout(() => {
      setEditSuc(false)
    }, 2000)
  }
  // server token
  const { globalData, setGlobalData } = useContext(GlobalContext)

  return (
    <div>
      <ED title='广告词' context={'请输入'} setContext={
        (arg) => {
          let t_o = o
          t_o.advertising = arg
          setO(t_o)
        }
      } />
      <ED title='奖品' context={'请输入'} setContext={
        (arg) => {
          let t_o = o
          t_o.prize = arg
          setO(t_o)
        }
      } />
      <ED title='金额' context={'请输入'} setContext={
        (arg) => {
          let t_o = o
          t_o.money = arg
          setO(t_o)
        }
      } />
      <ED title='图片' context={'请输入'} image={true} setContext={
        (arg: string) => {
          let t_o = o
          t_o.picture = arg
          setO(t_o)
        }} />
      <Button variant="primary" onClick={async () => {
        const url = '/advertandprize/add'
        const res: API = await axiosInstance.post(url, o, {
          headers: {
            Authorization: globalData.token,
          }
        })
        redirectAuth(res.code, router)
        setShow()
        console.log(res)
      }}>添加</Button>
      <br />
      {
        editSuc &&
        <Button style={{ margin: '10px 0' }} variant="outline-success" disabled>修改成功</Button>
      }
    </div>
  )
}


export default Event

