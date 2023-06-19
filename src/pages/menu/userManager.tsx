import OffCanvas from "@components/offCanvas";
import { AdminLayout } from "@layout";
import { API } from "@models/api";
import { Detail, mapMatchStatus } from "@models/detail";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button, Card, Table, Image, Row, Col, Pagination, Form } from "react-bootstrap";
import axiosInstance, { redirectAuth } from "src/axiosInstance";
import { GlobalContext, IdTable } from "src/globalData";

import EditForm from "@components/UserEditForm";
import { User } from "@models/user";
import { ED } from "@components/SeditForm";


const Event: NextPage = () => {
  const router = useRouter()
  const { globalData, setGlobalData } = useContext(GlobalContext)

  const [users, setUsers] = useState<User[]>([])
  const [sh, setSh] = useState(true)

  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showIdx, setShowIdx] = useState(0)
  const [del, setDel] = useState(false)

  const [curPageIdx, setCurPageIdx] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  const [search, setSearch] = useState('')
  // reload the table list
  const reloadTable = async (page: number) => {
    setShowIdx(0)
    console.log('page: ' + page)
    const url = `/managerInfo/search`
    const params = { page: page.toString(), size: '5' }
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
      setUsers([])
      return
    }
    else
      setHasNext(true)

    // raw data
    const evs: any[] = data

    // dto data
    const d_e: User[] = []

    // assign value
    if (evs && evs.length !== 0)
      evs.map((e) => {
        d_e.push(e);
      })
    // console.log(d_e)

    // set dto
    setUsers(d_e)

    return
  }

  const searchOne = async (page: number) => {
    setShowIdx(0)
    setCurPageIdx(1)
    const url = '/managerInfo/searchOne'
    const params = { account: search }
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
      setUsers([])
      return
    }
    else
      setHasNext(true)

    setUsers(data ? data : [])

  }

  useEffect(() => {
    if (!searchOne)
      reloadTable(curPageIdx)
    else searchOne(curPageIdx)
  }, [globalData, router, showEdit, showAdd, del])

  return (
    <AdminLayout>
      <Card>
        <Card.Header>
          用户
        </Card.Header>
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Control type="text" placeholder="账号查询" onChange={async (e) => {
                  const value = e.target.value
                  setSearch(value)
                }} />
              </Form.Group>
              <Form.Group as={Col}>
                <Button variant="primary" style={{ margin: '0 10px' }} onClick={
                  async () => {
                    await searchOne(curPageIdx)
                  }
                }>{'[>]'}</Button>
                {
                  // super manager add user
                  IdTable.get(globalData.identity) == 3 &&
                  <Button variant="success" style={{ margin: '0 10px' }} onClick={
                    () => setShowAdd(!showAdd)
                  }>{'[+]'}</Button>
                }
              </Form.Group>
            </Row>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>昵称</th>
                <th>账号</th>
                <th>身份</th>
                <th>电话</th>
                <th>姓名</th>
              </tr>
            </thead>
            <tbody>
              {users && users.map((e, idx) => {
                return (
                  <tr key={idx} >
                    <td>{idx + 1}</td>
                    <td>{e.nickName}</td>
                    <td>{e.account}</td>
                    <td>{e.status}</td>
                    <td>{e.phone}</td>
                    <td>{e.name}</td>
                    <td>
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
                            const url = `/managerInfo/deleted?id=${users[showIdx].userId}`
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

      <OffCanvas name="编辑用户详细信息" show={showEdit} onHide={setShowEdit} placement="end">
        <div>
          <EditForm data={users[showIdx]} />
        </div>
      </OffCanvas>
      <OffCanvas name="新增用户详细信息" show={showAdd} onHide={setShowAdd} placement="end">
        <div>
          <AddForm />
        </div>
      </OffCanvas>
    </AdminLayout>
  )
}

interface AddProp {
  nickName: string;
  account: string;
  password: string;
  status: string;
  phone: string;
  name: string;
}

function AddForm() {
  const router = useRouter()
  const [o, setO] = useState<AddProp>({ nickName: '', account: '', password: '', status: '', phone: '', name: '' })

  // server token
  const { globalData, setGlobalData } = useContext(GlobalContext)

  return (
    <div>
      <ED title='昵称' context={'请输入'} setContext={
        (arg) => {
          let t_o = o
          t_o.nickName = arg
          setO(t_o)
        }
      } />
      <ED title='账号' context={'请输入'} setContext={
        (arg) => {
          let t_o = o
          t_o.account = arg
          setO(t_o)
        }
      } />
      <ED title='密码' context={'请输入'} setContext={
        (arg) => {
          let t_o = o
          t_o.password = arg
          setO(t_o)
        }
      } />
      <ED title='身份' context={'请输入'} setContext={
        (arg: string) => {
          let t_o = o
          t_o.status = arg
          setO(t_o)
        }} />
      <ED title='电话' context={'请输入'} setContext={
        (arg: string) => {
          let t_o = o
          t_o.phone = arg
          setO(t_o)
        }} />
      <ED title='姓名' context={'请输入'} setContext={
        (arg: string) => {
          let t_o = o
          t_o.name = arg
          setO(t_o)
        }} />
      <Button variant="primary" onClick={async () => {
        const url = '/schoolmatch/managerInfo/add'
        const res: API = await axiosInstance.post(url, o, {
          headers: {
            Authorization: globalData.token,
          }
        })
        redirectAuth(res.code, router)
        console.log(res)
      }}>添加</Button>
    </div>
  )
}
export default Event

