import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddVehicle = ({ save }) => {
    const [licensePlate, setLicensePlate] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [color, setColor] = useState("");
    const [description, setDescription] = useState("");

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button
                onClick={handleShow}
                variant="dark"
            >
                Add Vehicle
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>New Vehicle</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="inputLicensePlate"
                            label="License Plate"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                onChange={(e) => {
                                    setLicensePlate(e.target.value);
                                }}
                                placeholder="Enter license plate"
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputMake"
                            label="Make"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Enter make of vehicle"
                                onChange={(e) => {
                                    setMake(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputModel"
                            label="Model"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Enter model of vehicle"
                                onChange={(e) => {
                                    setModel(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputColor"
                            label="Color"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Enter color of vehicle"
                                onChange={(e) => {
                                    setColor(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputDescription"
                            label="Description"
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                placeholder="Enter description of vehicle"
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                save({
                                    licensePlate,
                                    make,
                                    model,
                                    color,
                                    description,
                                });
                                handleClose();
                            }}
                            disabled={!licensePlate || !make || !model || !color || !description}
                        >
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

AddVehicle.propTypes = {
    save: PropTypes.func.isRequired,
};

export default AddVehicle;
