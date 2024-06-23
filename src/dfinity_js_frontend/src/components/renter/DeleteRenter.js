import React from 'react'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { deleteRenter } from '../../utils/vehicleRent';

const DeleteRenter = ({renterId}) => {
    const discardRenter = async () => {
        try {
            deleteRenter(renterId).then(() => {
                toast(<NotificationSuccess text="Renter deleted successfully." />);
                // We can also get all the remning getRenters() pass as prop
                window.location.reload();
            }).catch((error) => {
                toast(<NotificationError text="Failed to delete a Renter." />);
            })
        } catch (error) {
            console.log({error});
            toast.error("Failed to delete Renter");
        }

    }
  return (
    <Button variant="danger" 
    className="rounded-pill px-0"
    style={{ width: "38px" }}
    onClick={() => {
        discardRenter();
    }}> <i  className="bi bi-trash"></i>
    </Button>
  )
}

export default DeleteRenter