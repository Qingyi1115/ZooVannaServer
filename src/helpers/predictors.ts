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
        // console.log("123", dates)
        // console.log("223")
        // console.log(intervals)
        const results = (getAugumentedDataset(intervals, 1)as any) ["augumentedDataset"];
        // console.log("333")
        // console.log(results)
        // console.log(results[results.length - 1])
        // console.log(dates[0].getTime())
        return new Date(dates[0].getTime() + results[results.length - 1] * 1000 * 60 * 60* 24);
    }else{
        let average = 0
        for (const i in intervals){
            average = average + (i as any)/intervals.length
        }
        return new Date(dates[0].getTime() + average * 1000 * 60 * 60* 24);
    }
}


// OUTPUT:
// {
// augumentedDataset: [1, 4, 5, 3, 1, 3, 4, 1, 2, 4, 5, 5, 1.3338017069503336, 2.9451723210706824, 5.691675635182751, 6.721827583201698],
// alpha: 0.1,
// beta: 1,
// gamma: 0.4,
// period: 5,
// mse: 2.0945071482039226,
// sse: 14.661550037427457,
// mpe: 0.06217855085131068
// }