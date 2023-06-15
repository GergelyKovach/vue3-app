<template>

    <v-container fluid>
        <v-row>
            <v-col class="mt-10 mb-10">
                <h2 class="text-center">Timer</h2>
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
                    <v-btn icon :plain="true" height="75px" class="mr-5 fullscreen-control-button" width="5rem" elevation="0">
                        <v-icon>mdi-fullscreen-exit</v-icon>
                    </v-btn>
                    <v-btn icon :plain="0" height="75px" class="mr-5 fullscreen-control-button" width="5rem" elevation="0"
                        @click="timer.togglePauseContinue()">
                    <v-icon>mdi-play</v-icon>
                    </v-btn>
                    <v-btn icon :plain="1" height="75px" class="mr-5 fullscreen-control-button" width="5rem" elevation="0"
                        @click="timer.setFinished()">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>


<script lang="ts">

import Timer from '@/models/timer'
import { store } from '@/plugins/store.js'
import { useRoute } from 'vue-router'

let dummyTimer = {
    name: '',
    progressValue: 0,
    countdownFrom: 188, // seconds
    countdownFromFormatted: '00:00:00',
    timeLeftCounter: 0,
    timeLeftFormatted: '00:00:00',
    timeSpent: 29,
    timeSpentFormatted: '00:00:00',
    percentageLeft: 100,
    interval: {},
    finished: false,
    tags: []
}


export default {
    data() {
        return {
            toGo: 188,
            passed: 29,
            timer: Timer,
            store
        }
    },
    mounted() {
        // this.timer = this.store.timerObjs[this.timerUuid]
        console.log("#################")
        console.log(this.store.selectedTimer)
        console.log([this.$route.params.timerUuid])
        // this.timer = new Timer(dummyTimer)
        this.timer = this.store.timerObjs[this.store.selectedTimer]
        this.timer.formatAfterIncrement()
        console.log(this.timer)
        
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