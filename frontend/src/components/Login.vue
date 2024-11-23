<template>
    <div class="login">
        <h2>Login</h2>
        <form @submit.prevent = "handleLogin">
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required/>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password">
            </div>
            <button type="submit" :disabled="isSubmitting">Login</button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </form>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                email:'',
                password:'',
                isSubmitting:false,
                errorMessage:''
            };
        },
        methods: {
            async handleLogin(){
                this.isSubmitting = true;
                this.correctMessage = '';

            try {
                await this.$store.dispatch('login', {
                email: this.email,
                password: this.password,
                });
            } catch (error) {
                this.errorMessage = error.message;
            } finally {
                this.isSubmitting = false;
            }
            }
        }
    }
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.error {
  color: red;
}
</style>