<template>
  <v-dialog v-model="show" max-width="300px">
    <v-card>
      <v-card-title
        class="headline text-center"
        style="background-color: #386cbc; color: white"
      >
        <v-icon>{{ mode === 'add' ? 'mdi-plus' : 'mdi-pencil' }}</v-icon
        >{{ mode === 'add' ? 'Add Task' : 'Edit Task' }}</v-card-title
      >
      <v-form ref="taskForm">
        <v-card-text>
          <v-text-field
            v-if="mode === 'add'"
            v-model="title"
            label="Title"
            type="text"
            id="title"
            :rules="titleRules"
            required
          ></v-text-field>
          <v-text-field
            v-model="description"
            label="Description"
            type="text"
            :rules="descriptionRules"
            required
          ></v-text-field>

          <v-text-field
            v-model="deadline"
            label="Deadline"
            type="date"
            :rules="deadlineRules"
            required
          ></v-text-field>

          <v-radio-group
            inline
            v-model="priority"
            label="Priority"
            :rules="priorityRules"
            id="priority"
            required
          >
            <v-radio label="Low" value="low" color="blue"></v-radio>
            <v-radio label="Med" value="med" color="blue"></v-radio>
            <v-radio label="High" value="high" color="blue"></v-radio>
          </v-radio-group>
        </v-card-text>
      </v-form>
      <v-card-actions class="justify-end">
        <v-btn color="white" @click="addTask" style="background-color: #386cbc">
          <v-icon color="white">{{
            mode === 'add' ? 'mdi-plus' : 'mdi-pencil'
          }}</v-icon>
          {{ mode === 'add' ? 'Add' : 'Edit' }}</v-btn
        >
        <v-btn
          color="white"
          @click="closeDialog"
          style="background-color: #e4443c"
          ><v-icon color="white">mdi-cancel</v-icon>Cancel</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: Boolean,
    existingTitles: Array,
    mode: {
      type: String,
      default: 'add',
    },
    taskToEdit: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    show: {
      get() {
        return this.dialogVisible;
      },
      set(value) {
        this.$emit('update:dialogVisible', value);
      },
    },
    titleRules() {
      if (this.mode === 'add') {
        return [
          (v) => !!v || 'Title is required',
          (v) => !this.existingTitles.includes(v) || 'Title must be unique',
        ];
      } else {
        return [];
      }
    },
  },
  watch: {
    taskToEdit: {
      immediate: true,
      handler(newVal) {
        if (this.mode === 'edit' && newVal) {
          this.title = newVal.title;
          this.description = newVal.description;
          this.deadline = newVal.deadline;
          this.priority = newVal.priority;
        }
      },
    },
  },
  data() {
    return {
      title: '',
      description: '',
      deadline: '',
      priority: '',
      isComplete: '',
      descriptionRules: [(v) => !!v || 'Description is required'],
      deadlineRules: [(v) => !!v || 'Deadline is required'],
      priorityRules: [(v) => !!v || 'Priority is required'],
    };
  },
  methods: {
    closeDialog() {
      this.title = '';
      this.description = '';
      this.deadline = '';
      this.priority = '';

      this.$emit('update:dialogVisible', false);
    },
    async addTask() {
      if (
        this.mode === 'add' &&
        (this.title === '' ||
          this.description === '' ||
          this.deadline === '' ||
          this.priority === '' ||
          this.existingTitles.includes(this.title))
      ) {
        this.$refs.taskForm.validate();
        return;
      } else if (
        this.mode === 'edit' &&
        (this.title === '' ||
          this.description === '' ||
          this.deadline === '' ||
          this.priority === '')
      ) {
        this.$refs.taskForm.validate();
        return;
      }

      const taskData = {
        title: this.title,
        description: this.description,
        deadline: this.deadline,
        priority: this.priority,
        isComplete: false,
      };

      if (this.mode === 'edit') {
        taskData.id = this.taskToEdit.id;
        this.$emit('task-updated', taskData);
      } else {
        if (this.existingTitles.includes(this.title)) {
          this.$emit('show-toast', 'Title must be unique');
          return;
        }
        this.$emit('task-added', taskData);
      }

      this.$emit(
        'show-toast',
        `Task ${this.mode === 'add' ? 'added' : 'updated'} successfully`
      );
      this.closeDialog();
    },
  },
};
</script>

<style scoped></style>
