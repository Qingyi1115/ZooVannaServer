import { compareDates } from "./others";
import getAugumentedDataset from "./holtwinters";

export function predictNextDate(dates:Date[]):Date|void{
    if (dates.length <= 1) return;
    let intervals :number[] = []
    for (let i =dates.length -1; i >0 ; i--) {
        intervals.push(
            compareDates(dates[i-1], dates[i])/(1000 * 60 * 60* 24)
        )
    }
    if (dates.length>10){
        const results = (getAugumentedDataset(intervals, 1)as any) ["augumentedDataset"];
        return new Date(dates[0].getTime() + results[results.length - 1] * 1000 * 60 * 60* 24);
    }else{
        let average = 0
        for (const i in intervals){
            average = average + (i as any)/intervals.length
        }
        return new Date(dates[0].getTime() + average * 1000 * 60 * 60* 24);
    }
}