<template>
  <div class="map-container" ref="mapContainer" />
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { QDHoangSa, QDTruongSa, dms2deg } from "vietnamisland";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import geoJsonData from "@/data/HNgeo.json";

const mapContainer = ref(null);
let map = null;
const markerList = ref([]); // Store references to Leaflet markers

const emit = defineEmits(['update:activeTab']);

const { locationList, showDirection, zoomLevel, activeTab } = defineProps({
  locationList: {
    type: Array,
    required: true,
  },
  showDirection: {
    type: Boolean,
    default: true,
  },
  activeTab: {
    type: Number,
    default: null, // Changed default to null for better type handling
  },
  zoomLevel: {
    type: Number,
    default: 15,
  },
});

const iconSize = computed(() => {
  const windowWidth = window.innerWidth;
  if (windowWidth < 1440) {
    return [100, 100];
  } else if (windowWidth < 2560 || windowWidth === 2560) {
    return [200, 200];
  } else if (windowWidth < 3840 || windowWidth === 3840) {
    return [300, 300];
  } else {
    return [100, 100];
  }
});

const redIcon = L.icon({
  iconUrl: "./image/detail/leaflet-icon/marker-red-icon.png",
  iconSize: [iconSize.value[0] / 2, iconSize.value[1] / 2],
  iconAnchor: [iconSize.value[0] / 4, iconSize.value[1] / 2],
  popupAnchor: [0, -iconSize.value[1] / 2],
});

// Watch for changes in activeTab or locationList to re-render markers
watch(
  [() => activeTab, () => locationList],
  () => {
    if (map) {
      // Ensure map is initialized before managing markers
      updateTargetLocationMarkers();
    }
  },
  { deep: true } // Use deep watch for locationList if its contents can change
);

// Avoid SSR issues
onMounted(() => {
  initMap();
  addVietnamIslandLocationMarker();
  if (geoJsonData) {
    addGeoJsonBounds(geoJsonData);
  }
  // Initial call to add target markers after map is ready
  updateTargetLocationMarkers();
});

function initMap() {
  const bounds = [
    [21.409605198965597, 106.182861328125],
    [20.513856379923443, 105.26275634765626],
  ];

  map = L.map(mapContainer.value, {
    attributionControl: false,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0, // Makes the bounds restriction more strict
  }).setView([21.010246428485534, 105.7866050995661], 15);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/vmt47/ckpqdjwlb1r3x18qh1i6hprx6/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoidm10NDciLCJhIjoiY2twZ2NibmJzMDRyNDJybnY3bHVlemJpZSJ9.ZqYWBbera69i1fqOPmybBw",
    {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 12,
      maxZoom: 23,
    }
  ).addTo(map);

  //Adding bao tang HN
  L.marker([21.009989618829557, 105.78634133275837], {
    icon: redIcon,
  }).addTo(map);

  const HSLabel = L.divIcon({
    html: "QĐ. Hoàng Sa",
    className: "text-nowrap",
  });
  L.marker([16.604171, 111.820813], { icon: HSLabel }).addTo(map);

  const TSLabel = L.divIcon({
    html: "QĐ. Trường Sa",
    className: "text-nowrap",
  });
  L.marker([9.565994, 113.119031], { icon: TSLabel }).addTo(map);

  let isAdjusting = false;

  // Add event listener for map movement
  map.on("moveend", function () {
    if (isAdjusting) return;

    const currentBounds = map.getBounds();
    const restrictedBounds = L.latLngBounds(bounds);

    // Check if the current view is outside the restricted bounds
    if (!restrictedBounds.contains(currentBounds)) {
      isAdjusting = true;
      // Animate back to the center of the restricted bounds
      map.flyTo(restrictedBounds.getCenter(), map.getZoom(), {
        duration: 0.5,
        complete: () => {
          isAdjusting = false;
        },
      });
    }
  });

  // Initial bounds fit
  map.fitBounds(bounds);
}

// My location marker
function addVietnamIslandLocationMarker() {
  QDHoangSa.forEach(function (item) {
    const lat = dms2deg(item.lat);
    const lng = dms2deg(item.lng);
    const contentPopup =
      '<h4 style="font-family: inherit;">' +
      item.name +
      "</h4>" +
      "<b>Quần đảo Hoàng Sa, Việt Nam</b>" +
      "<p>" +
      item.desc +
      "</p>";

    L.circle([lat, lng], {
      color: "#fff",
      fillColor: "#f00",
      fillOpacity: 1.0,
      radius: 300,
    })
      .addTo(map)
      .bindPopup(contentPopup);
  });

  QDTruongSa.forEach(function (item) {
    const lat = dms2deg(item.lat);
    const lng = dms2deg(item.lng);
    const contentPopup =
      '<h4 style="font-family: inherit;">' +
      item.name +
      "</h4>" +
      "<b>Quần đảo Trường Sa, Việt Nam</b>" +
      "<p>" +
      item.desc +
      "</p>";

    L.circle([lat, lng], {
      color: "#fff",
      fillColor: "#f00",
      fillOpacity: 1.0,
      radius: 300,
    })
      .addTo(map)
      .bindPopup(contentPopup);
  });
}

function updateTargetLocationMarkers() {
  if (!map) return;

  // Clear all existing target markers from the map
  markerList.value.forEach((marker) => {
    marker.remove();
  });
  markerList.value = []; // Clear the list

  // Add new markers based on the current locationList and activeTab
  locationList.forEach((location) => {
    if (location && location.lat && location.lng) {
      let targetIcon;

      if (location.thumbnail) {
        // Custom icon using the provided thumbnail
        targetIcon = L.divIcon({
          html: `<img src="${location.thumbnail}" style="width: 100%; aspect-ratio: 1/1;object-fit: cover; border-radius: 50%; border: 12px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);">`,
          className: "target-location-marker",
          iconSize:
            activeTab === location.id
              ? iconSize.value
              : [iconSize.value[0] / 2, iconSize.value[1] / 2],
          iconAnchor:
            activeTab === location.id
              ? [iconSize.value[0] / 2, iconSize.value[1] / 2]
              : [iconSize.value[0] / 4, iconSize.value[1] / 4],
          popupAnchor:
            activeTab === location.id
              ? [0, -iconSize.value[1] / 2]
              : [0, -iconSize.value[1] / 4],
        });
      } else {
        // Default target icon
        targetIcon = L.divIcon({
          html: `<div style="background-color: #DB4437; border: 2px solid white; border-radius: 50%; width: 16px; height: 16px; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
          className: "target-location-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
      }

      // Create marker and add to map
      const targetMarker = L.marker([location.lat, location.lng], {
        icon: targetIcon,
      }).addTo(map);

      markerList.value.push(targetMarker); // Add to our list

      // Add click event to pan and zoom to the marker
      targetMarker.on("click", function () {
        emit('update:activeTab', location.id); // Emit the location id to update activeTab
        map.setView(targetMarker.getLatLng(), 23); // Adjust zoom level (15) as needed
      });
    }
  });

  // After all markers are added/updated, handle the zoom for the active tab
  const activeLocation = locationList.find((loc) => loc.id === activeTab);
  if (activeLocation && zoomLevel) {
    map.setView([activeLocation.lat, activeLocation.lng], zoomLevel);
  }
}

// New function to add GeoJSON and fit bounds
function addGeoJsonBounds(geoJson) {
  if (map && geoJson) {
    // Clear existing GeoJSON layers if any
    map.eachLayer(function (layer) {
      if (layer.options && layer.options.isGeoJsonLayer) {
        map.removeLayer(layer);
      }
    });

    // Add the GeoJSON layer with normal styling
    const geoJsonLayer = L.geoJSON(geoJson, {
      style: function (feature) {
        return {
          color: "#3f3f3f",
          weight: 6,
          opacity: 0.8,
          dashArray: "10, 10",
          fillColor: "transparent",
          fillOpacity: 0.1,
        };
      },
      isGeoJsonLayer: true,
    }).addTo(map);

    // Outer ring: large rectangle (covering the world or your map bounds)
    const outer = [
      [90, -180],
      [90, 180],
      [-90, 180],
      [-90, -180],
      [90, -180],
    ];

    // Inner ring: your Hanoi polygon (must be in [lat, lng] order)
    const hanoiCoords = geoJson.geometry.coordinates[0].map(([lng, lat]) => [
      lat,
      lng,
    ]);
    // Ensure the inner ring is counter-clockwise (Leaflet expects this for holes)
    hanoiCoords.reverse();

    // Create the mask polygon with a hole
    const mask = L.polygon([outer, hanoiCoords], {
      color: null,
      fillColor: "#000",
      fillOpacity: 0.7,
      stroke: false,
      interactive: false,
    }).addTo(map);

    // Fit the map to the bounds of the GeoJSON layer
    map.fitBounds(geoJsonLayer.getBounds());
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  height: 100dvh;
  width: 100%;
  // border: 2px solid #ccc;
  border-radius: 8px;
  z-index: 1;
}
</style>
