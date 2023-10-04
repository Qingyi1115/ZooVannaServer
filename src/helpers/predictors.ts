import { compareDates } from "./others";
import getAugumentedDataset from "./holtwinters";

const MS_TO_DAYS = 1000 * 60 * 60* 24

export function predictNextDate(dates:Date[]):Date|void{
    if (dates.length <= 1) return;
    let dateSorted = dates.sort((a,b)=>compareDates(b, a));
    let intervals :number[] = []
    for (let i =dateSorted.length -1; i >0 ; i--) {
        intervals.push(
            compareDates(dateSorted[i-1], dateSorted[i])/ MS_TO_DAYS
        )
    }
    if (dateSorted.length>7){
        const results = (getAugumentedDataset(intervals, 1)as any) ["augumentedDataset"];
        return new Date(dateSorted[0].getTime() + results[results.length - 1] * MS_TO_DAYS);
    }else{
        let average = 0
        for (const i in intervals){
            average = average + (i as any)/intervals.length
        }
        return new Date(dateSorted[0].getTime() + average * MS_TO_DAYS);
    }
}

export function predictCycleLength(dates:Date[], predictionLength:number){
    if (dates.length <= 1) return;
    let dateSorted = dates.sort((a,b)=>compareDates(b, a));
    let intervals :number[] = []
    for (let i =dateSorted.length -1; i >0 ; i--) {
        intervals.push(
            compareDates(dateSorted[i-1], dateSorted[i]) / MS_TO_DAYS
        )
    }
    console.log("dateSorted", dateSorted)

    if (dateSorted.length>7){
        console.log("Holt winters used")
        let results : number[] = (getAugumentedDataset(intervals, predictionLength)as any) ["augumentedDataset"];
        results.reverse()
        results = results.map(no => Math.max(no, 0))
        
        const dateResults = dateSorted.slice(0, dateSorted.length-1);
        let newDateResults : Date[] = []
        for (let i = predictionLength - 1; i >= 0; i--) {
            if (newDateResults.length){
                newDateResults.unshift(new Date(newDateResults[0].getTime() + results[i] * MS_TO_DAYS ))
                // console.log(newDateResults, results, i, 
                //     results[i] , 
                //     newDateResults[0].getTime(), 
                //     newDateResults[0].getTime() + results[i] * MS_TO_DAYS, 
                //     new Date(newDateResults[0].getTime() + results[i] * MS_TO_DAYS ))
            }else{
                newDateResults.unshift(new Date(dateResults[0].getTime() + results[i] * MS_TO_DAYS ))
            }
        };
        
        return {
            dateResults: dateResults, 
            cycleLength: results.slice(predictionLength),
            newDateResults: newDateResults, 
            newCycleLength: results.slice(0, predictionLength),
        };
    }else{
        console.log("average used")
        let average = 0
        for (const i in intervals){
            average = average + (i as any)/intervals.length
        }
        const dateResults = dateSorted.splice(0, dateSorted.length-1);
        intervals = intervals.reverse()

        let newDateResults = []
        let newIntervals = []
        for (let i = 0; i < predictionLength; i++) {
            newDateResults.unshift(new Date(dateResults[0].getTime() + average * MS_TO_DAYS ))
            newIntervals.unshift(average)
        };

        return {
            dateResults: dateResults, 
            cycleLength: intervals,
            newDateResults: newDateResults, 
            newCycleLength: newIntervals,
        };
    }
}