import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";


// addvehicle
export async function createVehicle(vehicle) {
  return window.canister.vehicleRent.addVehicle(vehicle);
}

// addvehicleParking
export async function createvehicleParking(vehicleParking) {
  return window.canister.vehicleRent.addVehicleParking(vehicleParking);
}

// addRenter
export async function createRenter(renter) {
  return window.canister.vehicleRent.addRenter(renter);
}


export async function getVehicles() {
  try {
    return await window.canister.vehicleRent.getVehicles();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// get Vehicle
export async function getVehicle(id) {
  return window.canister.vehicleRent.getVehicle(id);
}

// getvehicleParking
export async function getvehicleParkings() {
  return window.canister.vehicleRent.getvehicleParking();
}

// getVehicleParking
export async function getVehicleParking(id) {
  return window.canister.vehicleRent.getvehicleParking(id);
}

// getRenters
export async function getRenters() {
  return window.canister.vehicleRent.getRenters();
}

// getRenter
export async function getRenter(id) {
  return window.canister.vehicleRent.getRenter(id);
}

// rentvehicle Parking
export async function RentVehicleParking(renterId, vehicleParkingId) {
  return window.canister.vehicleRent.RentVehicleParking(renterId, vehicleParkingId);
}

// returnvehicleParking
export async function returnvehicleParking(vehicleParkingId) {
  return window.canister.vehicleRent.returnvehicleParking(vehicleParkingId);
}

// updateVehicle
export async function updateVehicle(vehicle) {
  return window.canister.vehicleRent.updateVehicle(vehicle);
}

// updateVehicleParking

export async function updateVehicleParking(vehicleParking) {
  return window.canister.vehicleRent.updateVehicleParking(vehicleParking);
}

// updateRenter
export async function updateRenter(renter) {
  return window.canister.vehicleRent.updateRenter(renter);
}

// deleteVehicle
export async function deleteVehicle(id) {
  return window.canister.vehicleRent.deleteVehicle(id);
}

// deletevehicleparking
export async function deleteVehicleParking(id) {
  return window.canister.vehicleRent.deleteVehicleParking(id);
}

// deleteRenter
export async function deleteRenter(id) {
  return window.canister.vehicleRent.deleteRenter(id);
}

// getvehicleparkings
export async function getVehicleParkingVehicles(vehicleParkingId) {
  return window.canister.vehicleRent.getVehicleParkingVehicles(vehicleParkingId);
}

// addvehicleTovehicle parking
export async function addVehicleToVehicleParking(vehicleParkingId, vehicleId) {
  return window.canister.vehicleRent.addVehicleToVehicleParking(vehicleParkingId, vehicleId);
}

// removeVehicleFromVehicleParking
export async function removeVehicleFromVehicleParking(vehicleParkingId, vehicleId) {
  return window.canister.vehicleRent.removeVehicleFromVehicleParking(vehicleParkingId, vehicleId);
}

// rentPayvehicleparking
export async function rentPayVehicleParking(vehiclePark) {
  const marketplaceCanister = window.canister.vehicleRent;
  const orderResponse = await marketplaceCanister.createReservePaymentOrder(vehiclePark.id);
  const sellerPrincipal = Principal.from(orderResponse.Ok.reservor);
  const sellerAddress = await marketplaceCanister.getAddressFromPrincipal(sellerPrincipal);
  const block = await transferICP(sellerAddress, orderResponse.Ok.price, orderResponse.Ok.memo);
  await marketplaceCanister.completeReservePayment(sellerPrincipal, vehiclePark.id, orderResponse.Ok.price, block, orderResponse.Ok.memo);
}
