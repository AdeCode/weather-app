<template>
  <div v-for="city in savedCities" :key="city.id">
    <CityCard :city="city" @click="gotOCityView(city)"/>
  </div>

  <p v-if="savedCities.length === 0">
    No locations added. To start trackign a location, search in the field above.  
    </p>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CityCard from "./CityCard.vue";

const weatherAPIKey = "fc8df2ac1063bf50b0de268a5564e492";

const savedCities = ref([])

const getCities = async () => {
    if(localStorage.getItem('savedCities')){
        savedCities.value = JSON.parse(localStorage.getItem('savedCities'))
    }
    const requests = []

    savedCities.value.forEach((city)=>{
        requests.push(
            axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=${weatherAPIKey}&units=imperial`
            )
        )
    })
    console.log('All requests', requests)
    const weatherData = await Promise.all(requests)

    //Flicker Delay
    await new Promise(res => setTimeout(res, 1000))

    weatherData.forEach((value, index) => {
        savedCities.value[index].weather = value.data
    })
}

await getCities()

const router = useRouter()
const gotOCityView = (city) => {
    router.push({
        name: "CityView",
        params: {state: city.state, city: city.city},
        query: {id: city.id, lat: city.coords.lat, lng: city.coords.lng}
    })
}
</script>

<style>

</style>