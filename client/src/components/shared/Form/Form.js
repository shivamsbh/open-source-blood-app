import React, { useState } from "react";
import InputType from "./InputType";
import { Link } from "react-router-dom";
import { handleLogin, handleRegister } from "../../../services/authService";

const Form = ({ formType, submitBtn, formTitle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [name, setName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <div>
      <form
        onSubmit={(e) => {
          if (formType === "login")
            return handleLogin(e, email, password, role);
          else if (formType === "register")
            return handleRegister(
              e,
              name,
              role,
              email,
              password,
              phone,
              organisationName,
              address,
              hospitalName,
              website
            );
        }}
      >
        <h1 className="text-center" style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: 'var(--text-3xl)', 
          fontWeight: '700',
          color: 'var(--secondary-color)',
          marginBottom: 'var(--spacing-lg)'
        }}>{formTitle}</h1>
        <hr style={{ 
          border: 'none', 
          height: '2px', 
          background: 'var(--gradient-primary)', 
          marginBottom: 'var(--spacing-xl)' 
        }} />
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-lg)', 
          marginBottom: 'var(--spacing-xl)',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="role"
              id="donorRadio"
              value={"donor"}
              onChange={(e) => setRole(e.target.value)}
              defaultChecked
            />
            <label htmlFor="donorRadio" className="form-check-label" style={{
              fontFamily: 'var(--font-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: 'var(--secondary-color)'
            }}>
              Donor
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="role"
              id="adminRadio"
              value={"admin"}
              onChange={(e) => setRole(e.target.value)}
            />
            <label htmlFor="adminRadio" className="form-check-label" style={{
              fontFamily: 'var(--font-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: 'var(--secondary-color)'
            }}>
              Admin
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="role"
              id="hospitalRadio"
              value={"hospital"}
              onChange={(e) => setRole(e.target.value)}
            />
            <label htmlFor="hospitalRadio" className="form-check-label" style={{
              fontFamily: 'var(--font-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: 'var(--secondary-color)'
            }}>
              Hospital
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="role"
              id="organisationRadio"
              value={"organisation"}
              onChange={(e) => setRole(e.target.value)}
            />
            <label htmlFor="organisationRadio" className="form-check-label" style={{
              fontFamily: 'var(--font-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: 'var(--secondary-color)'
            }}>
              Organisation
            </label>
          </div>
        </div>
        {/* switch statement */}
        {(() => {
          //eslint-disable-next-line
          switch (true) {
            case formType === "login": {
              return (
                <>
                  <InputType
                    labelText={"email"}
                    labelFor={"forEmail"}
                    inputType={"email"}
                    name={"email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputType
                    labelText={"Password"}
                    labelFor={"forPassword"}
                    inputType={"password"}
                    name={"password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              );
            }
            case formType === "register": {
              return (
                <>
                  {(role === "admin" || role === "donor") && (
                    <InputType
                      labelText={"Name"}
                      labelFor={"forName"}
                      inputType={"text"}
                      name={"name"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  )}
                  {role === "organisation" && (
                    <InputType
                      labelText={"Organisation Name"}
                      labelFor={"fororganisationName"}
                      inputType={"text"}
                      name={"organisationName"}
                      value={organisationName}
                      onChange={(e) => setOrganisationName(e.target.value)}
                    />
                  )}
                  {role === "hospital" && (
                    <InputType
                      labelText={"Hospital Name"}
                      labelFor={"forHospitalName"}
                      inputType={"text"}
                      name={"hospitalName"}
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                    />
                  )}

                  <InputType
                    labelText={"email"}
                    labelFor={"forEmail"}
                    inputType={"email"}
                    name={"email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputType
                    labelText={"Password"}
                    labelFor={"forPassword"}
                    inputType={"password"}
                    name={"password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputType
                    labelText={"website"}
                    labelFor={"forWebsite"}
                    inputType={"text"}
                    name={"website"}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                  <InputType
                    labelText={"Address"}
                    labelFor={"forAddress"}
                    inputType={"text"}
                    name={"address"}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <InputType
                    labelText={"Phone"}
                    labelFor={"forPhone"}
                    inputType={"text"}
                    name={"phone"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </>
              );
            }
          }
        })()}

        <div className="d-flex flex-row justify-content-between">
          {formType === "login" ? (
            <p style={{ 
              fontFamily: 'var(--font-secondary)', 
              fontSize: 'var(--text-base)', 
              fontWeight: '500',
              textAlign: 'center',
              color: 'var(--secondary-light)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Not registered yet? 
              <Link to="/register" style={{ 
                color: 'var(--primary-color)', 
                fontWeight: '600',
                textDecoration: 'none',
                marginLeft: 'var(--spacing-xs)'
              }}> Register Here!</Link>
            </p>
          ) : (
            <p style={{ 
              fontFamily: 'var(--font-secondary)', 
              fontSize: 'var(--text-base)', 
              fontWeight: '500',
              textAlign: 'center',
              color: 'var(--secondary-light)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Already have an account?
              <Link to="/login" style={{ 
                color: 'var(--primary-color)', 
                fontWeight: '600',
                textDecoration: 'none',
                marginLeft: 'var(--spacing-xs)'
              }}> Login Here!</Link>
            </p>
          )}
          <button className="btn btn-primary" type="submit">
            {submitBtn}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
