<template>
  <div class="dashboard">
    <h2>Dashboard</h2>
    <div>
      <button class="invite-btn" @click="inviteNewUser">Invite New User</button>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
    
    <div v-if="isLoading" class="loading">Loading...</div>
    
    <ul v-else>
      <li v-for="user in users" :key="user.id" class="user-card">
        <div class="user-info">
          <span>{{ user.name }} ({{ user.email }} {{ user.contactNumber }})</span>
        </div>
        <div class="user-actions">
          <button class="action-btn edit-btn" @click="editUser(user)">Edit</button>
          <button class="action-btn delete-btn" @click="deleteUser(user.id)">Delete</button>
        </div>
      </li>
    </ul>

    <p v-if="users.length === 0" class="no-users">No users available</p>
    
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
            async deleteUser(id){
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
            },
            async logout(){
              try {
                await this.$store.dispatch('logout');
                this.$router.push({ name: 'login' });
              } catch (error) {
                this.errorMessage = error.message;
              }
            }
        }
    }
</script>

<style scoped>

body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #6e7df2, #e94e77);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}


.dashboard {
  max-width: 900px;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h2 {
  font-size: 28px;
  color: #333;
}

.invite-btn {
  padding: 10px 20px;
  background-color: #6e7df2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.invite-btn:hover {
  background-color: #5361eb;
}

.user-list {
  list-style: none;
  padding: 0;
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.user-card:hover {
  background-color: #f2f2f2;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.user-info {
  font-size: 16px;
  color: #333;
}

.user-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 14px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-btn {
  background-color: #28a745;
  color: white;
  border: none;
}

.edit-btn:hover {
  background-color: #218838;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
}

.delete-btn:hover {
  background-color: #c82333;
}


.loading,
.no-users {
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-top: 20px;
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

@media (max-width: 768px) {
  .dashboard {
    padding: 20px;
  }

  h2 {
    font-size: 24px;
  }

  .invite-btn {
    font-size: 14px;
    padding: 8px 16px;
  }

  .user-card {
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
  }

  .user-info {
    font-size: 14px;
  }

  .action-btn {
    font-size: 12px;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 15px;
  }

  h2 {
    font-size: 20px;
  }

  .user-card {
    padding: 10px;
  }

  .user-info {
    font-size: 12px;
  }

  .invite-btn {
    font-size: 12px;
    padding: 6px 12px;
  }

  .action-btn {
    font-size: 10px;
    padding: 5px 10px;
  }
}

</style>