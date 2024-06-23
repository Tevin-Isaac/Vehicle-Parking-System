import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddRenter = ({save}) => {

    const [name, setName] = useState("");

    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  return (
    <>
        <Button
            onClick={handleShow}
            variant="dark"
        >
            Add Renter
        </Button>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>New Renter</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <FloatingLabel
                        controlId="inputName"
                        label="Name"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            placeholder="Enter name of renter"
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                    <Button
                        variant="dark"
                        disabled={!name}
                        onClick={() => {
                            save( name );
                            handleClose();
                        }}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>
  )
}

AddRenter.propTypes = {
    save: PropTypes.func.isRequired,
};

export default AddRenter