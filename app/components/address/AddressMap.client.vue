<template>
  <div
    ref="el"
    class="h-72 w-full rounded-xl border border-border-base"
    role="application"
    aria-label="Carte interactive — déplacez le marqueur pour ajuster votre position"
  />
</template>
<script setup lang="ts">
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps<{ lat: number; lng: number; readonly?: boolean }>();
const emit = defineEmits<{ update: [pos: { lat: number; lng: number }] }>();

const el = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let marker: L.Marker | null = null;
let internalMove = false;

// Marqueur stylé (évite le souci d'icône manquante avec les bundlers).
const pinIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;width:32px;height:42px">
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.2 0 0 7.0 0 15.7 0 27 16 42 16 42s16-15 16-26.3C32 7 24.8 0 16 0z" fill="#FF6830"/>
      <circle cx="16" cy="15.5" r="6" fill="#fff"/>
    </svg></div>`,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
});

onMounted(() => {
  if (!el.value) return;
  map = L.map(el.value, {
    zoomControl: true,
    attributionControl: true,
  }).setView([props.lat, props.lng], 16);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
    maxZoom: 19,
  }).addTo(map);

  marker = L.marker([props.lat, props.lng], {
    draggable: !props.readonly,
    icon: pinIcon,
  }).addTo(map);

  if (!props.readonly) {
    marker.on("dragend", () => {
      const { lat, lng } = marker!.getLatLng();
      internalMove = true;
      emit("update", {
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
      });
    });
    map.on("click", (e: L.LeafletMouseEvent) => {
      marker!.setLatLng(e.latlng);
      internalMove = true;
      emit("update", {
        lat: Number(e.latlng.lat.toFixed(6)),
        lng: Number(e.latlng.lng.toFixed(6)),
      });
    });
  }
});

// Recentre quand la position change de l'extérieur (géoloc, ville…).
watch(
  () => [props.lat, props.lng],
  ([lat, lng]) => {
    if (internalMove) {
      internalMove = false;
      return;
    }
    if (!map || !marker || lat == null || lng == null) return;
    marker.setLatLng([lat, lng]);
    map.setView([lat, lng], map.getZoom() < 13 ? 16 : map.getZoom());
  }
);

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});
</script>
