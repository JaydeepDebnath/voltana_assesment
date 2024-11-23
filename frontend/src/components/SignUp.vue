<template>
    <div class="signup">
        <h2>Create a new Account</h2>
        <form @submit.prevent="handleSignUp">
            <div>
                <label for="username">Username:</label>
                <input type="username" id="username" v-model="username" required/>
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required/>
            </div>
            <div>
                <label for="contactNumber">Contact Number:</label>
                <input type="contactNumber" id="contactNumber" v-model="contactNumber" required/>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required/>
            </div>
            <div>
                <label for="confirmPassword">Confirm password:</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" required/>
            </div>
            <button type="submit" :disabled="isSubmitting">Sign Up</button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </form>
    </div>
</template>

<script>
export default {
    data(){
        return {
            email : '',
            password : '',
            confirmPassword : '',
            isSubmitting : false,
            errorMessage : ''
        };
    },
    methods: {
        async handleSignUp(){
            if(this.password !== this.confirmPassword){
                this.errorMessage = 'Password does npot match!';
                rewturn;
            }
            this.isSubmitting = true;
            this.errorMessage = '';

            try {
              await this.$store.dispatch('register',{
                email : this.email,
                password : this.password,
              });
              this.$router.push({name:'dashboard'});
            } catch (error) {
                this.errorMessage = 'Sign up failed. Please try again.';
            } finally {
                this.isSubmitting = false;
            }
        }
    }
</script>

<style scoped>
.signup{
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    }
.error{
    color: red;
}
</style>