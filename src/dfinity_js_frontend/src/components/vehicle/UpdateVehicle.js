import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { toast } from 'react-toastify';
import { getVehicle, updateVehicle } from '../../utils/parkingManagement';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';

const UpdateVehicle = ({ vehicleId }) => {

    const [name, setName] = useState("");
    const [ageRange, setAgeRange] = useState("");
    const [type, setType] = useState("");
    const [model, setModel] = useState("");
    const [description, setDescription] = useState("");

    const isFormValid = name && ageRange && type && model && description;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const vehicle = await getVehicle(vehicleId);
                setName(vehicle.name);
                setAgeRange(vehicle.ageRange);
                setType(vehicle.type);
                setModel(vehicle.model);
                setDescription(vehicle.description);  
            } catch (error) {
                console.error(error);
            }
        };
  
        fetchVehicle();
    }, [vehicleId]);

    const Update = async () => {
        try {
            await updateVehicle({ id: vehicleId, name, ageRange, type, model, description });
            toast(<NotificationSuccess text="Vehicle updated successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to update the vehicle." />);
        }
      }
    
    return (
        <>
            <Button variant="primary"
                className="rounded-pill px-0"
                style={{ width: "38px", marginRight: "2px"}}
                onClick={handleShow}>
                <i className="bi bi-pencil"></i>
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Vehicle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Name" defaultValue={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Age Range</Form.Label>
                            <Form.Control type="text" placeholder="Enter Age Range" defaultValue={ageRange} onChange={(e) => setAgeRange(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Control type="text" placeholder="Enter Type" defaultValue={type} onChange={(e) => setType(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Model</Form.Label>
                            <Form.Control type="text" placeholder="Enter Model" defaultValue={model} onChange={(e) => setModel(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter Description" defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        Update();
                        handleClose();
                    }} disabled={!isFormValid}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UpdateVehicle;
