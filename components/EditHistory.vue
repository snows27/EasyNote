<template>
  <v-container >
    <v-main style="height: 100vh">
          <v-table
          >
    <thead>
      <tr>
        <th class="text-left">
          Date / Time
        </th>
        <th class="text-left">
          Title / Category
        </th>
        <th class="text-left">
          Updated Content
        </th>
        <th class="text-left">
          Previous Content
        </th>
      </tr>
    </thead>
    <tbody v-for="note in paginationNotes" :key="note.id">
      <tr>
        <td v-if="note.edit_history.length > 0">{{note.edit_history[0].edited_at}}</td>
        <td v-if="note.edit_history.length > 0">{{note.title}} <span class="text-blue">#{{note.category}}</span></td>
        <td v-if="note.edit_history.length > 0">{{note.content}}</td>
        <td v-if="note.edit_history.length > 0">{{note.edit_history[0].changes}}</td>
      </tr>
    </tbody>
  </v-table>
      <v-pagination v-model="currentPage" :length="totalPages" :total-visible="3"></v-pagination>
    </v-main>
  </v-container>
      <Footer />
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
  },
  setup(props) {
    const userNotes = ref([]);
    const currentPage = ref(1);
    const logPerPages = 4;
    const paginationNotes = computed(()=>{
        const startIndex = (currentPage.value - 1) * logPerPages
        const endIndex = startIndex + logPerPages
        return sortedNotesByEditTime.value.slice(startIndex, endIndex)

    });
    const totalPages = computed(() =>
      Math.ceil(sortedNotesByEditTime.value.length / logPerPages)
    )

    const fetchUserNotes = () => {
      const storedNotes = localStorage.getItem("notes");
      console.log(JSON.parse(storedNotes));
      if (storedNotes) {
        userNotes.value = JSON.parse(storedNotes).filter(
          (note) => note.user_id === props.userId && note.edit_history.length > 0
        );
        console.log(userNotes.value);
      } else {
        userNotes.value = dataFetch.notes.filter(
          (note) => note.user_id === props.userId && note.edit_history.length > 0
        );
        console.log(userNotes.value);
      }
      return userNotes.value;
    };
    onMounted(() => {
      console.log(fetchUserNotes());
    });
    const sortedNotesByEditTime = computed(() => {
      return userNotes.value.sort((a, b) => {
        const editTimeA =
          a.edit_history.length > 0
            ? new Date(a.edit_history[0].edited_at)
            : new Date(a.created_at);
        const editTimeB =
          b.edit_history.length > 0
            ? new Date(b.edit_history[0].edited_at)
            : new Date(b.created_at);
        return editTimeB - editTimeA;
      });
    });
    return {
      userNotes,
      sortedNotesByEditTime,
      currentPage,
      logPerPages,
      paginationNotes,
      totalPages
     
      
    };
  },
});
</script>
