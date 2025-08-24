import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Added for navigation

const steps = [
  "Personal Details",
  "Family Details",
  "Educational Details",
  "Previous Experience",
  "Bank Details",
  "Upload Documents"
];

export default function App() {
  const navigate = useNavigate(); // Initialize navigation
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    // Section 1 - Personal
    name: "",
    fatherName: "",
    phone: "",
    address: "",
    presentAddress: "",
    email: "",
    dob: "",
    nationality: "",
    gender: "",
    maritalStatus: "",
    spouseName: "",
    childrenNames: "",
    // Section 2 - Family
    motherName: "",
    fatherNameFamily: "",
    siblings: "",
    emergencyContact: "",
    // Section 3 - Education
    tenthStream: "",
    tenthPercent: "",
    twelfthStream: "",
    twelfthPercent: "",
    ugPercent: "",
    // Section 4 - Experience (array)
    experiences: [
      { companyName: "", position: "", fromDate: "", toDate: "" }
    ],
    // Section 5 - Bank
    ifscCode: "",
    accountNumber: ""
  });

  const [files, setFiles] = useState({
    tenthMarksheet: null,
    twelfthMarksheet: null,
    degreeCertificate: null,
    aadhar: null,
    pan: null,
    photo: null
  });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onFile = (e) =>
    setFiles((fs) => ({ ...fs, [e.target.name]: e.target.files[0] }));

  const onExperienceChange = (i, e) => {
    const updated = [...form.experiences];
    updated[i][e.target.name] = e.target.value;
    setForm((f) => ({ ...f, experiences: updated }));
  };

  const addExperience = () => {
    setForm((f) => ({
      ...f,
      experiences: [...f.experiences, { companyName: "", position: "", fromDate: "", toDate: "" }]
    }));
  };

  const removeExperience = (i) => {
    const updated = [...form.experiences];
    updated.splice(i, 1);
    setForm((f) => ({ ...f, experiences: updated }));
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "experiences") {
        data.append(k, JSON.stringify(v));
      } else {
        data.append(k, v);
      }
    });
    Object.entries(files).forEach(([k, v]) => v && data.append(k, v));

    try {
      const res = await axios.post("http://localhost:5000/api/onboard", data);
      alert("Submitted! ID: " + res.data.id);
      setStep(0);
    } catch (err) {
      alert("Submit failed: " + (err.response?.data?.error || err.message));
    }
  };

  // validation logic per step
  const isStepValid = () => {
    switch (step) {
      case 0: // Personal
        return form.name && form.fatherName && form.phone && form.address && form.email &&
               form.dob && form.nationality && form.gender && form.maritalStatus;
      case 1: // Family
        return form.motherName && form.fatherNameFamily && form.emergencyContact;
      case 2: // Education
        return form.tenthPercent && form.twelfthPercent && form.ugPercent &&
               files.tenthMarksheet && files.twelfthMarksheet && files.degreeCertificate;
      case 3: // Experience (optional, so always valid)
        return true;
      case 4: // Bank
        return form.ifscCode && form.accountNumber;
      case 5: // Documents
        return files.aadhar && files.pan && files.photo;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Employee Onboarding Form</h1>

        {/* Progress */}
        <div className="flex items-center mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center w-full">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {i + 1}
              </div>
              <div className="hidden sm:block ml-2 mr-4 text-sm">{label}</div>
              {i < steps.length - 1 && (
                <div className={`h-1 flex-1 ${i < step ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="NAME *" name="name" value={form.name} onChange={onChange} required />
            <Input label="FATHER'S NAME *" name="fatherName" value={form.fatherName} onChange={onChange} required />
            <Input type="tel" pattern="\d{10}" label="PHONE NUMBER *" name="phone" value={form.phone} onChange={onChange} required />
            <Input label="Permanent Address *" name="address" value={form.address} onChange={onChange} required />
            <Input label="Present Address" name="presentAddress" value={form.presentAddress} onChange={onChange} />
            <Input type="email" label="Personal Email ID *" name="email" value={form.email} onChange={onChange} required />
            <Input type="date" label="Date of Birth *" name="dob" value={form.dob} onChange={onChange} required />
            <Input label="NATIONALITY *" name="nationality" value={form.nationality} onChange={onChange} required />
            <Select label="Gender *" name="gender" value={form.gender} onChange={onChange} options={["Male","Female","Prefer not to say","Others"]} required />
            <Select label="Marital Status *" name="maritalStatus" value={form.maritalStatus} onChange={onChange} options={["Single","Married","Divorced","Widowed"]} required />
            <Input label="Spouse Name" name="spouseName" value={form.spouseName} onChange={onChange} />
            <Input label="Children Names" name="childrenNames" value={form.childrenNames} onChange={onChange} />
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="MOTHER'S NAME *" name="motherName" value={form.motherName} onChange={onChange} required />
            <Input label="FATHER'S NAME *" name="fatherNameFamily" value={form.fatherNameFamily} onChange={onChange} required />
            <Input label="SIBLINGS IF ANY (NAME)" name="siblings" value={form.siblings} onChange={onChange} />
            <Input type="tel" pattern="\d{10}" label="EMERGENCY CONTACT NUMBER *" name="emergencyContact" value={form.emergencyContact} onChange={onChange} required />
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="10TH STREAM" name="tenthStream" value={form.tenthStream} onChange={onChange} />
            <Input type="number" min="0" max="100" label="10TH MARK PERCENTAGE *" name="tenthPercent" value={form.tenthPercent} onChange={onChange} required />
            <File label="10TH MARKSHEET *" name="tenthMarksheet" onChange={onFile} required />
            <Input label="12TH STREAM" name="twelfthStream" value={form.twelfthStream} onChange={onChange} />
            <Input type="number" min="0" max="100" label="12TH MARK PERCENTAGE *" name="twelfthPercent" value={form.twelfthPercent} onChange={onChange} required />
            <File label="12TH MARKSHEET *" name="twelfthMarksheet" onChange={onFile} required />
            <Input type="number" min="0" max="100" label="UG/PG/DIPLOMA MARK PERCENTAGE *" name="ugPercent" value={form.ugPercent} onChange={onChange} required />
            <File label="DEGREE CERTIFICATE *" name="degreeCertificate" onChange={onFile} required />
          </div>
        )}

        {step === 3 && (
          <div>
            {form.experiences.map((exp, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 border rounded-xl bg-gray-50">
                <Input label="Company Name" name="companyName" value={exp.companyName} onChange={(e) => onExperienceChange(i, e)} />
                <Input label="Position" name="position" value={exp.position} onChange={(e) => onExperienceChange(i, e)} />
                <Input type="date" label="From Date" name="fromDate" value={exp.fromDate} onChange={(e) => onExperienceChange(i, e)} />
                <Input type="date" label="To Date" name="toDate" value={exp.toDate} onChange={(e) => onExperienceChange(i, e)} />
                {form.experiences.length > 1 && (
                  <button type="button" onClick={() => removeExperience(i)} className="px-3 py-1 bg-red-500 text-white rounded-lg mt-2">
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addExperience} className="px-4 py-2 bg-blue-500 text-white rounded-xl">
              + Add Experience
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="IFSC Code *" name="ifscCode" value={form.ifscCode} onChange={onChange} required />
            <Input label="Account Number *" name="accountNumber" value={form.accountNumber} onChange={onChange} required />
          </div>
        )}

        {step === 5 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <File label="AADHAR CARD *" name="aadhar" onChange={onFile} required />
            <File label="PAN CARD *" name="pan" onChange={onFile} required />
            <File label="PASSPORT SIZE PHOTO *" name="photo" onChange={onFile} required />
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex justify-between gap-2">
          <div className="flex gap-2">
            <button onClick={back} type="button" disabled={step === 0} className={`px-4 py-2 rounded-xl ${step === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-800 text-white hover:opacity-90"}`}>
              Back
            </button>

            {/* Cancel button */}
            <button onClick={() => navigate("/")} type="button" className="px-4 py-2 rounded-xl bg-red-600 text-white hover:opacity-90">
              Cancel
            </button>
          </div>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              disabled={!isStepValid()}
              className={`px-5 py-2 rounded-xl ${isStepValid() ? "bg-blue-600 text-white hover:opacity-90" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              Next
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={!isStepValid()} className={`px-5 py-2 rounded-xl ${isStepValid() ? "bg-emerald-600 text-white hover:opacity-90" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* Reusable Input Components */
function Input({ label, name, value, onChange, type = "text", required, pattern, min, max }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        pattern={pattern}
        min={min}
        max={max}
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options, required }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <select
        className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

function File({ label, name, onChange, required }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="mt-1 w-full border rounded-xl px-3 py-2 bg-white"
        type="file"
        name={name}
        onChange={onChange}
        required={required}
      />
    </label>
  );
}
