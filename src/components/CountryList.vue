<script setup lang="ts">
import { defineProps } from "vue";
import type { Country } from "../models/country.model.ts";
import CountryItem from "./CountryItem.vue";

//* Aquí se define la interfaz Props que va a recibir el componente CountryList
// Esta interfaz define que el componente CountryList va a recibir una propiedad llamada countries que es un array de objetos Country
interface Props {
  countries: Country[];
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
    <div
      v-for="country in countries"
      class="border border-gray-300 rounded p-3"
    >
      <CountryItem :country="country" />
    </div>
  </div>
</template>
