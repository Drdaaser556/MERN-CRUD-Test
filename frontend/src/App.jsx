import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Container } from 'react-bootstrap';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`http://localhost:5000/users/${editId}`, form);
    } else {
      await axios.post('http://localhost:5000/users', form);
    }
    setForm({ name: '', email: '' });
    setEditId(null);
    setShow(false);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditId(user._id);
    setShow(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    fetchUsers();
  };

  return (
    <Container className="mt-5">
      <h2>MERN CRUD App</h2>
      <Button onClick={() => setShow(true)}>Add User</Button>
      <Table className="mt-3" striped bordered hover>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <Button size="sm" variant="info" onClick={() => handleEdit(u)}>Edit</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(u._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => { setShow(false); setForm({ name: '', email: '' }); setEditId(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit' : 'Add'} User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={form.email} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{editId ? 'Update' : 'Add'}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
