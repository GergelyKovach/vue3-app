/*
this file is the OOP implemetation of the timer plugin
*/

/*
the old implemetation had a lot of code duplication

these are the old parameters
let dummyTimer = {
    progressValue: 0,
    countdownFrom: 0, // seconds
    countdownFromFormatted: '',
    timeLeftCounter: 0,
    timeLeftFormatted: '',
    timeSpent: 0,
    timeSpentFormatted: '',
    percentageLeft: 100,
    interval: {},
    finished: false
}

And these are the old methods for th timer

formatTime(date) {
            let hours = date.getUTCHours()
            // if hour is 0 we need to display 00
            // if hour is 1 to 9 we need to display 01 to 09
            if (hours < 10) {
                hours = `0${hours}`
            }
            let minutes = date.getUTCMinutes()
            if (minutes < 10) {
                minutes = `0${minutes}`
            }

            let seconds = date.getUTCSeconds()
            if (seconds < 10) {
                seconds = `0${seconds}`
            }

            return `${hours}:${minutes}:${seconds}`
        },
        setIntervalProcess(parameters) {
            this.timer = { ...this.timer, ...parameters }
            // let addedTimer = this.timers[length - 1]
            // make this unique
            // addedTimer.countdownFrom = this.toGo
            // addedTimer.timeSpent = this.passed
            // get the last element of the array
            return this.timer
        },
        playTimer(timer) {
            // this.timeSpent = 0
            if (timer.timeSpent > 0) {
                timer.timeLeftCounter = timer.countdownFrom - timer.timeSpent
            } else {
                timer.timeLeftCounter = timer.countdownFrom
            }
            // timer.timeLeftCounter = timer.countdownFrom
            timer.interval = setInterval(() => {

                // here we make a countdown timer from countdown seconds
                timer.timeLeftCounter -= 1
                timer.timeSpent += 1
                // we need to represent the time in a string format hour:minute:second
                // to convert seconds to hour:minute:second in js we can use the Date object
                // we need to convert the seconds to milliseconds
                let dateToGo = new Date(timer.timeLeftCounter * 1000)
                let dateSpent = new Date(timer.timeSpent * 1000)
                // we need to get the hour, minute and second from the date object

                timer.timeLeftFormatted = this.formatTime(dateToGo)
                timer.progressValue = (timer.timeLeftCounter / timer.countdownFrom) * 100
                // round to integers
                timer.percentageLeft = 100 - Math.round(timer.progressValue)
                // we need to display the time spent in the timer hour:minute:second
                timer.timeSpentFormatted = this.formatTime(dateSpent)
                timer.countdownFromFormatted = this.formatTime(new Date(timer.countdownFrom * 1000))
                timer.timeToCountdownFromCounterFormatted = this.formatTime(new Date(timer.timeLeftCounter * 1000))
                if (timer.timeLeftCounter === 0) {
                    timer.finished = true
                    clearInterval(timer.interval)
                }


            }, 1000)
        },
        togglePauseContinue(timer) {
            if (timer.interval) {
                clearInterval(timer.interval)
                timer.interval = null
            } else {
                this.playTimer(timer)
            }

            if (timer.finished) {
                clearInterval(timer.interval)
                timer.finished = false
                let currentTimer = this.setIntervalProcess({
                    countdownFrom: this.toGo,
                    timeLeftCounter: this.toGo - this.passed,
                    timeSpent: this.passed
                })
                console.log(this.timer)
                this.playTimer(currentTimer)
            }
        },
        startFresh() {
            let currentTimer = this.setIntervalProcess({
                countdownFrom: this.toGo,
                timeLeftCounter: this.toGo - this.passed,
                timeSpent: this.passed
            })
            // console.log(this.timer)
            // this.playTimer(currentTimer)
        }
        

*/

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//new Timer OOP
class Timer {
    private _timer: number;
    private _callback: Function;

    /*
    based on this

    let dummyTimer = {
        progressValue: 0,
        countdownFrom: 0, // seconds
        countdownFromFormatted: '',
        timeLeftCounter: 0,
        timeLeftFormatted: '',
        timeSpent: 0,
        timeSpentFormatted: '',
        percentageLeft: 100,
        interval: {},
        finished: false
    }
    */

    private uuid: string;
    private progressValue: number;
    private countdownFrom: number;
    private countdownFromFormatted: string;
    private timeLeftCounter: number;
    private timeLeftFormatted: string;
    private timeSpent: number;
    private timeSpentFormatted: string;
    private percentageLeft: number;
    private interval: Object;
    private finished: boolean;
    private timeToCountdownFromCounterFormatted: string;

    constructor(parameters: Object) {
        this.uuid = uuidv4()
        this.progressValue = 0;
        this.countdownFrom = 0;
        this.countdownFromFormatted = '';
        this.timeLeftCounter = 0;
        this.timeLeftFormatted = '';
        this.timeSpent = 0;
        this.timeSpentFormatted = '';
        this.percentageLeft = 100;
        this.interval = {};
        this.finished = false;
        this.timeToCountdownFromCounterFormatted = '';

        // overwrite the default values with the parameters
        for (let key in parameters) {
            this[key] = parameters[key];
        }
        
        this.formatAfterIncrement()

    }

    private formatTime(date: Date) {
        // define types
        let hours: number;
        let minutes: number;
        let seconds: number;

        let hoursString: string;
        let minutesString: string;
        let secondsString: string;

        hoursString = '00'
        minutesString = '00'
        secondsString = '00'


        hours = date.getUTCHours()
        // if hour is 0 we need to display 00
        // if hour is 1 to 9 we need to display 01 to 09
        if (hours < 10) {
            hoursString = `0${hours}`
        }else{
            hoursString = `${hours}`
        }
        minutes = date.getUTCMinutes()
        if (minutes < 10) {
            minutesString = `0${minutes}`
        }else{
            minutesString = `${minutes}`
        }

        seconds = date.getUTCSeconds()
        if (seconds < 10) {
            secondsString = `0${seconds}`
        }else{
            secondsString = `${seconds}`
        }

        return `${hoursString}:${minutesString}:${secondsString}`
    }
    
    public incrementTimeSpent() {
        this.timeSpent += 1
        this.timeLeftCounter -= 1
    }

    public formatAfterIncrement() {
        let dateToGo = new Date(this.timeLeftCounter * 1000);
        let dateSpent = new Date(this.timeSpent * 1000);
        // we need to get the hour, minute and second from the date object

        this.timeLeftFormatted = this.formatTime(dateToGo);
        this.progressValue = (this.timeLeftCounter / this.countdownFrom) * 100;
        // round to integers
        this.percentageLeft = 100 - Math.round(this.progressValue);
        // we need to display the time spent in the timer hour:minute:second
        this.timeSpentFormatted = this.formatTime(dateSpent);
        this.countdownFromFormatted = this.formatTime(new Date(this.countdownFrom * 1000));
        this.timeToCountdownFromCounterFormatted = this.formatTime(new Date(this.timeLeftCounter * 1000));
    }
    
    public playTimer() {
        if(typeof this.interval == 'number') {
            return clearInterval(this.interval)
            // return clearInterval(this.interval)
        }
        this.interval = setInterval(() => {
            // console.log(this.timeSpent, this.timeLeftCounter)
            this.incrementTimeSpent();
            // console.log(this.timeSpent, this.timeLeftCounter)
            this.formatAfterIncrement();
            // console.log(this.timeSpent, this.timeLeftCounter)
            
            console.log(this.timeLeftFormatted);
            if (this.timeLeftCounter === 0) {
                this.finished = true;
                clearInterval(this.interval);
            }
        }, 1000);

    }
    
    public pauseTimer() {
        clearInterval(this.interval);
        this.interval = {}
    }
    
    public continueTimer() {
        this.playTimer();
    }

    public startFresh() {
        let currentTimer = this.setIntervalProcess({
            countdownFrom: this.toGo,
            timeLeftCounter: this.toGo - this.passed,
            timeSpent: this.passed
        });
        // console.log(this.timer)
        // this.playTimer(currentTimer)
    }

    public setIntervalProcess(parameters: Object) {
        for (let key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                this[key] = parameters[key];
            }
        }
    }

}

export default Timer;