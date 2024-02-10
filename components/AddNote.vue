<template>
  <v-dialog transition="dialog-top-transition" width="auto">
    <template v-slot:activator="{ props }">
          <v-list-item prepend-icon="mdi-book-plus" title="Add Note" value="addNote" v-bind="props" class="text-blue"></v-list-item>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar color="primary" title="Create your note"></v-toolbar>
        <v-card-text>
          <v-sheet class="text-h2" width="600">
            <v-form @submit.prevent>
              <v-text-field
                label="title"
                v-model="titleInput"
                :rule="titleRequire"
              ></v-text-field>
              <v-text-field
                label="category"
                v-model="categoryInput"
                :rule="categoryRequire"
              ></v-text-field>
              <v-textarea
                label="contents"
                v-model="contentsInput"
                :rule="contentsRequire"
              ></v-textarea>
            </v-form>
          </v-sheet>
        </v-card-text>
        <v-card-actions class="-mt-7 justify-end">
          <v-btn class="bg-success" variant="text" @click="createNote"
            >Create</v-btn
          >
          <v-btn
            class="bg-red"
            elevation="6"
            variant="text"
            @click="isActive.value = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script>
import { defineComponent, ref } from "@vue/composition-api";
import dataFetch from "../data/data.json";
const NOTE_STORAGE = "notes";
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
    const titleInput = ref("");
    const categoryInput = ref("");
    const contentsInput = ref("");

    const titleRequire = [
      (value) => {
        if (value) return true;
        return "You must enter title";
      },
    ];
    const categoryRequire = [(value) => !!value || "username is required"];
    const contentsRequire = [(value) => !!value || "username is required"];

    const createNote = async () => {
      const newNote = {
        id: dataFetch.notes.length + 1,
        title: titleInput.value,
        content: contentsInput.value,
        category: categoryInput.value,
        user_id: props.userId,
        creator: props.username,
        created_at: getFormatDateTime(),
        edit_history: [],
      };
      dataFetch.notes.push(newNote);
      localStorage.setItem(NOTE_STORAGE, JSON.stringify(dataFetch.notes));
      titleInput.value = "";
      categoryInput.value = "";
      contentsInput.value = "";
      console.log("Success ADD NOTE");
      // try {
      //     const response = await fetch('api/note-registration', {
      //         method: 'POST',
      //         headers: {
      //             'Content-Type': 'application/json'
      //         },
      //         body: JSON.stringify(newNote)
      //     })
      //     if (response.ok){
      //         console.log(newNote);
      //         console.log('Success: Note added successfully');
      //     } else {
      //         console.error('Error: ', response.statusText)
      //     }
      // } catch(e){
      //     console.log('Error: ', e.message);
      // }
    };
    onMounted(() => {
      const savedNotes = JSON.parse(localStorage.getItem(NOTE_STORAGE));
      if (savedNotes) {
        dataFetch.notes = savedNotes;
      }
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
      createNote,
      titleInput,
      categoryInput,
      contentsInput,
      titleRequire,
      categoryRequire,
      contentsRequire,
    };
  },
});
</script>
