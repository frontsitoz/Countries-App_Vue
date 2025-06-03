<script setup lang="ts">
import { onMounted, ref } from "vue";

import PageHeader from "./components/PageHeader.vue";
import CountryList from "./components/CountryList.vue";
import axiosClient from "./utils/axios.ts";
import type { Country } from "./models/country.model.ts";

const countries = ref<Country[]>([]);

//*Esta es una función asíncrona que se va a encargar de hacer la petición a la API de países

const fetchCountries = async () => {
  try {
    const response = await axiosClient.get("/all");
    countries.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};

onMounted(() => {
  fetchCountries();
});
</script>

<template>
  <PageHeader />
  <div class="container max-w-screen-lg mx-auto px-6">
    <CountryList :countries="countries" />
  </div>
</template>

<style scoped></style>
