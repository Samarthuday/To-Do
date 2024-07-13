# To - Do

## Overview

To-Do is a web application designed to help users manage their tasks efficiently. It provides functionalities to add, update, delete tasks, and set reminders. The application runs on XAMPP, leveraging MySQL for database management and Apache for the web server. Task reminders are implemented using JavaScript. Upon user login, a hashed table is created to securely store user-specific tasks.

## Features

- **Add Task**: Users can add new tasks to their task list.
- **Update Task**: Users can update existing tasks.
- **Delete Task**: Users can delete tasks they no longer need.
- **Set Reminder**: Users can set reminders for their tasks using JavaScript.
- **User Authentication**: Users can log in, and their tasks are stored in a hashed table for security.

## Prerequisites

- XAMPP (Apache and MySQL)
- Web Browser (Chrome, Firefox, etc.)

## Installation

1. **Download and Install XAMPP**:
   - Download XAMPP from [apachefriends.org](https://www.apachefriends.org/index.html).
   - Install XAMPP and start the Apache and MySQL services from the XAMPP control panel.

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/To-Do.git
   ```

3. **Set Up the Database**:
   - Open phpMyAdmin by navigating to `http://localhost/phpmyadmin`.
   - Create a new database named `To-Do`.

4. **Configure the Application**:
   - Open the `config.php` file located in the root directory of the project.
   - Update the database configuration settings as needed:
     ```php
     define('DB_SERVER', 'localhost');
     define('DB_USERNAME', 'root');
     define('DB_PASSWORD', '');
     define('DB_NAME', 'To-Do');
     ```
   - In Database create a table named users with name, email & password.

5. **Start the Application**:
   - Place the project folder inside the `htdocs` directory of your XAMPP installation.
   - Open your web browser and navigate to `http://localhost/To-Do`.

## Usage

1. **Register**: Create a new account by clicking on the "Register" link and filling in the required details.
2. **Login**: Log in using your credentials.
3. **Add Task**: Use the "Add Task" button to create a new task.
4. **Update Task**: Click on the task you want to update and make the necessary changes.
5. **Delete Task**: Click on the delete icon next to the task you want to remove.
6. **Set Reminder**: Click on the "Set Reminder" button next to a task to set a reminder using JavaScript.

## File Structure

```
To-Do/
├── frontend/
│   └── public
│       ├── res
│       │   ├── favicon.ico
│       │   ├── notification_sound.mp3
|       ├──config.php
│       ├──delete_task.php
│       ├──fetch_tasks.php
│       ├──login.php
│       ├──signup.php
│       ├──move_to_trash.php
│       ├──save_task.php
│       ├──index.html
│       ├──login.html
│       ├──signup.html
│       ├──main.html
│       ├──main.js
│       ├──task.html
│       ├──subscribe.html
│       ├──pro.html
│       ├──payment.html
│       ├──indexstyle.css
│       ├──style.css
│       ├──styless.css
│       ├──mainstyle.css
└── README.md


## Conclusion

To-Do is a powerful yet simple tool for task management. By utilizing XAMPP for backend support and JavaScript for setting reminders, To-Do ensures a seamless user experience. Whether you're an individual looking to keep track of personal tasks or a team aiming to manage projects, To-Do provides a robust solution. We welcome feedback and contributions to make this tool even better. Happy tasking!