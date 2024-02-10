<template>
  <v-card
    class="pa-8 d-flex justify-center flex-wrap mx-auto"
    variant="plain"
    max-width="344"
  >
    <v-autocomplete
      auto-select-first
      class="flex-full-width"
      density="comfortable"
      item-props
      menu-icon=""
      label="Search #"
      prepend-inner-icon="mdi-magnify"
      rounded
      theme="light"
      variant="solo"
      v-model="queryTags"
      @input="filterTag($event)"
    ></v-autocomplete>
  </v-card>
  <v-card
    class="mx-auto my-6"
    max-width="600"
    elevation="12"
    v-for="note in paginationNotes"
    :key="note.id"
  >
    <v-card-item>
      <v-card-title>
        <span class="font-bold">{{ note.title }}</span> -
        <span class="lowercase text-blue">#{{ note.category }}</span>
      </v-card-title>
      <v-card-subtitle>
        <p>{{ note.creator }}</p>
        <span class="">{{ note.created_at }}</span>
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      {{ note.content }}
    </v-card-text>
  </v-card>
  <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" class="my-5"></v-pagination>
  <Footer />
</template>
<script>
import { defineComponent } from "@vue/composition-api";
import dataFetch from "../data/data.json";

export default defineComponent({
  setup() {
    onMounted(() => {
      console.log(fetchUserNotes());
      console.log(userNotes.value);
    });
    const userNotes = ref([]);
    const notesPerPage = 3;
    const currentPage = ref(1);
    const filterNoteCat = ref([]);
    const queryTags = ref("");
    const fetchUserNotes = () => {
      const storedNotes = localStorage.getItem("notes");
      if (storedNotes) {
        userNotes.value = JSON.parse(storedNotes);
      } else {
        userNotes.value = dataFetch.notes;
      }
      filterNoteCat.value = userNotes.value;
      console.log("Fetched Notes: ", userNotes.value);
      return userNotes.value;
    };
    const totalPages = computed(() =>
      Math.ceil(filterNoteCat.value.length / notesPerPage)
    );
    const paginationNotes = computed(() => {
      const startIndex = (currentPage.value - 1) * notesPerPage;
      const endIndex = startIndex + notesPerPage;
      return filterNoteCat.value.slice(startIndex, endIndex);
    });
    const filterTag = (event) => {
      console.log(event);
      queryTags.value = event.target.value;
      filterNoteCat.value = userNotes.value.filter((note) => {
        return note.category
          .toLowerCase()
          .includes(queryTags.value.toLowerCase());
      });
      currentPage.value = 1;
    };

    return {
      userNotes,
      notesPerPage,
      currentPage,
      totalPages,
      paginationNotes,
      filterTag,
    };
  },
});
</script>
