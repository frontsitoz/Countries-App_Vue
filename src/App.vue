<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import PageHeader from "./components/PageHeader.vue";
import CountryList from "./components/CountryList.vue";
import axiosClient from "./utils/axios.ts";
import type { Country } from "./models/country.model.ts";

const countries = ref<Country[]>([]);
const search = ref("");
const filteredCountries = ref<Country[]>([]);
const page = ref(1);
const itemsPerPage = ref(12);
const paginatedCountries = ref<Country[]>([]);
const totalItems = ref(0);

const isDark = ref(false);

const toggleDark = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const fetchCountries = async () => {
  try {
    const response = await axiosClient.get(
      "/all?fields=name,flags,capital,population,region"
    );
    countries.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};

const filterCountries = () => {
  filteredCountries.value = countries.value.filter((country) =>
    country.name.common.toLowerCase().includes(search.value.toLowerCase())
  );
};

const sliceCountries = (currentCountries: Country[]) => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = page.value * itemsPerPage.value;
  paginatedCountries.value = currentCountries.slice(start, end);
};

const changePage = (newPage: number) => {
  page.value = newPage;
};

onMounted(() => {
  fetchCountries();
  sliceCountries(countries.value);
});

watch([countries, page, filteredCountries], () => {
  totalItems.value = countries.value.length;
  sliceCountries(
    filteredCountries.value.length <= 0 && search.value === ""
      ? countries.value
      : filteredCountries.value
  );
});
</script>

<template>
  <div
    class="min-h-screen w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
  >
    <button
      @click="toggleDark"
      class="absolute top-5 right-5 px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white dark:bg-yellow-400 dark:text-black dark:hover:bg-yellow-300 text-sm shadow-md hover:scale-105 transition-transform"
    >
      {{ isDark ? "☀️ Light" : "🌙 Dark" }}
    </button>

    <div class="min-h-screen flex flex-col">
      <PageHeader />
      <div class="container max-w-screen-lg mx-auto px-6 flex-grow">
        <div class="mb-8">
          <input
            type="text"
            placeholder="Search country..."
            class="border border-gray-300 w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            @input="filterCountries"
            v-model="search"
          />
        </div>
        <div class="mb-8 text-center">
          <button
            @click="() => changePage(page - 1)"
            :disabled="page <= 1"
            :class="{ 'opacity-50': page <= 1 }"
            class="text-red-900 dark:text-red-400 border border-red-900 dark:border-red-400 px-2 py-2 rounded mx-2 hover:bg-red-900 dark:hover:bg-red-400 hover:text-white dark:hover:text-black"
          >
            Previous
          </button>
          <button
            @click="() => changePage(page + 1)"
            :class="{
              'opacity-50': page >= Math.ceil(totalItems / itemsPerPage),
            }"
            :disabled="page >= Math.ceil(totalItems / itemsPerPage)"
            class="text-blue-900 dark:text-blue-400 border border-blue-900 dark:border-blue-400 px-2 py-2 rounded hover:bg-blue-900 dark:hover:bg-blue-400 hover:text-white dark:hover:text-black"
          >
            Next
          </button>
        </div>
        <CountryList :countries="paginatedCountries" />
      </div>
    </div>
  </div>
</template>
