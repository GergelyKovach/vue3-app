import { reactive } from 'vue'

export const store = reactive({
  timers: [],
  timerObjs: {},
  selectedTimer: '',
})