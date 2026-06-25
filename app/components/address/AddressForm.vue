<script setup lang="ts">
// Import explicite : évite le conflit avec le `useStorage` serveur de Nitro
// (qui masque l'auto-import VueUse et rend la fonction indéfinie côté client).
import { useStorage } from '@vueuse/core'
import type { Address } from '~/types'

const props = defineProps<{
  mode: 'create' | 'edit'
  initial?: Partial<Address>
  loading?: boolean
  serverError?: string
  serverFields?: Record<string, string>
}>()
const emit = defineEmits<{ submit: [payload: Partial<Address>] }>()

const { t } = useI18n()
const { locate, locating, error: geoError } = useGeolocate()
const { compress } = useImageCompression()

// ── État du formulaire ───────────────────────────────────────
const form = reactive({
  country: props.initial?.country ?? 'Cameroun',
  city: props.initial?.city ?? '',
  district: props.initial?.district ?? '',
  street: props.initial?.street ?? '',
  houseNumber: props.initial?.houseNumber ?? '',
  postalCode: props.initial?.postalCode ?? '',
  lat: props.initial?.lat ?? countryCenter('Cameroun')[0],
  lng: props.initial?.lng ?? countryCenter('Cameroun')[1],
  photoUrl: props.initial?.photoUrl ?? '',
})

// Sauvegarde automatique en brouillon (création uniquement).
const draft = useStorage<typeof form | null>('findme-address-draft', null)
if (props.mode === 'create' && draft.value && !props.initial) {
  Object.assign(form, draft.value)
}
watchEffect(() => {
  if (props.mode === 'create') draft.value = { ...form }
})
const draftSavedAt = ref<number | null>(null)
watch(
  () => ({ ...form }),
  () => {
    if (props.mode === 'create') draftSavedAt.value = Date.now()
  },
  { deep: true },
)
function clearDraft() {
  draft.value = null
}
defineExpose({ clearDraft })

// ── Étapes ───────────────────────────────────────────────────
const step = ref(1)
const steps = computed(() => [t('address.step1'), t('address.step2'), t('address.step3')])
const touched = reactive<Record<string, boolean>>({})
const photoSize = ref<number | null>(props.initial?.photoUrl ? 0 : null)
const photoError = ref('')

const cities = computed(() => citiesFor(form.country))

watch(
  () => form.country,
  (c) => {
    form.city = ''
    const [lat, lng] = countryCenter(c)
    form.lat = lat
    form.lng = lng
  },
)
watch(
  () => form.city,
  (c) => {
    if (!c) return
    const [lat, lng] = cityCenter(c, form.country)
    form.lat = lat
    form.lng = lng
  },
)

// ── Validation ───────────────────────────────────────────────
const localErrors = computed(() => ({
  city: touched.city ? requiredError(form.city, t('address.city')) : null,
  district: touched.district ? requiredError(form.district, t('address.district')) : null,
  street: touched.street ? requiredError(form.street, t('address.street')) : null,
  houseNumber: touched.houseNumber ? requiredError(form.houseNumber, t('address.houseNumber')) : null,
}))
const err = (k: string) =>
  (localErrors.value as Record<string, string | null>)[k] || props.serverFields?.[k] || ''

const step2Valid = computed(
  () =>
    !!form.country &&
    !!form.city.trim() &&
    !!form.district.trim() &&
    !!form.street.trim() &&
    !!form.houseNumber.trim(),
)
const hasPosition = computed(() => typeof form.lat === 'number' && typeof form.lng === 'number')

function goNext() {
  if (step.value === 2) {
    touched.city = touched.district = touched.street = touched.houseNumber = true
    if (!step2Valid.value) return
  }
  step.value = Math.min(3, step.value + 1)
}
function goPrev() {
  step.value = Math.max(1, step.value - 1)
}

// ── Géolocalisation ──────────────────────────────────────────
async function onLocate() {
  const pos = await locate()
  if (pos) {
    form.lat = pos.lat
    form.lng = pos.lng
  }
}
const geoMessage = computed(() => {
  if (geoError.value === 'denied') return t('address.geoDenied')
  if (geoError.value) return t('address.geoError')
  return ''
})

// ── Photo ────────────────────────────────────────────────────
async function onPhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  photoError.value = ''
  try {
    const { dataUrl, sizeKb } = await compress(file)
    form.photoUrl = dataUrl
    photoSize.value = sizeKb
  } catch {
    photoError.value = 'Image illisible. Essayez un autre fichier.'
  }
}
function removePhoto() {
  form.photoUrl = ''
  photoSize.value = null
}

// ── Soumission ───────────────────────────────────────────────
function onSubmit() {
  emit('submit', {
    country: form.country,
    city: form.city.trim(),
    district: form.district.trim(),
    street: form.street.trim(),
    houseNumber: form.houseNumber.trim(),
    postalCode: form.postalCode.trim() || undefined,
    lat: form.lat,
    lng: form.lng,
    photoUrl: form.photoUrl || undefined,
  })
}
</script>

<template>
  <div>
    <!-- Indicateur de progression -->
    <ol class="mb-8 flex items-center">
      <li v-for="(label, i) in steps" :key="i" class="flex flex-1 items-center last:flex-none">
        <div class="flex items-center gap-2">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors"
            :class="
              step > i + 1
                ? 'bg-success-500 text-white'
                : step === i + 1
                  ? 'bg-brand-500 text-white ring-4 ring-brand-500/15'
                  : 'border-2 border-ink-300 bg-surface-card text-text-muted'
            "
          >
            <Icon v-if="step > i + 1" name="lucide:check" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span class="hidden text-sm font-medium sm:inline" :class="step >= i + 1 ? 'text-text-strong' : 'text-text-muted'">
            {{ label }}
          </span>
        </div>
        <span v-if="i < steps.length - 1" class="mx-3 h-0.5 flex-1 rounded" :class="step > i + 1 ? 'bg-success-500' : 'bg-ink-200'" />
      </li>
    </ol>

    <UiAlert v-if="serverError" tone="error" class="mb-4">{{ serverError }}</UiAlert>

    <!-- Étape 1 : position -->
    <section v-show="step === 1">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-text-muted">{{ t('address.mapHint') }}</p>
        <UiButton variant="secondary" size="sm" :loading="locating" @click="onLocate">
          <Icon name="lucide:locate-fixed" /> {{ locating ? t('address.locating') : t('address.locateMe') }}
        </UiButton>
      </div>
      <ClientOnly>
        <AddressMap :lat="form.lat" :lng="form.lng" @update="form.lat = $event.lat; form.lng = $event.lng" />
        <template #fallback>
          <UiSkeleton height="288px" rounded="12px" />
        </template>
      </ClientOnly>
      <UiAlert v-if="geoMessage" tone="warning" class="mt-3">{{ geoMessage }}</UiAlert>
      <p class="mt-3 font-mono text-sm text-brand-500">
        <Icon name="lucide:map-pin" /> {{ form.lat.toFixed(6) }}°, {{ form.lng.toFixed(6) }}°
      </p>
    </section>

    <!-- Étape 2 : détails -->
    <section v-show="step === 2">
      <div class="grid gap-x-4 sm:grid-cols-2">
        <UiSelect
          v-model="form.country"
          :label="t('address.country')"
          :options="countryOptions()"
          :placeholder="t('address.selectCountry')"
          icon="lucide:globe"
          required
        />
        <UiInput
          v-model="form.city"
          :label="t('address.city')"
          :placeholder="t('address.selectCity')"
          icon="lucide:building-2"
          :datalist="cities"
          required
          :error="err('city')"
          @blur="touched.city = true"
        />
        <UiInput
          v-model="form.district"
          :label="t('address.district')"
          icon="lucide:map"
          required
          :error="err('district')"
          @blur="touched.district = true"
        />
        <UiInput
          v-model="form.street"
          :label="t('address.street')"
          icon="lucide:signpost"
          required
          :error="err('street')"
          @blur="touched.street = true"
        />
        <UiInput
          v-model="form.houseNumber"
          :label="t('address.houseNumber')"
          inputmode="numeric"
          icon="lucide:home"
          required
          :error="err('houseNumber')"
          @blur="touched.houseNumber = true"
        />
        <UiInput
          v-model="form.postalCode"
          :label="t('address.postalCodeOptional')"
          icon="lucide:mailbox"
        />
      </div>
    </section>

    <!-- Étape 3 : photo & validation -->
    <section v-show="step === 3">
      <label class="mb-1.5 block text-sm font-medium text-text-base">{{ t('address.photo') }}</label>
      <div v-if="form.photoUrl" class="mb-3">
        <img :src="form.photoUrl" alt="Aperçu du bâtiment" class="h-48 w-full rounded-xl border border-border-base object-cover" />
        <div class="mt-2 flex items-center gap-3">
          <label class="cursor-pointer text-sm font-medium text-brand-500 hover:text-brand-600">
            {{ t('address.photoChange') }}
            <input type="file" accept="image/*" class="sr-only" @change="onPhoto" />
          </label>
          <button type="button" class="text-sm font-medium text-error-600" @click="removePhoto">
            {{ t('address.photoRemove') }}
          </button>
          <span v-if="photoSize" class="ml-auto font-mono text-xs text-text-muted">≈ {{ photoSize }} Ko</span>
        </div>
      </div>
      <label
        v-else
        class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300 bg-surface-muted px-6 py-10 text-center transition-colors hover:border-brand-400"
      >
        <Icon name="lucide:image-plus" class="text-3xl text-ink-400" />
        <span class="text-sm font-medium text-text-base">{{ t('address.photo') }}</span>
        <span class="text-xs text-text-muted">{{ t('address.photoHint') }}</span>
        <input type="file" accept="image/*" class="sr-only" @change="onPhoto" />
      </label>
      <UiAlert v-if="photoError" tone="error" class="mt-3">{{ photoError }}</UiAlert>

      <!-- Récapitulatif -->
      <div class="mt-6 rounded-xl border border-border-base bg-surface-muted p-5">
        <p class="mb-3 text-sm font-semibold text-text-strong">{{ t('address.review') }}</p>
        <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><dt class="text-text-muted">{{ t('address.country') }}</dt><dd class="font-medium text-text-base">{{ form.country }}</dd></div>
          <div><dt class="text-text-muted">{{ t('address.city') }}</dt><dd class="font-medium text-text-base">{{ form.city || '—' }}</dd></div>
          <div><dt class="text-text-muted">{{ t('address.district') }}</dt><dd class="font-medium text-text-base">{{ form.district || '—' }}</dd></div>
          <div><dt class="text-text-muted">{{ t('address.street') }}</dt><dd class="font-medium text-text-base">{{ form.street || '—' }} {{ form.houseNumber }}</dd></div>
          <div class="col-span-2"><dt class="text-text-muted">{{ t('address.position') }}</dt><dd class="font-mono text-brand-500">{{ form.lat.toFixed(6) }}, {{ form.lng.toFixed(6) }}</dd></div>
        </dl>
      </div>
    </section>

    <!-- Navigation -->
    <div class="mt-8 flex items-center gap-3">
      <UiButton v-if="step > 1" variant="ghost" @click="goPrev">
        <Icon name="lucide:arrow-left" /> {{ t('common.previous') }}
      </UiButton>
      <span v-if="mode === 'create' && draftSavedAt" class="flex items-center gap-1 text-xs text-success-600">
        <Icon name="lucide:check" /> {{ t('address.draftSaved') }}
      </span>
      <div class="ml-auto flex gap-3">
        <UiButton v-if="step < 3" :disabled="step === 2 && !step2Valid" @click="goNext">
          {{ t('common.next') }} <Icon name="lucide:arrow-right" />
        </UiButton>
        <UiButton v-else :loading="loading" :disabled="!step2Valid || !hasPosition" @click="onSubmit">
          <Icon name="lucide:check" />
          {{ mode === 'create' ? t('address.submitCreate') : t('address.submitEdit') }}
        </UiButton>
      </div>
    </div>
  </div>
</template>
