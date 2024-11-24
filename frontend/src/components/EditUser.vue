<template>
    <div class="edit-user">
        <h2>Edit user details:</h2>
        <form @submit.prevent="updateUser">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="user.name" >
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="user.email" required />
            </div>
            <div>
                <label for="contactNumber">Contact Number:</label>
                <input type="tel" id="contactNumber" v-model="user.contactNumber" >
            </div>
            <div>
                <label for="role">Role:</label>
                <input type="text" id="role" v-model="user.role" >
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="user.password" >
            </div>
            <div>
                <label for="confirmPassword">Confirm password:</label>
                <input type="password" id="confirmPassword" v-model="user.confirmPassword"/>
            </div>
      <button type="submit" :disabled="isSubmitting">Update User</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                user:{
                    name:'',
                    email:'',
                    contactNumber: '',
                    role:'',
                    password:'',
                    confirmPassword: '',
                },
                isSubmitting:false,
                errorMessage:'',
            };
        },
        computed:{
            isLoading(){
                return this.$store.getters.isLoading; 
            },
        },
        async created(){
            const userId = this.$route.params.id;
            await this.fetchUser(userId);
        },
        methods:{
            async fetchUser(userId){
                try {
                    const users = await this.$store.dispatch('getUsers');
                    const user = users.find(user => user.id === userId);
                    if(user){
                        this.user = {...user}
                    }else{
                        this.errorMessage = 'User not found !';
                    }
                } catch (error) {
                    this.errorMessage = error.message; 
                }
            },
            async updateUser(){
                this.isSubmitting = true;
                this.errorMessage = '';

                try {
                    const userId = this.$route.params.id;
                    await this.$store.dispatch('updateAccountDetails',{
                        id:userId,
                        ...this.user
                    });
                    this.$router.push({name:'dashboard'});
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
.edit-user {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

.edit-user h2 {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  font-size: 14px;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
  display: block;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus,
input[type="password"]:focus {
  border-color: #007BFF;
  outline: none;
}

button {
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

.error {
  color: #d9534f;
  font-size: 14px;
  font-weight: bold;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #d9534f;
  margin-top: 20px;
}

@media (max-width: 480px) {
  .edit-user {
    padding: 15px;
  }

  .edit-user h2 {
    font-size: 20px;
  }

  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="password"],
  button {
    font-size: 14px;
  }
}
</style>
