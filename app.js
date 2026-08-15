(function () {
    "use strict";

    const STORAGE_TASKS = "taskmaster.tasks";
    const STORAGE_PIN_HASH = "taskmaster.pinHash";

    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const stats = document.getElementById("stats");
    const pinForm = document.getElementById("pin-form");
    const pinInput = document.getElementById("pin-input");
    const pinStatus = document.getElementById("pin-status");
    const clearBtn = document.getElementById("clear-btn");

    let tasks = [];

    function loadTasks() {
        try {
            const raw = localStorage.getItem(STORAGE_TASKS);
            const parsed = raw ? JSON.parse(raw) : [];
            tasks = Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            tasks = [];
        }
    }

    function saveTasks() {
        localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));
    }

    async function sha256Hex(value) {
        const data = new TextEncoder().encode(value);
        const digest = await crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(digest))
            .map(function (byte) {
                return byte.toString(16).padStart(2, "0");
            })
            .join("");
    }

    function updatePinStatus() {
        if (localStorage.getItem(STORAGE_PIN_HASH)) {
            pinStatus.textContent = "A hashed PIN is stored on this device. The original value is not saved.";
        } else {
            pinStatus.textContent = "No PIN is stored.";
        }
    }

    function render() {
        taskList.replaceChildren();

        tasks.forEach(function (task, index) {
            const item = document.createElement("li");
            item.className = task.done ? "task done" : "task";

            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "task-toggle";
            toggle.setAttribute("aria-pressed", task.done ? "true" : "false");
            toggle.setAttribute(
                "aria-label",
                (task.done ? "Mark as not done: " : "Mark as done: ") + task.name
            );
            toggle.textContent = task.done ? "[x]" : "[ ]";
            toggle.addEventListener("click", function () {
                toggleTask(index);
            });

            const name = document.createElement("span");
            name.className = "task-name";
            name.textContent = task.name;

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "task-remove";
            remove.setAttribute("aria-label", "Remove " + task.name);
            remove.textContent = "Remove";
            remove.addEventListener("click", function () {
                removeTask(index);
            });

            item.append(toggle, name, remove);
            taskList.appendChild(item);
        });

        const openCount = tasks.filter(function (task) {
            return !task.done;
        }).length;
        stats.textContent =
            tasks.length +
            (tasks.length === 1 ? " task" : " tasks") +
            " · " +
            openCount +
            " open";
    }

    function addTask(name) {
        const trimmed = name.trim();
        tasks.push({
            name: trimmed || "untitled",
            createdAt: Date.now(),
            done: false,
        });
        saveTasks();
        render();
        taskInput.value = "";
        taskInput.focus();
    }

    function toggleTask(index) {
        if (!tasks[index]) {
            return;
        }
        tasks[index].done = !tasks[index].done;
        saveTasks();
        render();
    }

    function removeTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        render();
    }

    function clearAll() {
        const confirmed = window.confirm("Clear all tasks and the saved PIN hash?");
        if (!confirmed) {
            return;
        }
        tasks = [];
        localStorage.removeItem(STORAGE_TASKS);
        localStorage.removeItem(STORAGE_PIN_HASH);
        pinInput.value = "";
        render();
        updatePinStatus();
    }

    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addTask(taskInput.value);
    });

    pinForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const pin = pinInput.value;
        if (!pin) {
            localStorage.removeItem(STORAGE_PIN_HASH);
            pinInput.value = "";
            updatePinStatus();
            return;
        }
        sha256Hex(pin)
            .then(function (hash) {
                localStorage.setItem(STORAGE_PIN_HASH, hash);
                pinInput.value = "";
                updatePinStatus();
            })
            .catch(function () {
                pinStatus.textContent = "Could not hash the PIN in this browser.";
            });
    });

    clearBtn.addEventListener("click", clearAll);

    loadTasks();
    render();
    updatePinStatus();
})();
