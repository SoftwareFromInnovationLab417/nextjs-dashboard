import OffCanvas from "@components/offCanvas";
import { AdminLayout } from "@layout";
import { EventDto } from "@models/dto";
import { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Table } from "react-bootstrap";
import axiosInstance from "src/axiosInstance";
import { GlobalContext } from "src/globalData";

const Event: NextPage = () => {
  const { globalData, setGlobalData } = useContext(GlobalContext)

  const [events, setEvents] = useState<EventDto[]>([])
  const [revents, setRevents] = useState<any[]>([])

  const [showDetail, setShowDetail] = useState(false)
  const [showIdx, setShowIdx] = useState(0)

  useEffect(() => {
    async function init() {
      const url = '/match/search'
      const params = { page: '0', size: '10' }
      const res = await axiosInstance.get(`${url}?${new URLSearchParams(params)}`, {
        headers: {
          Authorization: globalData.token
        }
      })
      const evs: any[] = res.data
      setRevents(evs)
      const d_e: EventDto[] = []
      evs.map((e) => {
        d_e.push({
          status: e.matchStatus,
          matchName: e.matchName,
          startTime: e.startTime,
          endTime: e.endTime,
          picture: e.picture,
          sponsorName: e.sponsorName ? e.sponsorName : null,
        })
      })

      setEvents(d_e)
    }
    init()
  }, [globalData])

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
                  <tr key={idx} onClick={() => setShowDetail(!showDetail)}>
                    <td>{idx + 1}</td>
                    <td>{e.matchName}</td>
                    <td>{e.sponsorName}</td>
                    <td>{e.status}</td>
                    <td>{e.startTime}</td>
                    <td>{e.endTime}</td>
                    <td>{e.picture}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <OffCanvas name="查看赛事详细信息" show={showDetail} onHide={setShowDetail} placement="start">
        <div>
          <DetailForm data={revents[showIdx]} />
          {/* <Button onClick={() => setShowIdx(showIdx + 1)}>Click</Button> */}
        </div>
      </OffCanvas>
    </AdminLayout>
  )
}

interface DetailRaw {
  data: any
}

function DetailForm({ data }: DetailRaw) {
  return (
    <div>
      <DE title='赛事信息' context={null} />
      <DE title='赛事状态' context={data.matchStatus} />
      <DE title='赛事名称' context={data.matchName} />
      <DE title='开始时间' context={data.startTime} />
      <DE title='结束时间' context={data.endTime} />
      <DE title='图片地址' context={data.picture} />
      <DE title='赛事介绍' context={data.introduction} />
      <DE title='赛事标签' context={data.tag} />
      {
        data.organizer && <div>
          <DE title='主办方信息' context={null} />
          <DE title='昵称' context={data.organizer.nickname} />
          <DE title='电话号码' context={data.organizer.phone} />
        </div>
      }
      {
        data.sponsor && <>
          <DE title='赞助商信息' context={null} />
          <DE title='昵称' context={data.sponsor.nickName} />
          <DE title='电话号码' context={data.sponsor.phone} />
        </>
      }
      {
        data.sponsorPlan && <>
          <DE title='赞助计划' context={null} />
          <DE title='广告词' context={data.sponsorPlan.advertising} />
          <DE title='奖品' context={data.sponsorPlan.prize} />
          <DE title='金额' context={data.sponsorPlan.money} />
          <DE title='图片地址' context={data.sponsorPlan.picture} />
        </>
      }
      {
        data.stadium && <>
          <DE title='场馆' context={null} />
          <DE title='所属楼栋' context={data.stadium.building} />
          <DE title='具体编号' context={data.stadium.number} />
          <DE title='场馆设备' context={data.stadium.equipment} />
        </>
      }
      {
        data.auditor && <>
          <DE title='审核人' context={null} />
          <DE title='电话号码' context={data.auditor.phone} />
          <DE title='真实姓名' context={data.auditor.name} />
        </>
      }
    </div>
  )
}

interface DetailProp {
  title: string,
  context: any,
}

function DE({ title, context }: DetailProp) {
  return (
    <div>
      {context ?
        <>
          <span>{title}</span>
          <p>{context}</p>
        </> :
        <Alert variant='primary'>
          {title}
        </Alert>
      }
    </div>
  )
}

export default Event