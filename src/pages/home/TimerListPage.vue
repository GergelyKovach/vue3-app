<template>

    <v-container fluid>
        <v-row>
            <v-col>
                <h3>
                    Planned
                </h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="tasks-done-per-total">
                {{ finishedTasks }}/{{ totalTasks }} task
            </v-col>
            <v-col>
                {{ nowTimeAddSumOfTimeLeft }}
            </v-col>
            <v-col>
                {{ countSumOfTimeSpentFormatted }}
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <div class="list-element" v-for="timer in timersObjs" v-bind:key="timer.uuid">
                    <!-- close section on the other 50% side, with filter blur 5px, on click the being edited toggles -->
                    <div v-if="timer.beingEdited" class="close-part-editor"  @click="timer.toggleBeingEdited()"></div>
                    <time-selector @updateResult="timer.formatAfterIncrement()" v-if="timer.beingEdited" v-model="timer.countdownFrom" class="timer-selector-placed"></time-selector>
                    <span class="top-left">05:14 pm</span>
                    <div class="task-controller">
                        <v-row>
                            
                            
                            <!-- we have a checkbox in one column
                                then in the next one right to it we have an editable name holder of the task, and below it a list of tags
                                then to the right of it we have the coundown timer total hour:minute:seconds and below it the elapsed, tracked time of this hour:minute:seconds
                                then to the right of it we have a play button to toggle continue or pause-->
                            <v-col cols="1">
                                <v-checkbox class="checkbox-finished" v-model="timer.finished" hide-details></v-checkbox>
                            </v-col>
                            <v-col>
                                <!-- make the text field that seems like a header unless you click, then it's editable -->
                                <!-- <v-text-field class="task-name" dense single-line hide-details
                                    v-model="timer.name"></v-text-field> -->
                                <input type="text" class="task-name-field" v-model="timer.name">
                                <v-chip-group>
                                    <!--make chips removable-->
                                    <v-chip v-for="tag in timer.tags" class="chip" color="primary" close="1" size="small">{{
                                        tag
                                    }}</v-chip>
                                </v-chip-group>
                            </v-col>
                            <v-col cols="2">
                                <div class="formatted-time-left" @click="timer.toggleBeingEdited()">{{ timer.timeLeftFormatted }}</div>
                                <!-- we need a component to select hour, minute and seconds and return the amount in seconds  -->
                                <!-- show when clicked the above-->
                                <div class="formatted-time-spent bold-time-spent">{{ timer.timeSpentFormatted }}</div>
                                <!-- <div class="formatted-time-spent">{{ timer.timeLeftFormatted }}</div> -->
                            </v-col>
                            <v-col cols="1">
                                <v-btn icon :plain="0" height="50px" class="mr-5 fullscreen-control-button"
                                    elevation="0" @click="playTimer(timer.uuid)"
                                    v-if="typeof timer.interval == 'object'">
                                    <v-icon>mdi-play</v-icon>
                                </v-btn>
                                <v-btn icon :plain="true" height="50px" class="mr-5 fullscreen-control-button"
                                    elevation="0" @click="pauseTimer(timer.uuid)"
                                    v-if="typeof timer.interval == 'number'">
                                    <v-icon>mdi-pause</v-icon>
                                </v-btn>
                                <!-- navigate to the TrackingPage and pass the uuid -->
                                <v-btn icon :plain="true" height="50px" class="mr-5 fullscreen-control-button"
                                    @click="navigateToFullscreen(timer.uuid)"
                                    elevation="0">
                                    <v-icon>mdi-fullscreen</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>


<script lang="ts">

import TimeSelector from '@/components/TimeSelector.vue'
//import Timer from timer.ts
import Timer from '@/models/timer'
import { store } from '@/plugins/store.js'
// import TimePicker from "nativescript"

let dummyTimer = {
    name: '',
    progressValue: 0,
    countdownFrom: 0, // seconds
    countdownFromFormatted: '00:00:00',
    timeLeftCounter: 0,
    timeLeftFormatted: '00:00:00',
    timeSpent: 0,
    timeSpentFormatted: '00:00:00',
    percentageLeft: 100,
    interval: {},
    finished: false,
    tags: []
}

export default {
    components: {
        TimeSelector
    },
    data() {
        return {
            timers: [],
            timersObjs: {},
            store
        }
    },
    methods: {
        navigateToFullscreen(uuid: string) {
            // go to /timer and pass the uuid
            this.store.selectedTimer = uuid
            this.$router.push({ path: '/timer', query: { timerUuid: uuid } })
        },
        formatTime(date) {

            // if not Date convert to Date
            if (!(date instanceof Date)) {
                date = new Date(date)
            }

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
        playTimer(uuid) {
            this.timersObjs[uuid].playTimer()
            console.log("Timer started: ", this.timersObjs[uuid])
            console.log(this.timersObjs[uuid])
        },
        pauseTimer(uuid) {
            this.timersObjs[uuid].pauseTimer()
            console.log("Timer paused: ", this.timersObjs[uuid])
            console.log(this.timersObjs[uuid])
        },
    },
    computed: {
        countSumOfTimeSpentFormatted() {
            let sum = 0
            for (let i = 0; i < this.timers.length; i++) {
                sum += this.timers[i].timeSpent
            }
            return this.formatTime(new Date(sum))
        },
        sumOfTimeLeft() {
            let sum = 0
            for (let i = 0; i < this.timers.length; i++) {
                sum += this.timers[i].timeLeftCounter
            }
            return sum
        },
        nowTimeAddSumOfTimeLeft() {
            let now = new Date()
            let sum = this.sumOfTimeLeft
            let futureTime = new Date(now.getTime() + sum)
            // return like "finishable until 05:14 pm"
            return `finishable until ${futureTime.getHours()}:${futureTime.getMinutes() < 10 ? '0' + futureTime.getMinutes() : futureTime.getMinutes()} pm`
        },
        totalTasks() {
            return this.timers.length
        },
        finishedTasks() {
            let count = 0
            for (let i = 0; i < this.timers.length; i++) {
                if (this.timers[i].finished) {
                    count++
                }
            }
            return count
        },
        allTimers() {
            /*we need to get all values from timerObj*/
            return Object.values(this.timersObjs)
        }
    },
    watch: {
        // we have to update the store when timers change
        timersObjs: {
            handler: function (val, oldVal) {
                this.store.timerObjs = val
            },
            deep: true
        }
    },
    mounted() {
        // create 15 random timers
        // if no timers in store
        if (this.store.timers.length == 0) {
            console.log(this.store)
            console.log(this.store.timers)
            console.log(this.store.timers.length)
            console.log("No timers in store, creating 15 random timers")
            for (let i = 0; i < 15; i++) {
                let timer = Object.assign({}, dummyTimer)
                timer.name = 'Task ' + i
                timer.countdownFrom = Math.floor(Math.random() * 1000)
                timer.countdownFromFormatted = this.formatTime(timer.countdownFrom)
                timer.timeSpent = Math.floor(Math.random() * 100)
                timer.timeSpentFormatted = this.formatTime(timer.timeSpent)
                timer.timeLeftCounter = timer.countdownFrom - timer.timeSpent
                timer.timeLeftFormatted = this.formatTime(timer.timeLeftCounter)
                timer.percentageLeft = 100
                timer.interval = {}
                // randomize if timer is finished
                timer.finished = Math.random() >= 0.5
                // choose 1 to 5 from a list of tags
                let dummyTags = ['Personal', 'Training', 'Development', 'Work', 'Home', 'Family', 'Friends', 'Hobby', 'Sport', 'Health', 'Food', 'Sleep', 'Relax', 'Fun', 'Study', 'Reading', 'Writing', 'Coding', 'Design', 'Music', 'Art', 'Travel', 'Shopping', 'Cleaning', 'Cooking', 'Gardening', 'Baking', 'Painting', 'Drawing', 'Singing', 'Dancing', 'Swimming', 'Running', 'Cycling', 'Walking', 'Hiking', 'Climbing', 'Yoga', 'Meditation', 'Gaming', 'TV', 'Movies', 'Series', 'Netflix', 'Hulu', 'Amazon', 'Disney', 'Apple', 'Spotify', 'Youtube', 'TikTok', 'Instagram', 'Facebook', 'Twitter', 'Snapchat', 'WhatsApp', 'Telegram', 'Discord', 'Skype', 'Zoom', 'Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Twitter', 'Snapchat', 'WhatsApp', 'Telegram', 'Discord', 'Skype', 'Zoom', 'Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Twitter', 'Snapchat', 'WhatsApp', 'Telegram', 'Discord', 'Skype', 'Zoom', 'Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Twitter', 'Snapchat', 'WhatsApp', 'Telegram', 'Discord', 'Skype', 'Zoom', 'Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Twitter', 'Snapchat', 'WhatsApp', 'Telegram', 'Discord', 'Skype', 'Zoom', 'Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Twitter', 'Snapchat', 'WhatsApp', 'Telegram', 'Discord', 'Skype', 'Zoom', 'Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Twitter', 'Snapchat', 'WhatsApp', 'Telegram', 'Discord', 'Skype', 'Zoom', 'Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Twitter', 'Snapchat', 'WhatsApp', 'Telegram', 'Discord', 'Skype', 'Zoom', 'Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Twitter', 'Snapchat']
                timer.tags = dummyTags.filter(() => Math.random() >= 0.5).slice(0, Math.floor(Math.random() * 5) + 1)
                let timerObj = new Timer(timer)
                timer.obj = timerObj
                console.log(timerObj)
                this.timers.push(timer)
                // this.timersObjs.push(timerObj)
                this.timersObjs[timerObj.uuid] = timerObj

                // console.log(timer.countdownFrom)
            }

            // add timers to store
            this.store.timers = this.timers

            // if timers in store
        }
        else {
            for (let i = 0; i < this.store.timers.length; i++) {
                // let timer = this.store.timers[i]
                // let timerObj = new Timer(timer)
                // timer.obj = timerObj
                // this.timers.push(timer)
                this.timersObjs = this.store.timerObjs
                // this.timersObjs[timerObj.uuid] = timerObj
            }
        }
    }
}
</script>

<style scoped>
.task-name {
    border: none;
}

.timer-selector-placed{
    /* we need to make it 50% wide, 100% height and place it aligned to the right */
    position: absolute;
    right: 0;
    top: auto;
    width: 50%;
    height: 100%;
    background-color: white;
    z-index: 100;
    border: 1px solid #ccc;
    /* place the internal content vertically aligned */
    display: flex;
    /* flex-direction: column; */
    justify-content: center;
    align-items: center;
    /* make the internal content 100% wide */
}
/* set the internal content to be 100% width and height */
.timer-selector-placed > * {
  width: 100%;
  height: 100%;
}

.close-part-editor {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(209, 143, 45, 0.562);
    /* make a fancy blur underneath */
    backdrop-filter: blur(1px);
    z-index: 100;
    border: 1px solid #ccc;
}

.list-element {
    position: relative;
    overflow: hidden;
    border: 1px solid #ccc;
    border-radius: 5px;
    /* padding: 10px; */
    margin-bottom: 10px;
}

.bold-time-spent {
    font-weight: bold;
}

.task-name-field {
    font-family: 'Inter';
    font-style: normal;
    font-size: 16px;
    line-height: 150%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    /* background: red; */
    height: 40px;
}

</style>