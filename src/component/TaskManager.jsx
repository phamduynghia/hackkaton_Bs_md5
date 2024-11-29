import React from 'react'
import { useState } from 'react';
import { Input, DatePicker, Button, Table, Tabs, Alert, Flex } from 'antd';
const { TabPane } = Tabs;
import { useEffect } from 'react';
import moment from 'moment';

export default function TaskManager() {

    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [error, setError] = useState('');
    const [editTask, setEditTask] = useState(null);

   
    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(savedTasks);
    }, []);

   
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    
    const addTask = () => {
        const now = moment();

      
        if (!taskName || !startTime || !endTime) {
            setError('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        if (startTime.isBefore(now.add(30, 'minutes'))) {
            setError('Thời gian bắt đầu phải lớn hơn thời gian hiện tại ít nhất 30 phút!');
            return;
        }
        if (endTime.isBefore(startTime)) {
            setError('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!');
            return;
        }

        setError('');
        setTasks([
            ...tasks,
            {
                key: Date.now(),
                taskName,
                startTime: startTime.format('DD/MM/YYYY HH:mm'),
                endTime: endTime.format('DD/MM/YYYY HH:mm'),
                isDone: false,
            },
        ]);
        setTaskName('');
        setStartTime(null);
        setEndTime(null);
    };

     
     const deleteTask = (key) => {
        setTasks(tasks.filter((task) => task.key !== key));
    };

   
    const startEditTask = (task) => {
        setEditTask(task);
        setTaskName(task.taskName);
        setStartTime(moment(task.startTime, 'DD/MM/YYYY HH:mm'));
        setEndTime(moment(task.endTime, 'DD/MM/YYYY HH:mm'));
    };

    
    const saveTask = () => {
        const now = moment();

        
        if (!taskName || !startTime || !endTime) {
            setError('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        if (startTime.isBefore(now.add(30, 'minutes'))) {
            setError('Thời gian bắt đầu phải lớn hơn thời gian hiện tại ít nhất 30 phút!');
            return;
        }
        if (endTime.isBefore(startTime)) {
            setError('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!');
            return;
        }

        setError('');
        setTasks(
            tasks.map((task) =>
                task.key === editTask.key
                    ? {
                          ...task,
                          taskName,
                          startTime: startTime.format('DD/MM/YYYY HH:mm'),
                          endTime: endTime.format('DD/MM/YYYY HH:mm'),
                      }
                    : task
            )
        );
        setEditTask(null);
        setTaskName('');
        setStartTime(null);
        setEndTime(null);
    };

    
    const renderDeadlineRow = (deadline) => {
        const now = moment();
        const deadlineTime = moment(deadline, 'DD/MM/YYYY HH:mm');
        return deadlineTime.diff(now, 'hours') <= 12 ? { backgroundColor: '#ffcccc' } : {};
    };

       
       const toggleStatus = (key) => {
        setTasks(
            tasks.map((task) =>
                task.key === key && !task.isDone 
                    ? { ...task, isDone: !task.isDone }
                    : task
            )
        );
    };

    const columns = [
        { title: 'Tên Công Việc', dataIndex: 'taskName', key: 'taskName' },
        { title: 'Bắt Đầu', dataIndex: 'startTime', key: 'startTime' },
        { title: 'Hạn', dataIndex: 'endTime', key: 'endTime' },
        {
            title: 'Trạng Thái',
            key: 'status',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => toggleStatus(record.key)}
                    style={{
                        backgroundColor: record.isDone ? '#4CAF50' : '#FF9800',
                        borderColor: record.isDone ? '#4CAF50' : '#FF9800',
                    }}
                >
                    {record.isDone ? 'Đã Hoàn Thành' : 'Đang Diễn Ra'}
                </Button>
            ),
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button onClick={() => startEditTask(record)} style={{ marginRight: 10 }}>
                        Sửa
                    </Button>
                    <Button danger onClick={() => deleteTask(record.key)}>
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <div style={{ padding: 40 }}>
                <h2 class="text-4xl font-bold text-center mb-6 " >Task Manager</h2>
                <div style={{ marginBottom: 20 }} class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input class="border border-gray-300 p-2 rounded"
                        placeholder="Tên Công Việc"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        style={{ width: 200, marginRight: 10 }}
                    />
                    <DatePicker class="border border-gray-300 p-2 rounded"
                        showTime
                        placeholder="Thời Gian Bắt Đầu"
                        onChange={(value) => setStartTime(value)}
                        style={{ marginRight: 10 }}
                        value={startTime}
                    />
                    <DatePicker class="border border-gray-300 p-2 rounded"
                        showTime
                        placeholder="Hạn"
                        onChange={(value) => setEndTime(value)}
                        style={{ marginRight: 10 }}
                        value={endTime}
                    />
                    {editTask ? (
                        <Button type="primary" class="bg-green-500 text-white px-4 py-2 rounded" onClick={saveTask}>
                            Lưu Công Việc
                        </Button>
                    ) : (
                        <Button type="primary" class="bg-green-500 text-white px-4 py-2 rounded" onClick={addTask}>
                            Thêm Công Việc
                        </Button>
                    )}
                </div>
                {error && <Alert message={error} type="error" style={{ marginBottom: 20 }} />}
                <Tabs defaultActiveKey="1" items={[
                    {
                        key: "1",
                        label: "Đang Diễn Ra",
                        children: <Table dataSource={tasks.filter((task) => !task.isDone)} columns={columns} 
                        rowClassName={(record) => renderDeadlineRow(record.endTime)}/>,
                    },
                    {
                        key: "2",
                        label: "Đã Hoàn Thành",
                        children: <Table dataSource={tasks.filter((task) => task.isDone)} columns={columns} />,
                    },
                ]} />
            </div>

        </>
    )
}
