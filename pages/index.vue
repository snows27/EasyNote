<template>
  <Navbar />
  <v-main>
    <v-container
      style="height: 100vh"
      class="d-flex align-center justify-center"
    >
      <div>
        <h1 class="font-bold text-3xl">Create Note?</h1>
        <nuxt-link to="/signin">
          <p class="text-center text-blue hover:text-blue-200 cursor-pointer underline">
            <span v-if="!username">Sign in</span>
          </p>
        </nuxt-link>
        <nuxt-link to="/dashboard">
          <p class="text-center text-blue hover:text-blue-200 cursor-pointer underline">
            <span v-if="username">Go to Dashboard</span>
          </p>
        </nuxt-link>
      </div>
    </v-container>
  </v-main>
  <Footer />
</template>


<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {
    const username = ref("");
    onMounted(() => {
      const retriveUsername = localStorage.getItem("username");
      if (retriveUsername) {
        username.value = retriveUsername;
      }
    });
    return { username };
  },
});
</script>
