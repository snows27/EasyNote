<template>
<div class="grid align-center">
    <v-card
      class="pa-8 d-flex justify-center flex-wrap mx-auto"
      variant="plain"
      max-width="344"
      
    >
      <v-autocomplete
        auto-select-first
        class="flex-full-width w-screen"
        density="comfortable"
        item-props
        menu-icon=""
        label="Search #"
        placeholder="Search #"
        prepend-inner-icon="mdi-magnify"
        rounded
        theme="light"
        variant="solo"
        v-model="queryTags"
        @input="filterTag($event)"
      ></v-autocomplete>
      
    </v-card>
    
    <v-card
      class="mx-auto my-6 w-full"
      max-width="600"
      elevation="12"
      v-for="note in paginationNotes"
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
            <v-text-field label="title" v-model="tempTitle[note.id]"></v-text-field>
            <v-text-field label="category" v-model="tempCategory[note.id]"></v-text-field>
          </div>
        </v-card-title>
        <v-card-subtitle>
          <p>{{ note.creator }}</p>
          <span class="">{{ note.created_at }}</span>
        </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <div v-if="!editingStates[note.id]">{{ note.content }}</div>
        <v-textarea v-else label="Content" v-model="tempContent[note.id]"></v-textarea>
      </v-card-text>
      <v-card-actions
        v-if="editingStates[note.id]"
        class="flex flex-col align-center"
      >
        <v-btn @click="saveChanges(note.id)" class="bg-blue">Save</v-btn>
      </v-card-actions>
    </v-card>
    <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" class="my-5"></v-pagination>
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
      required: true,
    },
  },
  setup(props) {
    const userNotes = ref([]);
    const notesPerPage = 3;
    const currentPage = ref(1);
    const filterNoteCat = ref([]);
    const queryTags = ref("");
    const tempTitle = ref([]);
    const tempCategory = ref([]);
    const tempContent = ref([]);
    const editingStates = ref([]);
    const fetchUserNotes = () => {
      const storedNotes = localStorage.getItem("notes");
      if (storedNotes) {
        userNotes.value = JSON.parse(storedNotes);
      } else {
        userNotes.value = dataFetch.notes;
      }
      const filteredNotes = userNotes.value.filter(
        (note) => note.user_id === Number(props.userId)
      );
      filterNoteCat.value = filteredNotes;
      editingStates.value = new Array(userNotes.value.length).fill(false);
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
          return note.category.toLowerCase().includes(queryTags.value.toLowerCase());
        });
        currentPage.value = 1;
      };
    const toggleEditing = (noteId) => {
      console.log(noteId);
      if (!editingStates[noteId]) {
        tempTitle.value[noteId] = userNotes.value.find(
          (note) => note.id === noteId
        ).title;
        tempCategory.value[noteId] = userNotes.value.find(
          (note) => note.id === noteId
        ).category;
        tempContent.value[noteId] = userNotes.value.find(
          (note) => note.id === noteId
        ).content;
      }
      editingStates.value[noteId] = !editingStates.value[noteId];
    };
    const toggleClosing = (noteId) => {
      editingStates.value[noteId] = false;
    };
const saveChanges = (noteId) => {
  const updatedNotes = userNotes.value.map((note) => {
    if (note.id === noteId) {
      const prevContent = note.content;
      const updatedNote = {
        ...note,
        title: tempTitle.value[noteId],
        category: tempCategory.value[noteId],
        content: tempContent.value[noteId],
      };

      if (!updatedNote.edit_history || updatedNote.edit_history.length === 0) {
        updatedNote.edit_history = [{
          editor: props.username,
          edited_at: getFormatDateTime(),
          changes: prevContent
        }];
      } else {
        const latestEdit = updatedNote.edit_history[0];
        latestEdit.editor = props.username;
        latestEdit.edited_at = getFormatDateTime();
        latestEdit.changes = prevContent;
      }
      return updatedNote;
    }
    return note;
  });
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      console.log(JSON.parse(localStorage.getItem("notes")));
      editingStates.value[noteId] = false;
      fetchUserNotes();
    };
    onMounted(() => {
      console.log(fetchUserNotes());
      console.log(userNotes.value);
      console.log(JSON.parse(localStorage.getItem("notes")));
    });
    const getFormatDateTime = () => {
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      const hours = currentDate.getHours().toString().padStart(2, "0");
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
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
      saveChanges,
    };
  },
});
</script>
