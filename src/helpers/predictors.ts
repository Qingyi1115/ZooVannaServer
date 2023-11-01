import { compareDates } from "./others";
import getAugumentedDataset from "./holtwinters";
import { DAY_IN_MILLISECONDS } from "./staticValues";

export function predictNextDate(dates:Date[]):number|void{
    if (dates.length <= 1) return;
    let dateSorted = dates.sort((a,b)=>compareDates(b, a));
    let intervals :number[] = []
    for (let i =dateSorted.length -1; i >0 ; i--) {
        intervals.push(
            compareDates(dateSorted[i-1], dateSorted[i])/ DAY_IN_MILLISECONDS
        )
    }
    if (dateSorted.length>7){
        const results = (getAugumentedDataset(intervals, 1)as any) ["augumentedDataset"];
        return dateSorted[0].getTime() + results[results.length - 1] * DAY_IN_MILLISECONDS;
    }else{
        let average = 0
        for (const i in intervals){
            average = average + (i as any)/intervals.length
        }
        return (dateSorted[0].getTime() + average * DAY_IN_MILLISECONDS);
    }
}

export function predictCycleLength(dates:Date[], predictionLength:number){
    if (dates.length <= 1) return;
    let dateSorted = dates.sort((a,b)=>compareDates(b, a));
    let intervals :number[] = []
    for (let i =dateSorted.length -1; i >0 ; i--) {
        intervals.push(
            compareDates(dateSorted[i-1], dateSorted[i]) / DAY_IN_MILLISECONDS
        )
    }

    if (dateSorted.length>7){
        let results : number[] = (getAugumentedDataset(intervals, predictionLength)as any) ["augumentedDataset"];
        results.reverse()
        results = results.map(no => Math.max(no, 0))
        
        const dateResults = dateSorted.slice(0, dateSorted.length-1);
        let newDateResults : Date[] = []
        for (let i = predictionLength - 1; i >= 0; i--) {
            if (newDateResults.length){
                newDateResults.unshift(new Date(newDateResults[0].getTime() + results[i] * DAY_IN_MILLISECONDS ))
                // console.log(newDateResults, results, i, 
                //     results[i] , 
                //     newDateResults[0].getTime(), 
                //     newDateResults[0].getTime() + results[i] * DAY_IN_MILLISECONDS, 
                //     new Date(newDateResults[0].getTime() + results[i] * DAY_IN_MILLISECONDS ))
            }else{
                newDateResults.unshift(new Date(dateResults[0].getTime() + results[i] * DAY_IN_MILLISECONDS ))
            }
        };
        
        return {
            dateResults: dateResults.map(date=>date.getTime()), 
            cycleLength: results.slice(predictionLength),
            newDateResults: newDateResults.map(date=>date.getTime()), 
            newCycleLength: results.slice(0, predictionLength),
        };
    }else{
        let average = 0
        for (const i in intervals){
            average = average + (i as any)/intervals.length
        }
        const dateResults = dateSorted.splice(0, dateSorted.length-1);
        intervals = intervals.reverse()

        let newDateResults = []
        let newIntervals = []
        for (let i = 0; i < predictionLength; i++) {
            newDateResults.unshift(new Date(dateResults[0].getTime() + average * DAY_IN_MILLISECONDS ))
            newIntervals.unshift(average)
        };

        return {
            dateResults: dateResults.map(date=>date.getTime()), 
            cycleLength: intervals,
            newDateResults: newDateResults.map(date=>date.getTime()), 
            newCycleLength: newIntervals,
        };
    }
}