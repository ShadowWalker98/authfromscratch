<template>
  <section>
    <h1>Dashboard</h1>
    <h3 v-if="!user"> Getting user information</h3>
    <h3 v-if="user">Hello {{user.username}}! </h3>
    <button @click="logout" class="btn btn-secondary">Logout</button>
    <br/>
    <br/>
    <button @click="showForm = !showForm" class="btn btn-info">Toggle Form</button>
    <form v-if="showForm" @submit.prevent="addNote()">
      <div class="form-group">
        <label for="title">Note Title</label>
        <input
          v-model="newNote.title"
          type="text"
          class="form-control"
          id="title"
          aria-describedby="titleHelp"
          placeholder="Enter a title" required>
        <small
          id="titleHelp"
          class="form-text text-muted">
          Enter a descriptive title for your note
        </small>
      </div>
      <div class="form-group">
        <label for="note">Note </label>
        <textarea
          v-model="newNote.note"
          class="form-control"
          id="note"
          placeholder="Enter your note"
          rows="3" required>
        </textarea>
      </div>
      <button type="submit" class="btn btn-success">Add note!</button>
    </form>
    <section class="row mt-3">
      <div class="col-4"
        v-for="note in notes"
        :key="note._id">
          <div class="card text-white mb-3 ">
            <div class="card-header">{{note.title}}</div>
            <div class="card-body">
              <p class="card-text">{{note.note}}</p>
            </div>
          </div>
      </div>

    </section>
  </section>
</template>

<script>

const API_URL = 'http://localhost:5000/';

export default {
  data: () => ({
    showForm: false,
    user: {},
    newNote: {
      title: '',
      note: '',
    },
    notes: []
  }),
  mounted() {
    fetch(API_URL, {
      headers: {
        authorization: 'Bearer ' + localStorage.token
      }
    }).then(result => result.json())
    .then((result) => {
      if(result.user) {
        this.user = result.user;
        this.getNotes();
      } else {
        this.logout();
      }
    });
  },
  methods: {
    getNotes() {
      fetch(API_URL + 'api/v1/notes', {
        headers: {
          authorization: 'Bearer ' + localStorage.token,
        },
      }).then(res => res.json())
      .then((notes) => {
        this.notes = notes;
       })
    },
    addNote() {
      console.log("Sending note");
      fetch('http://localhost:5000/api/v1/notes', {
        method: "POST",
        body: JSON.stringify(this.newNote),
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer ' + localStorage.token
        }
      }).then((res) => {
        return res.json();
      }).then((note) => {
        this.notes.push(note);
        console.log(note);
        this.newNote = {
          title: '',
          note: '',
        }
      });
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
};
</script>
<style>

</style>