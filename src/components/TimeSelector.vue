<template>
    <div>
        <!-- this component is for selecting hour, minute and seconds then returning the amount in seconds -->
        <v-row>
            <v-col cols="4">
                <VueScrollPicker :options="hoursOptions()" v-model="hours" />
            </v-col>
            <v-col cols="4">
                <VueScrollPicker :options="mnsOptions()" v-model="minutes" />
            </v-col>
            <v-col cols="4">
                <VueScrollPicker :options="mnsOptions()" v-model="seconds" />
            </v-col>
        </v-row>
    </div>
</template>

<script>

// import 'vue-smooth-picker/dist/css/style.css'
// import Picker from 'vue-wheel-picker'
// import SmoothPicker from 'vue-smooth-picker'
import { VueScrollPicker } from 'vue-scroll-picker'

export default {
    name: 'TimeSelector',
    components: {
        // Picker,
        // SmoothPicker,
        VueScrollPicker
    },
    emits: ['update:modelValue', 'updateResult'],
    props: {
        modelValue: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            hours: 0,
            minutes: 0,
            seconds: 0,
            amountInSeconds: 0,
        }
    },
    watch: {
        modelValue: {
            handler: function (newValue) {
                this.hours = Math.floor((newValue) / 3600)
                this.minutes = Math.floor(((newValue) % 3600) / 60)
                this.seconds = Math.floor(((newValue) - (this.hours * 3600) - (this.minutes * 60)))
                // console.log(newValue)
                console.log(newValue)
                
                this.$emit('updateResult', newValue)
            },
            immediate: true
        },
        hours: {
            handler: function (newValue) {
                // console.log(newValue, this.minutes, this.seconds)
                this.$emit('update:modelValue', (newValue*3600 + this.minutes * 60 + this.seconds))
                // console.log(this.modelValue)
            }
        },
        minutes: {
            handler: function (newValue) {
                // console.log(newValue, this.hours, this.seconds)
                this.$emit('update:modelValue', (this.hours*3600 + newValue * 60 + this.seconds))
            }
        },
        seconds: {
            handler: function (newValue) {
                // console.log(newValue, this.hours, this.minutes)
                this.$emit('update:modelValue', (this.hours*3600 + this.minutes * 60 + newValue))
            }
        },
    },
    methods: {
        hoursOptions() {
            let options = []
            for (let i = 0; i < 24; i++) {
                options.push({value: i, name: i.toString().padStart(2, '0')})
            }
            return options
        },
        mnsOptions() {
            let options = []
            for (let i = 0; i < 60; i++) {
                options.push({value: i, name: i.toString().padStart(2, '0')})
            }
            return options
        },
        updateTime() {
            let amountInSeconds = this.hours * 3600 + this.minutes * 60 + this.seconds
            this.$emit('update:modelValue', seconds)
        }
    } 
}

</script>

<style src="vue-scroll-picker/lib/style.css"></style>
