<template>
  <v-app>
    <TaskDialog
      :dialogVisible="this.dialogVisible"
      :mode="currentMode"
      :taskToEdit="taskToEdit"
      :existingTitles="tasks.map((task) => task.title)"
      @update:dialogVisible="dialogVisible = $event"
      @task-added="handleTaskAdded"
      @task-updated="handleTaskUpdated"
      @show-toast="showToast"
    />
    <v-toolbar app color="primary">
      <v-toolbar-title class="text-center">
        <v-icon>mdi-menu</v-icon>FRAMEWORKS
      </v-toolbar-title>
      <v-btn type="submit" elevation="4" tonal @click="openDialog()"
        ><v-icon>mdi-plus</v-icon>ADD</v-btn
      >
    </v-toolbar>

    <v-data-table :headers="headers" :items="tasks" fixed-header
      ><template #bottom></template
      ><template v-slot:no-data>
        <span v-if="tasks.length === 0"></span>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-center">{{ item.title }}</td>
          <td class="text-center">{{ item.description }}</td>
          <td class="text-center">{{ formatDate(item.deadline) }}</td>
          <td class="text-center">{{ item.priority }}</td>
          <td class="text-center">
            <v-checkbox
              class="d-inline-flex"
              v-model="item.isComplete"
              :input-value="item.isComplete"
            ></v-checkbox>
          </td>
          <td class="text-center">
            <div class="btn-group">
              <v-btn
                v-if="!item.isComplete"
                @click="handleUpdate(item)"
                color="primary"
                type="submit"
              >
                <v-icon>mdi-pencil</v-icon> UPDATE
              </v-btn>
              <v-btn @click="handleDelete(item)" color="error" type="submit">
                <v-icon>mdi-close-circle-outline</v-icon> DELETE
              </v-btn>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-app>
</template>

<script>
import TaskDialog from './components/TaskDialog.vue';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import moment from 'moment';

export default {
  components: {
    TaskDialog,
  },
  data() {
    return {
      dialogVisible: false,
      currentMode: 'add',
      taskToEdit: {},
      headers: [
        {
          title: 'Title',
          key: 'title',
          sortable: false,
          align: 'center',
        },
        {
          title: 'Description',
          key: 'description',
          sortable: false,
          align: 'center',
        },
        {
          title: 'Deadline',
          key: 'deadline',
          sortable: false,
          align: 'center',
        },
        {
          title: 'Priority',
          key: 'priority',
          sortable: false,
          align: 'center',
        },
        {
          title: 'Is Complete',
          key: 'isComplete',
          sortable: false,
          align: 'center',
        },
        {
          title: 'Action',
          key: 'action',
          sortable: false,
          align: 'center',
        },
      ],
      taskIdCounter: 0,
      tasks: [],
    };
  },
  methods: {
    openDialog(task = null) {
      this.dialogVisible = true;
      if (task) {
        this.currentMode = 'edit';
        this.taskToEdit = { ...task };
      } else {
        this.currentMode = 'add';
        this.taskToEdit = {};
      }
    },
    closeDialog() {
      this.dialogVisible = false;
      this.taskToEdit = {};
    },
    handleTaskAdded(task) {
      const newId = ++this.taskIdCounter;
      const newTask = { task, id: newId };
      this.tasks.push(task);
    },
    showToast(message) {
      toastr.success(message);
    },
    handleDelete(item) {
      this.tasks = this.tasks.filter((task) => task !== item);
      this.showToast('Task deleted successfully');
    },
    handleUpdate(item) {
      this.taskToEdit = item;
      this.openDialog(item);
    },
    handleTaskUpdated(updatedTask) {
      const index = this.tasks.findIndex(
        (task) => task.title === updatedTask.title
      );
      if (index !== -1) {
        this.tasks = [
          ...this.tasks.slice(0, index),
          updatedTask,
          ...this.tasks.slice(index + 1),
        ];
      }
    },
    formatDate(dateString) {
      return moment(dateString).format('MM/DD/YY');
    },
  },
};

toastr.options = {
  positionClass: 'toast-bottom-right',
};
</script>
<style>
.btn-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.v-data-table th {
  width: 120px;
}

.v-data-table td {
  width: 120px;
}
</style>
