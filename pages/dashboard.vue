<template>
     <v-card>
    <v-layout>
      <v-navigation-drawer
        expand-on-hover
        rail
        disable-resize-watcher
      >
        <v-list>
          <v-list-item
            prepend-icon="mdi-account"
            :title="username"
            :subtitle="username+'@gmail.com'"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-folder" title="My Notes" value="myNotes" @click="selfNoteOpen"></v-list-item>
          <v-list-item prepend-icon="mdi-account-multiple" title="All Notes" value="allNotes" @click="allNotesOpen"></v-list-item>
          <v-list-item>
          <AddNote :userId="Number(userId)" :username="username" />  
          </v-list-item>
        </v-list>
        <div class="flex justify-center">
        <v-btn @click="signOut"><v-icon class="text-red">mdi-logout</v-icon></v-btn>
        </div>
      </v-navigation-drawer>
      <v-main style="height: 100vh" class="overflow-y-auto">
        <MyNotes :userId="Number(userId)" :username="username" v-if="myNotes"/>
        <Notes v-if="allNotes"/>
        </v-main>
    </v-layout>
  </v-card>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
      setup() {
        const myNotes = ref(true)
        const allNotes = ref(false)
        const route = useRoute();
        const router = useRouter();
        const userId = route.query.userId;
        const username = route.query.username
        const signOut=()=>{
          router.push({path: '/'})
        }
        const selfNoteOpen = ()=>{
          myNotes.value = true
          allNotes.value = false
        }
        const allNotesOpen =()=>{
          myNotes.value = false
          allNotes.value = true
        }
        
        return {username, userId, signOut, myNotes, selfNoteOpen, allNotes, allNotesOpen}
        
    },
})
</script>
