<template>
<v-card class="pa-8 d-flex justify-center flex-wrap mx-auto" variant="plain"  max-width="344">
<v-autocomplete
        :items="items"
        auto-select-first
        class="flex-full-width"
        density="comfortable"
        item-props
        menu-icon=""
        placeholder="Search #"
        prepend-inner-icon="mdi-magnify"
        rounded
        theme="light"
        variant="solo"
        @input="filterTag($event)"
      ></v-autocomplete>
      </v-card>
  <v-card
    class="mx-auto my-8"
    max-width="344"
    elevation="12"
    v-for="note in paginationNotes" :key="note.id"
  >
    <v-card-item>
      <v-card-title>
        <span class="font-bold">{{note.title}}</span> - <span class="lowercase text-blue">#{{note.category}}</span>
      </v-card-title>
      <v-card-subtitle>
        <p>{{note.creator}}</p>
        <span class="">{{note.created_at}}</span>
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      {{note.content}}
    </v-card-text>
  </v-card>
      <v-pagination
      v-model="currentPage"
      :length="totalPages"
    ></v-pagination>
</template>
<script>
import { defineComponent } from "@vue/composition-api";
import dataFetch from "../data/data.json";

export default defineComponent({

  setup() {
    onMounted(()=>{
        console.log(fetchUserNotes());
        console.log(userNotes.value)
    })
    const userNotes = ref([]);
    const notesPerPage = 2;
    const currentPage = ref(1);
    const filterNoteCat = ref([]);
    const fetchUserNotes = () => {
    const notes = dataFetch.notes;
      userNotes.value = notes
      console.log("Fetched Notes: ", userNotes.value)
      filterNoteCat.value = userNotes.value 
      return userNotes.value;
    };
    const totalPages = computed(() => Math.ceil(userNotes.value.length / notesPerPage))
    const paginationNotes = computed(() => {
        const startIndex = (currentPage.value - 1) * notesPerPage;
        const endIndex = startIndex + notesPerPage;
        return filterNoteCat.value.slice(startIndex, endIndex)
    })
    const filterTag = (event)=>{
        console.log(event)
        const query = event.target.value
        filterNoteCat.value = userNotes.value.filter(note => {
            return note.category.toLowerCase().includes(query.toLowerCase());
        })
        currentPage.value = 1
    }
    
    
      
    
    return { userNotes, notesPerPage, currentPage, totalPages, paginationNotes, filterTag };
  },
});
</script>
