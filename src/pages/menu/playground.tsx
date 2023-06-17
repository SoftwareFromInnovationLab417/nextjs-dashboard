
import { AdminLayout } from "@layout";
import { API } from "@models/api";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Card, Table, Pagination } from "react-bootstrap";
import axiosInstance, { redirectAuth } from "src/axiosInstance";
import { GlobalContext } from "src/globalData";

interface Playground {
  building: string;
  equipment: string;
  stadiumId: string;
  typeName: string;
  number: string;
}

const Event: NextPage = () => {
  const router = useRouter()
  const { globalData, setGlobalData } = useContext(GlobalContext)

  const [events, setEvents] = useState<Playground[]>([])

  const [curPageIdx, setCurPageIdx] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  // reload the table list
  const reloadTable = async (page: number) => {
    console.log('page: ' + page)
    const url = `/match/stadium/searchall`
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
    const d_e: Playground[] = []

    // assign value
    if (evs && evs.length !== 0)
      evs.map((e) => {
        d_e.push(e);
      })

    // set dto
    setEvents(d_e)

    return true
  }

  useEffect(() => {
    reloadTable(curPageIdx)
  }, [globalData, router])

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
                <th>类别</th>
                <th>楼栋</th>
                <th>设备</th>
                <th>房间号</th>
              </tr>
            </thead>
            <tbody>
              {events && events.map((e, idx) => {
                return (
                  <tr key={idx} >
                    <td>{idx + 1}</td>
                    <td>{e.typeName}</td>
                    <td>{e.building}</td>
                    <td>{e.equipment}</td>
                    <td>{e.number}</td>
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
    </AdminLayout>
  )
}
export default Event

