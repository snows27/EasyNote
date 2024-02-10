<template>
  <div>
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
      max-width="600"
      elevation="12"
      v-for="(note) in paginationNotes"
      :key="note.id"
    >
      <v-card-item>
        <v-card-title
          class="d-flex flex-row-reverse justify-between align-center"
        >
          <v-icon
            size="18"
            @click="toggleEditing(note.id)"
            v-if="!editingStates[note.id]"
            >mdi-pencil</v-icon
          >
          <div v-if="!editingStates[note.id]">
            <span class="font-bold">{{ note.title }}</span> -
            <span class="lowercase text-blue">#{{ note.category }}</span>
          </div>
          <div v-else class="w-100">
            <div class="flex flex-row-reverse">
              <v-icon
                size="24"
                @click="toggleClosing(note.id)"
                v-if="editingStates[note.id]"
                class="text-red"
                >mdi-close</v-icon
              >
            </div>
            <v-text-field v-model="tempTitle[note.id]"></v-text-field>
            <v-text-field v-model="tempCategory[note.id]"></v-text-field>
          </div>
        </v-card-title>
        <v-card-subtitle>
          <p>{{ note.creator }}</p>
          <span class="">{{ note.created_at }}</span>
        </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <div v-if="!editingStates[note.id]">{{ note.content }}</div>
        <v-textarea v-else v-model="tempContent[note.id]"></v-textarea>
      </v-card-text>
      <v-card-actions
        v-if="editingStates[note.id]"
        class="flex flex-col align-center"
      >
        <v-btn @click="saveChanges(note.id)" class="bg-blue">Save</v-btn>
      </v-card-actions>
    </v-card>
    <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
  </div>
</template>
<script>
import { defineComponent } from "@vue/composition-api";
import dataFetch from "../data/data.json";

export default defineComponent({
  props: {
    userId: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const userNotes = ref([]);
    const notesPerPage = 2;
    const currentPage = ref(1);
    const filterNoteCat = ref([]);
    const queryTags = ref("");
    const tempTitle = ref([]);
    const tempCategory = ref([]);
    const tempContent = ref([]);
    const editingStates = ref([]);
   
    const fetchUserNotes = () => {
      const notes = dataFetch.notes;
      userNotes.value = notes.filter(
        (note) => note.user_id === Number(props.userId)
      );
      editingStates.value = new Array(userNotes.value.length).fill(false);
      filterNoteCat.value = userNotes.value;
      console.log("Fetched Notes: ", userNotes.value);
      return userNotes.value;
    };
    const totalPages = computed(() =>
      Math.ceil(userNotes.value.length / notesPerPage)
    );
    const paginationNotes = computed(() => {
      const startIndex = (currentPage.value - 1) * notesPerPage;
      const endIndex = startIndex + notesPerPage;
      return filterNoteCat.value.slice(startIndex, endIndex);
    });
    onMounted(() => {
      console.log(fetchUserNotes());
      console.log(userNotes.value);
    });
    const filterTag = (event) => {
      console.log(event);
      const query = event.target.value;
      filterNoteCat.value = userNotes.value.filter((note) => {
        return note.category.toLowerCase().includes(query.toLowerCase());
      });
      currentPage.value = 1;
    };
    const toggleEditing = (noteId) => {
      console.log(noteId)
      if (!editingStates[noteId]) {
        tempTitle.value[noteId] = userNotes.value.find(note => note.id === noteId).title;
        tempCategory.value[noteId] = userNotes.value.find(note => note.id === noteId).category;
        tempContent.value[noteId] = userNotes.value.find(note => note.id === noteId).content;
  }
  editingStates.value[noteId] = !editingStates.value[noteId];
    };
    const toggleClosing = (noteId) => {
      editingStates.value[noteId] = false;
    };
  const saveChanges=(noteId)=>{
            const currentDate = new Date();
            const day = currentDate.getDate().toString().padStart(2, '0');
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const year = currentDate.getFullYear();
            const hours = currentDate.getHours().toString().padStart(2, '0'); 
            const minutes = currentDate.getMinutes().toString().padStart(2, '0');
            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
      const note = userNotes.value.find(note=>note.id===noteId);
      if (note) {
        const prevContent = note.content
        note.title = tempTitle.value[noteId];
        note.category = tempCategory.value[noteId];
        note.content = tempContent.value[noteId];
        editingStates.value[noteId] = false;
        const editHistory = {
          editor: props.username,
          edited_at: formattedDate,
          changes: `Updated content from "${prevContent}" to "${note.content}"`
        };
        note.edit_history.push(editHistory);
        editingStates.value[noteId] = false;
  }
  }
    return {
      userNotes,
      notesPerPage,
      currentPage,
      totalPages,
      paginationNotes,
      filterTag,
      queryTags,
      toggleEditing,
      toggleClosing,
      editingStates,
      tempTitle,
      tempCategory,
      tempContent,
      saveChanges
    };
  },
});
</script>
