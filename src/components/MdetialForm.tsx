import { Detail } from "@models/detail";
import { Alert, Image } from "react-bootstrap";

interface DetailProps {
  data: Detail;
}

function DetailForm({ data }: DetailProps) {
  console.log(data.organizer)
  return (
    <div>
      <DE title='赛事信息' context={null} />
      <DE title='赛事状态' context={data.matchStatus} />
      <DE title='赛事名称' context={data.matchName} />
      <DE title='开始时间' context={data.startTime} />
      <DE title='结束时间' context={data.endTime} />
      <DE title='图片' context={' '} />
      <div style={{ height: '0h', width: '20vw', margin: '10px 0' }}>
        <Image src={`${data.picture}`} alt="pic" fluid />
      </div>
      <DE title='赛事介绍' context={data.introduction} />
      <DE title='赛事标签' context={data.tag} />
      {
        data.organizer && <div>
          <DE title='主办方信息' context={null} />
          <DE title='昵称' context={data.organizer.nickName} />
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
          <DE title='图片地址' context={' '} />
          <div style={{ height: '0h', width: '20vw', margin: '10px 0' }}>
            <Image src={`${data.sponsorPlan.picture}`} alt="pic" fluid />
          </div>
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
  );
}

interface DEProp {
  title: string;
  context: any;
}
function DE({ title, context }: DEProp) {
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

export default DetailForm