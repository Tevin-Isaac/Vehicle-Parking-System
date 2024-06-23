import React from 'react';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { deleteVehicle } from '../../utils/parkingManagement';

const DeleteVehicle = ({ vehicleId }) => {

    const discardVehicle = async () => {
        try {
            deleteVehicle(vehicleId).then(() => {
                toast(<NotificationSuccess text="Vehicle deleted successfully." />);
                window.location.reload();
            }).catch((error) => {
                toast(<NotificationError text="Failed to delete the vehicle." />);
            });
        } catch (error) {
            console.log({ error });
            toast.error("Failed to delete vehicle");
        }
    };

    return (
        <Button
            variant="danger"
            className="rounded-pill px-0"
            style={{ width: "38px", marginRight: "2px" }}
            onClick={() => {
                discardVehicle();
            }}
        >
            <i className="bi bi-trash"></i>
        </Button>
    );
}

export default DeleteVehicle;
