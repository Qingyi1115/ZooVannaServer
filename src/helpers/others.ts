export function uppercaseFirst(str: string) {
  return `${str[0].toUpperCase()}${str.substr(1)}`;
}

export function compareDates(d1:Date, d2:Date):number {
  let date1 = d1.getTime();
  let date2 = d2.getTime();
  return date1-date2;
};