<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .container {
            width: 80%;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .content {
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Task Assignment Notification</h1>
        </div>
        <div class="content">
            <p>Dear {{ $user->name }},</p>
            <p>We are pleased to inform you that a new task has been assigned to you. Below are the details of the task:</p>
            <ul>
                <li><strong>Task Title:</strong> {{ $task->title }}</li>
                <li><strong>Description:</strong> {{ $task->description }}</li>
                <li><strong>Due Date:</strong> {{ $task->due_date }}</li>
                <li><strong>Priority:</strong> {{ $task->priority }}</li>
            </ul>
            <p>Please ensure that you complete this task by the due date. If you have any questions or need further clarification, feel free to reach out.</p>
            <p>Best regards,</p>
            <p><strong>{{ config('app.name') }} Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply directly to this email.</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
