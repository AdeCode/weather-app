<script setup>
import { ref } from "vue";
import axios from 'axios';
import { useRouter } from "vue-router";
import CityList from "../components/CityList.vue";

const searchQuery = ref("")
const queryTimeOut = ref(null)
const mapboxApiKey = 'pk.eyJ1IjoiY29kZWFkZXgiLCJhIjoiY2xrbXNuMm1hMXNxejNja2c3N245Z3hubiJ9.5w0uKS81_vL14Bjidk7g_w'
const mapBoxSearchResults = ref(null)
const searchErrors = ref(null)
const router = useRouter()

const getSearchResults = () => {
  clearTimeout(queryTimeOut.value) 
  queryTimeOut.value = setTimeout(async()=>{
    if(searchQuery.value !== ''){
      try{
        const result = await axios.
        get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxApiKey}&types=place`);
        mapBoxSearchResults.value = result.data.features
        console.log(mapBoxSearchResults.value)
      }catch{
        searchErrors.value = true
      }
      
      return
    };
    mapBoxSearchResults.value = null
  }, 300)
}

const previewCity = (searchResult) => {
  console.log(searchResult)
  const [city, state] = searchResult.place_name.split(",")
  router.push({
    name: 'CityView',
    params: {state:state.replaceAll(" ",""), city:city},
    query:{
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0],
      preview: true,
    }
  })
  // console.log(city, state)
}
</script>

<template>
  <main>
    <div class="container text-white">
      <div class="pt-4 mb-8 relative">
        <input type="text" placeholder="Search for a city or state" 
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary
        focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
        v-model="searchQuery"
        @input="getSearchResults"
        />
        <ul class="absolute bg-weather-secondary text-white w-full
        shadow-md py-2 px-1 top-[66px]"
        v-if="mapBoxSearchResults"
        >
          <p v-if="searchErrors">
            Sorry, something went wrong, please try again
          </p>
          <p v-if="!serverError && mapBoxSearchResults.length === 0">
            No result match your query, try a different term.
          </p>
          <template v-else>
            <li v-for="searchResult in mapBoxSearchResults"
              :key="searchResult.id"
              class="py-2 cursor-pointer"
              @click="previewCity(searchResult)"
            >
              {{searchResult.place_name}}
            </li>
          </template>
        </ul>
      </div>
      <div class="flex flex-col gap-4">
      <Suspense>
        <CityList/>
        <template #fallback>
          <p>Loading...</p>
        </template>
      </Suspense>
    </div>
    </div>
    
  </main>
</template>
