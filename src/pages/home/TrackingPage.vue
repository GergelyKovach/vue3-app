<template>

    <v-container fluid>
        <v-row>
            <v-col class="mt-10 mb-10">
                <h2 class="text-center">Break</h2>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col>

                <div class="text-center">
                    <v-progress-circular :rotate="360" :size="500" :width="15" :model-value="timer.progressValue"
                        color="black" class="circular-times">
                        <v-container>
                            <v-row>
                                <v-col>
                                    {{ timer.percentageLeft }}% done
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <div class="formatted-time">{{ timer.timeLeftFormatted }}</div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    {{ timer.timeSpentFormatted }} / {{ timer.countdownFromFormatted }}
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-progress-circular>
                </div>
            </v-col>

        </v-row>
        <v-row>
            <v-col class="mt-10 mb-10">
                <!-- we need 3 buttons: fullscreen exit, play/pause, done checkmark -->
                <div class="text-center">
                    <!-- big buttons with no border -->
                    <v-btn icon :plain="true" class="mr-5 fullscreen-control-button" width="5rem" elevation="0">
                        <v-icon>mdi-fullscreen-exit</v-icon>
                    </v-btn>
                    <v-btn icon :plain="1" class="mr-5 fullscreen-control-button" width="5rem" elevation="0"
                        @click="togglePauseContinue(timer)">
                        <v-icon>mdi-play</v-icon>
                    </v-btn>
                    <v-btn icon :plain="1" class="mr-5 fullscreen-control-button" width="5rem" elevation="0">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>


<script lang="ts">

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

export default {
    data() {
        return {
            toGo: 188,
            passed: 29,
            timer: { ...dummyTimer }
        }
    },
    // beforeDestroy() {
    //     clearInterval(this.interval)
    // },
    methods: {
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

    },
    mounted() {
        // this.timerpop()
        this.startFresh()
    },
}
</script>

<style scoped>
.v-progress-circular {
    margin: 0.5rem;
}

.formatted-time {
    font-size: 6rem;
}

/*make it centered*/
.circular-timer {
    display: flex;
    justify-content: center;
    align-items: center;
}

.fullscreen-control-button {
    font-size: 3rem;
}
</style>