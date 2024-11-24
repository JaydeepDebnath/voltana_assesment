<template>
    <div class="dashboard">
        <h2>Dashboard</h2>
        <div>
            <button @click="inviteNewUser">Invite New User</button>
        </div>
        <ul v_if="!isLoading">
            <li v-for="user in users" :key="user.id" class="user">
                <span>{{ user.name }} ({{ user.email }})</span>
                <button @click="editUser(user)">Edit</button>
                <button @click="deleteUser(user.id)">Delete</button>
            </li>
        </ul>
        <p v-if="isLoading">Loading...</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script>
    export default {
        data () {
            return{
                users:[],
            };
        },
        computed:{
            isLoading(){
                return this.$store.getters.isLoading;
            },
            errorMessage(){
                return this.$store.getters.getError;
            }
        },
        created(){
             this.fetchUsers();
        },
        methods :{
            async fetchUsers(){
                try {
                    this.users = await this.$store.dispatch('getUsers');
                } catch (error) {
                    this.errorMessage = error.message;
                }
            },
            async deleteUser(){
                if(confirm('Are you sure want to delete this user?')){
                    try {
                        await this.$store.dispatch('deleteAccount');
                        this.users = this.user.filter(user => user.id !== id)
                    } catch (error) {
                        this.errorMessage = error.message;
                    }
                }
            },
            async editUser(user){
                this.$router.push({name:'editUser',params:{id:user.id}});
            },
            async inviteNewUser (){
                const email = prompt('Enter the email address of the user to invite');
                if(email){
                    try {
                        await this.$store.dispatch('inviteUser',email);
                        alert('INvitation sent!');
                    } catch (error) {
                        this.errorMessage = error.message;
                    }
                }
            }
        }
    }
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}
.user {
  margin: 10px 0;
}
button {
  margin-left: 10px;
  padding: 8px 16px; 
  border: none; 
  background-color: #007BFF; 
  color: white;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.error {
    color: #ff3b30;
  font-size: 14px;
  margin-top: 20px;
  font-weight: bold;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 5px;
}
</style>