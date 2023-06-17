export interface sponsor {
  sponsorPlan: sponsorPlan;
  userTableDTO: userTableDto;
}

export interface sponsorPlan {
  sponPlanId: string;
  sponsorId: string;
  advertising: string;
  prize: string;
  money: string;
  picture: string;
}

export interface userTableDto {
  nickName: string;
  phone: string;
  name: string;
}
