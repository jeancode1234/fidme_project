import { defineStore } from 'pinia'
import type { Address } from '~/types'

/** Gestion des adresses de l'utilisateur courant (CRUD, §2.2). */
export const useAddressesStore = defineStore('addresses', () => {
  const items = ref<Address[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref('')
  const max = ref(4)

  const count = computed(() => items.value.length)
  const canCreate = computed(() => count.value < max.value)

  async function fetchAll(force = false) {
    if (loaded.value && !force) return
    const { $api } = useNuxtApp()
    loading.value = true
    error.value = ''
    try {
      const res = await $api<{ items: Address[]; count: number; max: number }>('/addresses')
      items.value = res.items
      max.value = res.max
      loaded.value = true
    } catch (err) {
      error.value = parseApiError(err).message
    } finally {
      loading.value = false
    }
  }

  function getById(id: string) {
    return items.value.find((a) => a.id === id) ?? null
  }

  async function fetchOne(id: string) {
    const cached = getById(id)
    if (cached) return cached
    const { $api } = useNuxtApp()
    const res = await $api<{ address: Address }>(`/addresses/${id}`)
    return res.address
  }

  async function create(payload: Partial<Address>) {
    const { $api } = useNuxtApp()
    const res = await $api<{ address: Address }>('/addresses', { method: 'POST', body: payload })
    items.value.unshift(res.address)
    return res.address
  }

  async function update(id: string, payload: Partial<Address>) {
    const { $api } = useNuxtApp()
    const res = await $api<{ address: Address }>(`/addresses/${id}`, { method: 'PUT', body: payload })
    const i = items.value.findIndex((a) => a.id === id)
    if (i !== -1) items.value[i] = res.address
    return res.address
  }

  async function remove(id: string) {
    const { $api } = useNuxtApp()
    await $api(`/addresses/${id}`, { method: 'DELETE' })
    items.value = items.value.filter((a) => a.id !== id)
  }

  return {
    items,
    loading,
    loaded,
    error,
    max,
    count,
    canCreate,
    fetchAll,
    getById,
    fetchOne,
    create,
    update,
    remove,
  }
})
