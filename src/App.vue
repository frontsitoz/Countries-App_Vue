<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import PageHeader from "./components/PageHeader.vue";
import CountryList from "./components/CountryList.vue";
import axiosClient from "./utils/axios.ts";
import type { Country } from "./models/country.model.ts";

const countries = ref<Country[]>([]); // Lista de países obtenida de la API
const search = ref(""); // Texto de búsqueda ingresado por el usuario
const filteredCountries = ref<Country[]>([]); // Países filtrados según la búsqueda
const page = ref(1); // Página actual para la paginación
const itemsPerPage = ref(12); // Número de países por página
const paginatedCountries = ref<Country[]>([]); // Países que se mostrarán en la página actual
const totalItems = ref(0); // Total de países para calcular la paginación

//*Esta es una función asíncrona que se va a encargar de hacer la petición a la API de países

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

//* Esta función se encarga de filtrar los países según el texto que se ingresa en el input de búsqueda

const filterCountries = () => {
  filteredCountries.value = countries.value.filter((country) =>
    country.name.common.toLowerCase().includes(search.value.toLowerCase())
  );
};
//* Esta función se encarga de paginar los países, tomando en cuenta la página actual y el número de países por página */
const sliceCountries = (currentCountries: Country[]) => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = page.value * itemsPerPage.value;
  paginatedCountries.value = currentCountries.slice(start, end);
};
// Esta función se encarga de cambiar la página actual, y se llama cuando el usuario hace clic en los botones de paginación
const changePage = (newPage: number) => {
  page.value = newPage;
};
//* El onMounted se ejecuta cuando el componente se monta por primera vez, y se encarga de llamar a la función fetchCountries para obtener los países y luego llamar a sliceCountries para paginarlos
onMounted(() => {
  fetchCountries();
  sliceCountries(countries.value);
});
//* El watch se encarga de observar los cambios en las variables countries, page y filteredCountries, y actualiza el totalItems y los países paginados cada vez que hay un cambio
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
  <PageHeader />
  <div class="container max-w-screen-lg mx-auto px-6">
    <div class="mb-8">
      <input
        type="text"
        placeholder="Search country..."
        class="border border-gray-300 w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @input="filterCountries"
        v-model="search"
      />
    </div>
    <div class="mb-8 text-center">
      <!--Aquí verificamos si la página actual es menor o igual a 1, si es así, deshabilitamos el botón -->
      <button
        @click="() => changePage(page - 1)"
        :disabled="page <= 1"
        :class="{ 'opacity-50': page <= 1 }"
        class="text-red-900 border border-red-900 px-2 py-2 rounded mx-2 hover:bg-red-900 hover:text-white"
      >
        Previous
      </button>
      <!-- Aquí verificamos si la página actual es mayor o igual al total de páginas, si es así, deshabilitamos el botón -->
      <button
        @click="() => changePage(page + 1)"
        :class="{ 'opacity-50': page >= Math.ceil(totalItems / itemsPerPage) }"
        :disabled="page >= Math.ceil(totalItems / itemsPerPage)"
        class="text-blue-900 border border-blue-900 px-2 py-2 rounded hover:bg-blue-900 hover:text-white"
      >
        Next
      </button>
    </div>
    <!-- Aquí decimos que si hay países filtrados, se muestren esos, sino se muestren todos los países -->
    <CountryList :countries="paginatedCountries" />
  </div>
</template>
