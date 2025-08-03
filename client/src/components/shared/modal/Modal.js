import React, { useState } from "react";
import { useSelector } from "react-redux";
import InputType from "./../Form/InputType";
import API from "./../../../services/API";

const Modal = () => {
  const [inventoryType, setInventoryType] = useState("in");
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [email, setEmail] = useState("");
  const { user } = useSelector((state) => state.auth);
  // handle modal data
  const handleModalSubmit = async () => {
    try {
      if (!bloodGroup || !quantity) {
        alert("Please Provide All Fields");
        return;
      }
      const { data } = await API.post("/inventory/create-inventory", {
        email,
        organisation: user?._id,
        inventoryType,
        bloodGroup,
        quantity,
      });
      if (data?.success) {
        alert("New Record Created");
        window.location.reload();
      }
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error creating inventory record:", error);
      window.location.reload();
    }
  };

  return (
    <>
      {/* Modal */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <div style={{ 
                  background: 'var(--gradient-primary)', 
                  borderRadius: '50%', 
                  padding: 'var(--spacing-sm)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <i className="fa-solid fa-droplet" style={{ color: 'white', fontSize: '1rem' }}></i>
                </div>
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  Manage Blood Inventory
                </h1>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <label className="form-label">Inventory Type</label>
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="inRadio"
                      defaultChecked
                      value={"in"}
                      onChange={(e) => setInventoryType(e.target.value)}
                      className="form-check-input"
                    />
                    <label htmlFor="in" className="form-check-label">
                      Blood In
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="inRadio"
                      value={"out"}
                      onChange={(e) => setInventoryType(e.target.value)}
                      className="form-check-input"
                    />
                    <label htmlFor="out" className="form-check-label">
                      Blood Out
                    </label>
                  </div>
                </div>
              </div>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="">
                  Select Blood Group
                </option>
                <option value={"O+"}>O+</option>
                <option value={"O-"}>O-</option>
                <option value={"AB+"}>AB+</option>
                <option value={"AB-"}>AB-</option>
                <option value={"A+"}>A+</option>
                <option value={"A-"}>A-</option>
                <option value={"B+"}>B+</option>
                <option value={"B-"}>B-</option>
              </select>
              <InputType
                labelText={"Donor Email"}
                labelFor={"donorEmail"}
                inputType={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputType
                labelText={"Quantity (ML)"}
                labelFor={"quantity"}
                inputType={"number"}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleModalSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
