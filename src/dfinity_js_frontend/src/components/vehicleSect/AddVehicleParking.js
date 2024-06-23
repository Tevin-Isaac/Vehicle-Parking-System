import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddVehicleParking = ({ save }) => {
    const [name, setName] = useState("");
    const [parkingPrice, setParkingPrice] = useState(0);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button onClick={handleShow} variant="dark">
                Add Vehicle Parking
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>New Vehicle Parking</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel controlId="inputName" label="Name" className="mb-3">
                            <Form.Control
                                type="text"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                placeholder="Enter name of vehicle parking"
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputParkingPrice" label="Parking Price" className="mb-3">
                            <Form.Control
                                type="number"
                                placeholder="Enter parking price of vehicle parking"
                                onChange={(e) => {
                                    setParkingPrice(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            variant="dark"
                            onClick={() => {
                                save({
                                    name,
                                    parkingPrice
                                });
                                handleClose();
                            }}
                        >
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

AddVehicleParking.propTypes = {
    save: PropTypes.func.isRequired
};

export default AddVehicleParking;
