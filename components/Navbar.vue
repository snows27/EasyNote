<template>
  <v-app-bar app color="primary" position="fixed" height="56">
    <v-app-bar-title class="text-h5">
      <span>Note</span>
      <span> Easy</span>
    </v-app-bar-title>
    <template v-if="username">
      <v-menu
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ props }">
          <span>Hello, {{username}}</span>
        <v-app-bar-nav-icon v-bind="props"></v-app-bar-nav-icon>
      </template>
      <v-list>
        <v-list-item center>
          <v-list-item-title class="cursor-pointer">Create Note</v-list-item-title>
          <hr class="m-2">
          <v-list-item-title @Click="logOut" class="cursor-pointer hover:bg-rose-500 duration-200 hover:text-white">Sign out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    </template>
    <template v-else>
      <nuxt-link to="/signin" class="mr-5 text-decoration-none">
        <v-btn variant="outlined">
          Sign in
          <v-icon class="ml-2">mdi-login</v-icon>
        </v-btn>
      </nuxt-link>
    </template>
  </v-app-bar>
</template>
<script>
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  setup() {
    const router = useRouter();
    const menuItems = [{ title: "Create Note", methods: "createNote" }, { title: "Log Out", methods: "logOut"}];
    const username = ref('')
    onMounted(()=>{
      const retriveUsername = localStorage.getItem('username')
      if(retriveUsername){
      username.value = retriveUsername
      console.log(username.value)
    }
    })
    const logOut = ()=>{
      localStorage.removeItem('username');
      username.value = ''
      console.log('***Sign Out***')
      router.push({path: '/signin'})
    }
    
    
    
      
      

    return { menuItems, logOut, username };
    }
  
  },
);
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
  color: inherit;
}
</style>
