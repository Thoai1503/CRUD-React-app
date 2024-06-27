import { faCheck, faInfo, faPen, faPlus, faSearch, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Image, InputGroup, Modal, Row, Table } from "react-bootstrap";

const Users = () => {
    // State users chứa danh sách tài khoản
    const [users, setUsers] = useState([]);

    // State selectedUser chứa tài khoản đang chọn
    const [selectedUser, setSelectedUser] = useState({});

    // State newUser chứa tài khoản đang được thêm
    const [newUser, setNewUser] = useState({});

    // State showInfoModal cho phép ẩn/hiện modal chi tiết tài khoản
    const [showInfoModal, setShowInfoModal] = useState(false);
    const handleCloseInfoModal = () => setShowInfoModal(false);
    const handleShowInfoModal = () => setShowInfoModal(true);

    // State showAddModal cho phép ẩn/hiện modal thêm tài khoản
    const [showAddModal, setShowAddModal] = useState(false);
    const handleCloseAddModal = () => setShowAddModal(false);
    const handleShowAddModal = () => setShowAddModal(true);

    // State showDeleteModal cho phép ẩn/hiện modal xác nhận xóa
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleShowDeleteModal = () => setShowDeleteModal(true);

    const [mode, setMode] = useState(true);


    // Load danh sách tài khoản
    useEffect(() => {
        axios.get('https://dummyjson.com/users')
            .then(res => setUsers(res.data.users));
    }, []);

    // Xử lý sự kiện onChange của input
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setNewUser({ ...newUser, [name]: value });
    }

    // Thêm và sửa tài khoản vào danh sách
    const handleAdd = () => {
        if (mode) {
            axios.post('https://dummyjson.com/users/add', newUser)
                .then(res => {
                    setUsers([...users, newUser]);
                    handleCloseAddModal();
                });
        }
        else {
            axios.put(`https://dummyjson.com/users/${newUser.id}`, newUser)
                .then(res => {
                    let data = users;
                    let index = data.findIndex(item => item.id == newUser.id);
                    data[index] = newUser;
                    setUsers(data);
                    handleCloseAddModal();
                })
        }
    }

    // Xóa tài khoản đang chọn
    const handleDelete = () => {
        axios.delete(`https://dummyjson.com/users/${selectedUser.id}`)
            .then(res => {
                setUsers(users.filter(item => item.id != selectedUser.id));
                handleCloseDeleteModal();
            });
    }

    const [SearchUser, setSearchUser] = useState({});
    const handleChangeSeach = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setSearchUser({ ...newUser, [name]: value });
    }

    const handleSearch = () => {
        setUsers(users.filter(item => ((item.firstName == SearchUser.searchName))));
    };


    return (
        <>
            <Row>
                <Col md={8}>
                    <Button variant="success" style={{ marginBottom: '5px' }} onClick={() => { setMode(true); setNewUser({}); handleShowAddModal() }}>
                        <FontAwesomeIcon icon={faPlus} /> Add user
                    </Button>
                </Col>
                <Col md={4}>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" name="searchName" onChange={handleChangeSeach} />
                        <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                            <FontAwesomeIcon icon={faSearch} />
                        </Button>
                    </InputGroup>
                </Col>
            </Row>




            <Table striped bordered hover>
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Full name</th>
                        <th>Age</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Functions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(item => (
                            <tr>
                                <td>{item.id}</td>
                                <td>{item.firstName} {item.lastName}</td>
                                <td>{item.age}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td>
                                    <Button variant="info" style={{ marginRight: '5px' }}
                                        onClick={() => { setSelectedUser(item); handleShowInfoModal() }}>
                                        <FontAwesomeIcon icon={faInfo} />
                                    </Button>
                                    <Button variant="warning" style={{ marginRight: '5px' }}
                                        onClick={() => { setMode(false); setNewUser(item); setSelectedUser(item); handleShowAddModal() }}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </Button>
                                    <Button variant="danger" style={{ marginRight: '5px' }}
                                        onClick={() => { setSelectedUser(item); handleShowDeleteModal() }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>

            {/* Modal hiển thị chi tiết tài khoản */}
            <Modal show={showInfoModal} size="lg" centered onHide={handleCloseInfoModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedUser.firstName} {selectedUser.lastName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={4}>
                            <Image src={selectedUser.image} style={{ width: '100%' }} />
                        </Col>
                        <Col md={4}>
                            <dl>
                                <dt>Maiden name:</dt>
                                <dd>{selectedUser.maidenName}</dd>
                                <dt>Age:</dt>
                                <dd>{selectedUser.age}</dd>
                                <dt>Gender:</dt>
                                <dd>{selectedUser.gender}</dd>
                                <dt>Email:</dt>
                                <dd>{selectedUser.email}</dd>
                            </dl>
                        </Col>
                        <Col md={4}>

                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseInfoModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCloseInfoModal}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal hiển thị form thêm tài khoản */}
            <Modal show={showAddModal} centered onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title> {mode ? 'Add new user' : 'Edit user'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>First name:</Form.Label>
                            <Form.Control type="text" name="firstName" value={newUser.firstName} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label>Last name:</Form.Label>
                            <Form.Control type="text" name="lastName" value={newUser.lastName} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                            <Form.Label>Maiden name:</Form.Label>
                            <Form.Control type="text" name="maidenName" value={newUser.maidenName} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                            <Form.Label>Age:</Form.Label>
                            <Form.Control type="number" name="age" value={newUser.age} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" name="email" value={newUser.email} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleAdd}>
                        <FontAwesomeIcon icon={faCheck} /> Save
                    </Button>
                    <Button variant="secondary" onClick={handleCloseAddModal}>
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xác nhận xóa tài khoản */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete user: {selectedUser.firstName} {selectedUser.lastName}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDelete}>
                        <FontAwesomeIcon icon={faCheck} /> Confirm
                    </Button>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Users;