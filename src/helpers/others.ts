import { DAY_IN_MILLISECONDS } from "./staticValues";

export function uppercaseFirst(str: string) {
  return `${str[0].toUpperCase()}${str.substr(1)}`;
}

export function compareDates(d1:Date, d2:Date):number {
  let date1 = d1.getTime();
  let date2 = d2.getTime();
  return date1-date2;
};

export function getNextDayOfWeek(date:Date, dayOfWeek:number) {
  return new Date(date.getTime() + DAY_IN_MILLISECONDS * ((dayOfWeek + 7 - date.getDay()) % 7));
};

export function getNextDayOfMonth(date:Date, dayOfMonth:number) {
  let lastDay = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
  if (lastDay.getDate() <= dayOfMonth){
    return lastDay;
  }
  if (date.getDate() <= dayOfMonth){
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), dayOfMonth));
  }
  return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, dayOfMonth));
};
