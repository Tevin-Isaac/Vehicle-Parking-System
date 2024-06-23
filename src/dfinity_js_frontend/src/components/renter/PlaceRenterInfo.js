import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Table } from "react-bootstrap";
import {toast} from 'react-toastify';
import { getRenters as getRentersList, rentFarmSection, returnFarmSection } from "../../utils/vehicleRent";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import DeleteRenter from "./DeleteRenter";


const PlaceRenterInfo = ({farmSectId, disabled}) => {

    const [renters, setRenters] = useState([]);


    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const getRenters = async () => {
        try {
            setLoading(true);
            const renters = await getRentersList();
            setRenters(renters);
        } catch (error) {
            toast(<NotificationError text="Failed to fetch Renters." />);
        } finally {
            setLoading(false);
        }
    }

    const handleRentRenter = async (renterId) => {
        try {
            await rentFarmSection(renterId, farmSectId);
            console.log("Info", await rentFarmSection(renterId, farmSectId));
            toast(<NotificationSuccess text="Renter Placed successfully." />);

        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Renter Placement not successfully." />);
        }
    }

    const handleRevokeRenter = async () => {
        try {
            await returnFarmSection(farmSectId);
            toast(<NotificationSuccess text="Renter Revoked successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Renter Revocation not successfully." />);
        }
    }

    useEffect(() => {
        getRenters();
    }, []);

  return (
    <>
        <Button variant="dark"
            onClick={handleShow}
            disabled={!disabled}
        >Place Renter Info</Button>
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Renter Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Renter Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renters.map((renter, index) => (
                            <tr key={renter.id}>
                                <td>{index + 1}</td>
                                <td>{renter.name}</td>
                                <td className="d-flex justify-content-between align-items-center">
                                    <Button variant="dark"
                                        onClick={() => handleRentRenter(renter.id)}
                                    >Rent</Button>
                                    <Button variant="dark"
                                        onClick={() => handleRevokeRenter()}
                                    >Revoke</Button>
                                    <DeleteRenter renterId={renter.id} />
                                </td>
                  
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

    </>
  )
}

export default PlaceRenterInfo