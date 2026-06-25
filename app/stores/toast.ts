import { defineStore } from 'pinia'

type Tone = 'success' | 'error' | 'info' | 'warning'
interface Toast {
  id: number
  tone: Tone
  message: string
}

let seq = 0

export const useToastStore = defineStore('toast', () => {
  const items = ref<Toast[]>([])

  function push(tone: Tone, message: string) {
    const id = ++seq
    items.value.push({ id, tone, message })
    setTimeout(() => remove(id), 4000)
  }
  function remove(id: number) {
    items.value = items.value.filter((t) => t.id !== id)
  }

  const success = (m: string) => push('success', m)
  const error = (m: string) => push('error', m)
  const info = (m: string) => push('info', m)

  return { items, push, remove, success, error, info }
})
