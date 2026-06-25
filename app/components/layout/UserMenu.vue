<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const auth = useAuthStore()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

onClickOutside(root, () => (open.value = false))

const initials = computed(() =>
  (auth.user?.fullName ?? '?')
    .split(' ')
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)

async function onLogout() {
  open.value = false
  await auth.logout()
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="flex items-center gap-2 rounded-lg border border-border-base py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-surface-muted"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="open = !open"
    >
      <span class="flex h-7 w-7 items-center justify-center rounded-md bg-brand-100 text-xs font-bold text-brand-600">
        {{ initials }}
      </span>
      <span class="hidden max-w-28 truncate text-sm font-medium text-text-base sm:inline">
        {{ auth.user?.fullName }}
      </span>
      <Icon name="lucide:chevron-down" class="text-text-muted" />
    </button>

    <Transition
      enter-active-class="transition duration-150"
      enter-from-class="opacity-0 translate-y-1"
      leave-active-class="transition duration-100"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="open"
        class="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border-base bg-surface-card shadow-lg"
        role="menu"
      >
        <div class="border-b border-border-base px-4 py-3">
          <p class="truncate text-sm font-semibold text-text-strong">{{ auth.user?.fullName }}</p>
          <p class="truncate text-xs text-text-muted">{{ auth.user?.email }}</p>
        </div>
        <nav class="p-1.5">
          <NuxtLink
            :to="localePath('/dashboard')"
            class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-base hover:bg-surface-muted"
            role="menuitem"
            @click="open = false"
          >
            <Icon name="lucide:map-pin" class="text-text-muted" /> {{ t('nav.dashboard') }}
          </NuxtLink>
          <NuxtLink
            v-if="auth.isAdmin"
            :to="localePath('/admin')"
            class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-base hover:bg-surface-muted"
            role="menuitem"
            @click="open = false"
          >
            <Icon name="lucide:shield" class="text-text-muted" /> {{ t('nav.admin') }}
          </NuxtLink>
          <button
            type="button"
            class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-error-600 hover:bg-error-50"
            role="menuitem"
            @click="onLogout"
          >
            <Icon name="lucide:log-out" /> {{ t('nav.logout') }}
          </button>
        </nav>
      </div>
    </Transition>
  </div>
</template>
