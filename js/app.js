const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

function scheduleNotification(task) {
  const taskTime = new Date(task.time).getTime();
  const now = new Date().getTime();
  const timeout = taskTime - now;

  if (timeout > 0) {
    setTimeout(() => {
      OneSignal.sendSelfNotification(
        "Task Reminder", // Title
        `Time for: ${task.name}`, // Message
        "https://your-site.com", // URL
        null,
        {
          icon: "icon-url.png",
        }
      );
    }, timeout);
  }
}





// เก็บ Task ใน LocalStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// ฟังก์ชันแสดง Task
// ฟังก์ชันแสดง Task
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <div 
        class="check-btn ${task.completed ? 'completed' : ''}" 
        onclick="completeTask(${index})">
        ${task.completed ? '✔' : ''}
      </div>
      <span class="task-text">${task.name} - ${new Date(task.time).toLocaleString()}</span>
      <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}
// ฟังก์ชันแก้ไข Task
function editTask(index) {
  const task = tasks[index];
  document.getElementById("editTaskName").value = task.name;
  document.getElementById("editTaskTime").value = task.time;
  document.getElementById("editTaskNote").value = task.note || "";

  // เก็บ index ของ Task ที่กำลังแก้ไข
  document.getElementById("editForm").dataset.index = index;

  // เปิด Modal
  document.getElementById("editModal").style.display = "block";
}

// บันทึกการแก้ไข
document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const index = this.dataset.index;

  tasks[index].name = document.getElementById("editTaskName").value;
  tasks[index].time = document.getElementById("editTaskTime").value;
  tasks[index].note = document.getElementById("editTaskNote").value;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();

  // ปิด Modal
  document.getElementById("editModal").style.display = "none";
});

// ฟังก์ชันปิด Modal
document.getElementById("closeModal").onclick = function () {
  document.getElementById("editModal").style.display = "none";
};

// อัปเดต Render Tasks ให้แสดง Note และปุ่ม Edit
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-container';

    li.innerHTML = `
      <div class="task-info">
        <div class="check-btn ${task.completed ? 'completed' : ''}" onclick="completeTask(${index})">
          ${task.completed ? '✔' : ''}
        </div>
        <span class="task-text">${task.name} - ${new Date(task.time).toLocaleString()}</span>
      </div>
      <span class="task-note" id="note-${index}" style="display: none;">${task.note || "ไม่มี Note"}</span>
      <button class="toggle-note-btn" onclick="toggleNote(${index})">
        <i class="fas fa-search"></i>
      </button>
      <div>
        <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    
    taskList.appendChild(li);
  });
}
function toggleNote(index) {
  const noteElement = document.getElementById(`note-${index}`);
  const toggleButton = noteElement.nextElementSibling;
  const icon = toggleButton.querySelector('i');

  if (noteElement.style.display === "none") {
    noteElement.style.display = "block";
    icon.classList.remove('fa-search');
    icon.classList.add('fa-eye-slash'); // เปลี่ยนเป็น "ซ่อน"
  } else {
    noteElement.style.display = "none";
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-search'); // เปลี่ยนกลับเป็น "ดูเพิ่ม"
  }
}



// ฟังก์ชันเพิ่ม Task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskName = document.getElementById('taskName').value;
  const taskTime = document.getElementById('taskTime').value;

  const newTask = { name: taskName, time: taskTime };
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  scheduleNotification(newTask); // ตั้งการแจ้งเตือน
  renderTasks();
  taskForm.reset();
});

// ฟังก์ชันลบ Task
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// ฟังก์ชันตั้ง Notification
function scheduleNotification(task) {
  const taskTime = new Date(task.time).getTime();
  const now = new Date().getTime();
  const timeout = taskTime - now;

  if (timeout > 0) {
    setTimeout(() => {
      new Notification("To-Do Reminder", {
        body: `Time for: ${task.name}`,
        icon: "icon-url.png"
      });
    }, timeout);
  }
}

// ขอสิทธิ์ Notification
if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      alert('Please enable notifications to get reminders.');
    }
  });
}

// โหลด Task เมื่อเริ่มต้น
renderTasks();
