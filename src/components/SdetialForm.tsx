import { sponsor } from "@models/sponsorPlan";
import { Alert, Image } from "react-bootstrap";

interface DetailProps {
  data: sponsor;
}

function DetailForm({ data }: DetailProps) {
  return (
    <div>
      <DE title='赞助信息' context={null} />
      <DE title='赞助商名称' context={data.userTableDTO.nickName} />
      <DE title='赞助商电话' context={data.userTableDTO.phone} />
      <DE title='广告词' context={data.sponsorPlan.advertising} />
      <DE title='奖品' context={data.sponsorPlan.prize} />
      <DE title='金额' context={data.sponsorPlan.money} />
      <DE title='图片' context={' '} />
      <div style={{ height: '0h', width: '20vw', margin: '10px 0' }}>
        <Image src={`${data.sponsorPlan.picture}`} alt="pic" fluid />
      </div>
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