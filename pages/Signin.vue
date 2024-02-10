<template>
  <v-container class="d-flex align-center justify-center" style="height: 100vh">
    <v-sheet width="400" elevation="12" rounded class="px-10 pt-10 pb-10">
      <v-form @submit.prevent>
        <h3 class="text-center text-3xl font-bold">Note Easy</h3>
        <br />
        <v-text-field
          label="username"
          v-model="username"
          :rules="usernameRules"     
        ></v-text-field>
        <span></span>
        <v-text-field
          label="password"
          type="password"
          v-model="password"
          :rules="passwordRules"
        ></v-text-field>
        <p v-if="invalidSignin" class="text-red">Please check your username and password</p>
        <v-btn
          type="submit"
          color="primary"
          class="float-right"
          @click="signIn"
          ><span class="font-semibold">Sign In</span></v-btn
        >
      </v-form>
      <nuxt-link to="/" class="text-decoration-none">
        <v-icon>mdi-arrow-left</v-icon>
      </nuxt-link>
    </v-sheet>
  </v-container>
</template>
<script>
import {defineComponent, ref} from '@vue/composition-api'
export default defineComponent({
    async setup() {
        const route = useRouter()
        const username = ref(null)
        const password = ref(null)
        const dataFetch = await import('../data/data.json')
        const invalidSignin = ref(false)
        const users = dataFetch.users
        
        const checkUsernameExists = () => {
          return users.some(user => user.username === username.value)
        }
        const checkPassword =() =>{
          return users.some(user => user.password === password.value)
        }
        const usernameRules = [
             (value) => !!value || 'username is required'   
        ]
        const passwordRules = [
            (value) => !!value || 'password is required'
        ]

        const signIn = ()=>{
            if(username.value !== null || password.value !== null){
              if(checkUsernameExists() && checkPassword()){
                alert('login success')
                const user = users.find(user => user.username === username.value)
                route.push({path: '/dashboard', query: {userId: user.id, username: user.username}})
              }
              else if(username.value === null || password.value === null){
                invalidSignin.value = false
              } else {
                invalidSignin.value = true
              }
              
              }
              
            }
          
        
          
        
        return {username, password, usernameRules, passwordRules, signIn, invalidSignin}
   
    },
})
</script>


<style scoped>
.float-right {
  margin-left: auto;
}
.text-decoration-none {
  text-decoration: none;
  color: inherit;
}
</style>
