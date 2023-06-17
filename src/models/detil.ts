export interface Organizer {
  nickName: string;
  phone: string;
}

export interface Sponsor {
  nickName: string;
  phone: string;
}

export interface SponsorPlan {
  advertising: string;
  prize: string;
  money: string;
  picture: string;
}

export interface Stadium {
  building: string;
  number: string;
  equipment: string;
}

export interface Auditor {
  phone: string;
  name: string;
}

export interface Detail {
  matchStatus: string;
  matchName: string;
  startTime: string;
  endTime: string;
  picture: string;
  introduction: string;
  tag: string;
  // empty object allowed
  organizer?: Organizer;
  sponsor?: Sponsor;
  sponsorPlan?: SponsorPlan;
  stadium?: Stadium;
  auditor?: Auditor;
  // empty id allowed
  matchId?: number;
  organizersId?: number;
  sponsorId?: number;
  sponPlanId?: number;
  placeId?: number;
  status?: number;
  auditorId?: number;
}

export function mapMatchStatus(status: string): string {
  switch (status) {
    case '0':
      return '创建未批'
      break;
    case '1':
      return '批准'
      break;
    case '2':
      return '未举办'
      break;
    case '3':
      return '举办中'
      break;
    case '4':
      return '结束'
      break;
    default:
      return ''
  }
}