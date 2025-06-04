<script setup lang="ts">
import { defineProps } from "vue";
import type { Country } from "../models/country.model.ts";

interface Props {
  country: Country;
}

defineProps<Props>();
</script>

<template>
  <div class="h-56 sm:h-36">
    <img
      class="h-56 sm:h-36 w-full"
      :src="country.flags.png"
      :alt="country.flags.alt"
    />
  </div>
  <h4 class="text-xl font-bold text-gray-500">{{ country.name.common }}</h4>
  <p class="text-sm text-gray-400">
    Capital:
    <span
      class="font-bold"
      v-for="(capital, index) in country.capital"
      :key="capital"
    >
      {{ capital }} <span v-if="index < country.capital.length - 1">, </span>
    </span>
  </p>

  <p class="text-sm text-gray-400">
    Population:
    <span class="font-bold">{{ country.population?.toLocaleString() }}</span>
  </p>
  <p class="text-sm text-gray-400">
    Region:
    <span class="font-bold">{{ country.region }}</span>
  </p>
</template>
