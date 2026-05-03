import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
<<<<<<< HEAD
import myLogo from './images/MyWave.png'; 

// ── Config ──────────────────────────────────────────────────────────────────
const API_URL = 'http://localhost/PHP-EmpProfile/backend/api.php'; // PHP path
=======
import myLogo from './images/PeopleHub.png'; 

// ── Config ──────────────────────────────────────────────────────────────────
const API_URL = '/backend/api.php'; // PHP path
>>>>>>> 51d803cb83619b0a4b800878845be1c74107b601

const DEPARTMENTS = [
  'Engineering','Marketing','Sales','Human Resources',
  'Finance','Operations','Legal','Customer Support','Product','Design'
];

const NATIONALITIES = [
  'Malaysian','Singaporean','Indonesian','Thai','Filipino','Vietnamese',
  'American','British','Australian','Indian','Chinese','Japanese','Korean','Other'
];

const EMPTY_FORM = {
  employee_name:'', gender:'', marital_status:'', phone_no:'',
  email:'', address:'', date_of_birth:'', nationality:'',
  hire_date:'', department:'', position:'', employee_id_code:'',
  salary: '', profile_photo: '', emergency_name: '', emergency_phone: '', 
  emergency_relation: ''
};

const ImageModal = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-small"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>✕</button>

        <img 
          src={src} 
          alt="Zoomed Profile"
          className="modal-image"
        />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  TOAST & UTILS
// ════════════════════════════════════════════════════════════════════════════
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`toast ${type}`}>
      {type === 'success' ? '✅' : '❌'} {message}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════════════
//  EMPLOYEE CARD
// ════════════════════════════════════════════════════════════════════════════
function EmployeeCard({ emp, onView, onImageClick }) {
  const initials = (emp.employee_name || '??')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const fmtDate = d => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-MY', { day:'2-digit', month:'short', year:'numeric' });
  };

  const deptClass = 'dept-' + (emp.department || '').replace(/\s+/g, '-');

  return (
    <div className="emp-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="emp-card-top" />
        <div className="emp-card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div className="emp-card-header" >
            <div className="emp-avatar"
              onClick={() => emp.profile_photo && onImageClick(emp.profile_photo)}
              style={{ cursor: emp.profile_photo ? 'pointer' : 'default' }}
              >
              {emp.profile_photo ? (
                <img 
                  src={emp.profile_photo} 
                  alt={`${emp.employee_name}'s profile`} 
                  // Ensure the image fits within the avatar circle
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%', // Circular avatar
                    objectFit: 'cover',   // This prevents stretching
                  }}
                />
              ) : (
                // Otherwise, fallback to the text initials
                initials
              )}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
                <div className="emp-name">{emp.employee_name}</div>
                <div className="emp-position">{emp.position || 'No position assigned'}</div>
                {emp.employee_id_code && <div className="emp-id">{emp.employee_id_code}</div>}
            </div>
            <div className={`dept-badge ${deptClass}`}>{emp.department}</div>
            </div>

            <div style={{ flex: 1 }}>
                <div className="emp-info">
                <div className="emp-info-row"><span>📧</span><span title={emp.email}>{emp.email}</span></div>
                <div className="emp-info-row"><span>📱</span><span>{emp.phone_no}</span></div>
                <div className="emp-info-row"><span>🌍</span><span>{emp.nationality} · {emp.gender}</span></div>
                <div className="emp-info-row"><span>📅</span><span>Hired {fmtDate(emp.hire_date)}</span></div>
                </div>

                <div className="emp-tags" style={{ marginBottom: '10px' }}>
                <span className="tag">{emp.marital_status}</span>
                <span className="tag">DOB: {fmtDate(emp.date_of_birth)}</span>
                </div>
            </div>

            <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: 'auto' }}
            onClick={() => onView(emp)}
            >
            See Details
            </button>
        </div>
        </div>
  );
}


// ════════════════════════════════════════════════════════════════════════════
//  STATS CARDS
// ════════════════════════════════════════════════════════════════════════════
function StatsGrid({ employees }) {
  const now   = new Date();
  const depts = [...new Set(employees.map(e => e.department))].length;
  const month = employees.filter(e => {
    if (!e.hire_date) return false;
    const d = new Date(e.hire_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const nats = [...new Set(employees.map(e => e.nationality))].length;

  const stats = [
    { label: 'Total Employees',   value: employees.length, icon: '👥' },
    { label: 'Departments',        value: depts,            icon: '🏢' },
    { label: 'Hired This Month',   value: month,            icon: '📅' },
    { label: 'Nationalities',      value: nats,             icon: '🌍' },
  ];

  return (
    <div className="stats-grid">
      {stats.map(s => (
        <div className="stat-card" key={s.label}>
          <div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
          <div className="stat-icon">{s.icon}</div>
        </div>
      ))}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════════════
//  DASHBOARD PAGE
// ════════════════════════════════════════════════════════════════════════════
function Dashboard({ employees, loading, onNavigate, onView, onImageClick}) {
  const recent = employees.slice(0, 3);

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1>Employee Directory</h1>
          <p>Manage your team's profiles in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('add')}>
          ➕ Add Employee
        </button>
      </div>

      <StatsGrid employees={employees} />

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <h2 style={{ fontFamily:'var(--font-disp)', fontSize:'1.2rem', color:'var(--primary)' }}>
          Recent Additions
        </h2>
        <button className="btn btn-outline" style={{ fontSize:'.8rem', padding:'6px 14px' }}
          onClick={() => onNavigate('employees')}>
          View all →
        </button>
      </div>

      {loading && <div className="spinner" />}

      {!loading && recent.length > 0 && (
        <div className="employee-grid">
          {recent.map(emp =>
             <EmployeeCard key={emp.id} 
             emp={emp} 
             onView={onView} 
             onImageClick={onImageClick}
             />)}
        </div>
      )}

      {!loading && employees.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No employees yet</h3>
          <p>Get started by adding your first employee.</p>
          <button className="btn btn-primary" style={{ marginTop:20 }} onClick={() => onNavigate('add')}>
            ➕ Add First Employee
          </button>
        </div>
      )}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════════════
//  EMPLOYEES LIST PAGE
// ════════════════════════════════════════════════════════════════════════════
function EmployeeList({ employees, loading, onNavigate, onView, onImageClick }) {
  const [search, setSearch] = useState('');
  const [dept,   setDept]   = useState('');

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (e.employee_name    || '').toLowerCase().includes(q) ||
      (e.email            || '').toLowerCase().includes(q) ||
      (e.position         || '').toLowerCase().includes(q) ||
      (e.employee_id_code || '').toLowerCase().includes(q);
    const matchDept = !dept || e.department === dept;
    return matchSearch && matchDept;
  });

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1>All Employees</h1>
          <p>{employees.length} team member{employees.length !== 1 ? 's' : ''} in the directory</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('add')}>
          ➕ Add Employee
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, position, ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select value={dept} onChange={e => setDept(e.target.value)}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {loading && <div className="spinner" />}

      {!loading && filtered.length > 0 && (
        <div className="employee-grid">
          {filtered.map(emp => 
          <EmployeeCard 
            key={emp.id} 
            emp={emp} 
            onView={onView} 
            onImageClick={onImageClick}
          />)}
        </div>
      )}

      {!loading && filtered.length === 0 && employees.length > 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      )}

      {!loading && employees.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No employees yet</h3>
          <p>Start by adding your first employee.</p>
          <button className="btn btn-primary" style={{ marginTop:20 }} onClick={() => onNavigate('add')}>
            ➕ Add First Employee
          </button>
        </div>
      )}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════════════
//  FORM FIELD COMPONENTS
// ════════════════════════════════════════════════════════════════════════════
function Field({ label, required, error, children }) {
  return (
    <div className={`form-group ${required === 'full' ? 'full' : ''}`}>
      <label>
        {label}
        {required && required !== 'full' && <span className="req"> *</span>}
      </label>
      {children}
      <div className="error-msg">{error || ''}</div>
    </div>
  );
}

function TextInput({ id, value, onChange, placeholder, type = 'text', hasError }) {
  return (
    <input
      id={id} type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={hasError ? 'error' : ''}
    />
  );
}

function SelectInput({ id, value, onChange, options, placeholder, hasError }) {
  return (
    <select id={id} value={value} onChange={e => onChange(e.target.value)}
      className={hasError ? 'error' : ''}>
      <option value="">{placeholder}</option>
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );
}


// ════════════════════════════════════════════════════════════════════════════
//  VALIDATION
// ════════════════════════════════════════════════════════════════════════════
function validateForm(form) {
  const errors = {};
  const today = new Date().toISOString().split("T")[0];

  if (!form.employee_name.trim())         errors.employee_name = 'Name is required.';
  else if (form.employee_name.trim().length < 2) errors.employee_name = 'Minimum 2 characters.';

  if (!form.gender)         errors.gender         = 'Gender is required.';
  if (!form.marital_status) errors.marital_status = 'Marital status is required.';

  if (!form.phone_no.trim())                              errors.phone_no = 'Phone number is required.';
  else if (!/^[\d\s\-\+\(\)]{7,20}$/.test(form.phone_no)) errors.phone_no = 'Invalid phone number.';

  if (!form.email.trim())                                     errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))  errors.email = 'Invalid email address.';

  if (!form.date_of_birth) {
    errors.date_of_birth = 'Date of birth is required.';
  } else if (form.date_of_birth > today) {
    errors.date_of_birth = "Birth date cannot be in the future.";
  } else {
    const age = (new Date() - new Date(form.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000);
    if (age < 16)  errors.date_of_birth = 'Must be at least 16 years old.';
    if (age > 100) errors.date_of_birth = 'Invalid date of birth.';
  }

  if (!form.nationality) errors.nationality = 'Nationality is required.';
  if (!form.hire_date)   errors.hire_date   = 'Hire date is required.';
  if (!form.department)  errors.department  = 'Department is required.';
  if (!form.position.trim()) errors.position = "Position is required.";

  if (!form.address.trim()) errors.address = "Address is required.";
  if (form.address.length > 500) errors.address = 'Address must be under 500 characters.';

  if (!form.salary)              errors.salary = 'Salary is required.';
  else if (isNaN(form.salary))   errors.salary = 'Salary must be a number.';
  else if (Number(form.salary) <= 0) errors.salary = 'Salary must be greater than 0.';

  if (!form.profile_photo) {
    errors.profile_photo = 'A profile photo is required.';
  }

  if (!form.emergency_name.trim())     errors.emergency_name     = 'Emergency contact name is required.';
  if (!form.emergency_relation.trim()) errors.emergency_relation = 'Relationship is required.';

  if (!form.emergency_phone.trim())                                        errors.emergency_phone = 'Emergency phone is required.';
  else if (!/^[\d\s\-\+\(\)]{7,20}$/.test(form.emergency_phone))          errors.emergency_phone = 'Invalid emergency phone number.';

  return errors;
}


// ════════════════════════════════════════════════════════════════════════════
//  ADD EMPLOYEE PAGE
// ════════════════════════════════════════════════════════════════════════════
function AddEmployee({ onNavigate, onSuccess }) {
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [errors,      setErrors]      = useState({});
  const [submitting,  setSubmitting]  = useState(false);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const clientErrors = validateForm(form);
    if (Object.keys(clientErrors).length > 0) { setErrors(clientErrors); return; }

    setSubmitting(true);
    try {
      const res  = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form)
      });
      const json = await res.json();

      if (json.success) {
        onSuccess('Employee added successfully!');
        setForm(EMPTY_FORM);
        setErrors({});
        onNavigate('employees');
      } else {
        if (json.errors) setErrors(json.errors);
        onSuccess(json.message || 'Validation failed.', 'error');
      }
    } catch {
      onSuccess('Could not connect to server.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

const [photoUploading, setPhotoUploading] = useState(false);

const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setPhotoUploading(true);
  const formData = new FormData();
  formData.append('photo', file);

  try {
    const res  = await fetch(API_URL + '?action=upload', { method: 'POST', body: formData });
    const json = await res.json();
    if (json.success) {
      update('profile_photo', json.url);
    } else {
      alert('Photo upload failed: ' + json.message);
    }
  } catch {
    alert('Could not upload photo.');
  } finally {
    setPhotoUploading(false);
  }
};

  const e = errors;

  return (
    <div className="container">
      <button className="btn btn-outline" style={{ marginBottom:16 }} onClick={() => onNavigate('employees')}>
        ← Back to Employees
      </button>
      <div className="page-head" style={{ marginBottom:24 }}>
        <div>
          <h1>Add New Employee</h1>
          <p>Fill in the details to register a new team member.</p>
        </div>
      </div>

      <div className="form-wrapper">
        <form onSubmit={handleSubmit} noValidate>

          {/* ── Personal Information ─────────────────────────────────── */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon blue">👤</div>
              <div>
                <div className="section-title">Personal Information</div>
                <div className="section-desc">Basic details about the employee</div>
              </div>
            </div>
            <div className="section-body">
              <div className="form-grid">
                <div className="form-group full">
                  <Field label="Full Name" required error={e.employee_name}>
                    <TextInput id="employee_name" value={form.employee_name}
                      onChange={v => update('employee_name', v)}
                      placeholder="e.g. John Doe" hasError={!!e.employee_name} />
                  </Field>
                </div>

                <Field label="Gender" required error={e.gender}>
                  <SelectInput id="gender" value={form.gender}
                    onChange={v => update('gender', v)}
                    options={['Male','Female','Other']}
                    placeholder="Select gender" hasError={!!e.gender} />
                </Field>

                <Field label="Marital Status" required error={e.marital_status}>
                  <SelectInput id="marital_status" value={form.marital_status}
                    onChange={v => update('marital_status', v)}
                    options={['Single','Married','Divorced','Widowed']}
                    placeholder="Select status" hasError={!!e.marital_status} />
                </Field>

                <Field label="Date of Birth" required error={e.date_of_birth}>
                  <TextInput id="date_of_birth" type="date" 
                  max={new Date().toISOString().split("T")[0]} // Blocks future dates
                  value={form.date_of_birth}
                  onChange={v => update('date_of_birth', v)} hasError={!!e.date_of_birth} />
                </Field>

                <Field label="Nationality" required error={e.nationality}>
                  <SelectInput id="nationality" value={form.nationality}
                    onChange={v => update('nationality', v)}
                    options={NATIONALITIES}
                    placeholder="Select nationality" hasError={!!e.nationality} />
                </Field>
              </div>
            </div>
          </div>

          {/* ── Contact Information ──────────────────────────────────── */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon orange">📞</div>
              <div>
                <div className="section-title">Contact Information</div>
                <div className="section-desc">How to reach the employee</div>
              </div>
            </div>
            <div className="section-body">
              <div className="form-grid">
                <Field label="Phone Number" required error={e.phone_no}>
                  <TextInput id="phone_no" type="tel" value={form.phone_no}
                    onChange={v => update('phone_no', v)}
                    placeholder="e.g. +60123456789" hasError={!!e.phone_no} />
                </Field>

                <Field label="Email Address" required error={e.email}>
                  <TextInput id="email" type="email" value={form.email}
                    onChange={v => update('email', v)}
                    placeholder="e.g. john@company.com" hasError={!!e.email} />
                </Field>

                <div className="form-group full">
                  <Field label="Home Address" required error={e.address}>
                    <textarea 
                      id="address" 
                      value={form.address}
                      onChange={e => update('address', e.target.value)}
                      placeholder="Full residential address"
                      className={e.address ? 'error' : ''}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>

          {/* ── Employment Details ───────────────────────────────────── */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon green">💼</div>
              <div>
                <div className="section-title">Employment Details</div>
                <div className="section-desc">Role and department information</div>
              </div>
            </div>
            <div className="section-body">
              <div className="form-grid">
                <Field label="Department" required error={e.department}>
                  <SelectInput id="department" value={form.department}
                    onChange={v => update('department', v)}
                    options={DEPARTMENTS}
                    placeholder="Select department" hasError={!!e.department} />
                </Field>

                <Field label="Position / Job Title" required error={e.position}>
                  <TextInput id="position" value={form.position}
                    onChange={v => update('position', v)}
                    placeholder="e.g. Senior Developer" hasError={!!e.position} />
                </Field>

                <Field label="Hire Date" required error={e.hire_date}>
                  <TextInput id="hire_date" type="date" value={form.hire_date}
                    onChange={v => update('hire_date', v)} hasError={!!e.hire_date} />
                </Field>

                <Field label="Employee ID (auto if blank)" error={null}>
                  <TextInput id="employee_id_code" value={form.employee_id_code}
                    onChange={v => update('employee_id_code', v)}
                    placeholder="e.g. EMP-001" />
                </Field>
              </div>
            </div>
          </div>

          {/* ── Financial & Profile ─────────────────────────────────── */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon blue">💰</div>
              <div className="section-title">Financial & Profile</div>
            </div>
            <div className="section-body">
              <div className="form-grid">
                <Field label="Monthly Salary (MYR)" required error={e.salary}>
                  <TextInput id="salary" type="number" value={form.salary}
                    onChange={v => update('salary', v)} placeholder="e.g. 5000" hasError={!!e.salary} />
                </Field>
                <Field label="Profile Photo" required error={e.profile_photo}>
                  <input type="file" accept="image/*" onChange={handlePhotoChange}
                    className={e.profile_photo ? 'error' : ''} />
                </Field>
              </div>
            </div>
          </div>

          {/* ── Emergency Contact ──────────────────────────────────── */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon orange">🚨</div>
              <div className="section-title">Emergency Contact</div>
            </div>
            <div className="section-body">
              <div className="form-grid">
                <Field label="Contact Name" required error={e.emergency_name}>
                  <TextInput id="emergency_name" value={form.emergency_name}
                    onChange={v => update('emergency_name', v)} placeholder="Full Name" hasError={!!e.emergency_name} />
                </Field>
                <Field label="Relationship" required error={e.emergency_relation}>
                  <TextInput id="emergency_relation" value={form.emergency_relation}
                    onChange={v => update('emergency_relation', v)} placeholder="e.g. Spouse" hasError={!!e.emergency_relation} />
                </Field>
                <Field label="Emergency Phone" required error={e.emergency_phone}>
                  <TextInput id="emergency_phone" value={form.emergency_phone}
                    onChange={v => update('emergency_phone', v)} placeholder="e.g. +60123456789" hasError={!!e.emergency_phone} />
                </Field>
              </div>
            </div>
          </div>

          {/* ── Actions ─────────────────────────────────────────────── */}
          <div className="form-actions">
            <button type="button" className="btn btn-outline"
              onClick={() => { setForm(EMPTY_FORM); setErrors({}); }}>
              ↺ Reset
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '⏳ Saving...' : '💾 Save Employee'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  VIEW EMPLOYEE DETAILS
// ════════════════════════════════════════════════════════════════════════════

function EmployeeDetails({ emp, onBack, onImageClick }) {
  if (!emp) return null;

  const initials = (emp.employee_name || '??')
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
    
  const fmtDate = d => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-MY', { 
      day: '2-digit', month: 'long', year: 'numeric' 
    });
  };

return (
    <div className="container animate-fade-in">
      <button className="btn btn-outline" style={{ marginBottom: 24 }} onClick={onBack}>
        ← Back to Directory
      </button>

      <div className="details-card">
        {/* --- Header Section --- */}
        <div className="details-header">
          <div className="details-profile-wrap">
          <div 
            className="details-avatar"
            onClick={() => emp.profile_photo && onImageClick(emp.profile_photo)}
            style={{ cursor: emp.profile_photo ? 'pointer' : 'default' }}
          >
            {emp.profile_photo ? (
              <img src={emp.profile_photo} alt="profile" />
            ) : (
              initials
            )}
          </div>
            <div className="details-title-group">
              <h1>{emp.employee_name} <span className="details-id">#{emp.employee_id_code}</span></h1>
              <p className="details-subtitle">{emp.position} · {emp.department}</p>
            </div>
          </div>
          {emp.salary && (
            <div className="details-salary-box">
              <div className="stat-label">Monthly Salary</div>
              <div className="value">RM {Number(emp.salary).toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* --- Information Grid --- */}
        <div className="details-grid">
          <section className="details-section">
            <h3>👤 Personal Information</h3>
            <div className="info-item"><span>Gender</span> {emp.gender}</div>
            <div className="info-item"><span>Status</span> {emp.marital_status}</div>
            <div className="info-item"><span>Nationality</span> {emp.nationality}</div>
            <div className="info-item"><span>Birthday</span> {fmtDate(emp.date_of_birth)}</div>
          </section>

          <section className="details-section">
            <h3>📞 Contact Details</h3>
            <div className="info-item"><span>Email</span> {emp.email}</div>
            <div className="info-item"><span>Phone</span> {emp.phone_no}</div>
            <div className="info-item"><span>Address</span> {emp.address || 'Not provided'}</div>
          </section>

          <section className="details-section">
            <h3>💼 Employment</h3>
            <div className="info-item"><span>Hire Date</span> {fmtDate(emp.hire_date)}</div>
            <div className="info-item"><span>Department</span> {emp.department}</div>
          </section>

          <section className="details-section">
            <h3>🚨 Emergency Contact</h3>
            <div className="emergency-box">
              <div className="info-item"><span>Name</span> {emp.emergency_name}</div>
              <div className="info-item"><span>Relation</span> {emp.emergency_relation}</div>
              <div className="info-item"><span>Phone</span> {emp.emergency_phone}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  APP ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page,      setPage]      = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleView = (emp) => {
    setSelectedEmployee(emp);
    setPage('details');
  };

    const handleImageClick = (img) => {
    setSelectedImg(img);
  };

  // ── Fetch all employees ────────────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(API_URL);
      const json = await res.json();
      setEmployees(json.data || []);
    } catch {
      showToast('Could not connect to server.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  // Re-fetch when navigating to list pages
  const navigate = page => {
    setPage(page);
    if (page === 'dashboard' || page === 'employees') fetchEmployees();
  };

  // ── Toast ──────────────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSuccess = (message, type = 'success') => {
    showToast(message, type);
    fetchEmployees();
  };

  // ── Footer ──────────────────────────────────────────────────────────────
  const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="official-footer">
      <div className="footer-content">
        <div className="footer-section">
<<<<<<< HEAD
          <h4>MyWave Nexus</h4>
=======
          <h4>PeopleHub</h4>
>>>>>>> 51d803cb83619b0a4b800878845be1c74107b601
          <p>Advanced Human Resource Management System</p>
        </div>
        
        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Support</span>
        </div>
        
        <div className="footer-copyright">
<<<<<<< HEAD
          © {new Date().getFullYear()} MyWave Nexus | Enterprise Human Resources
=======
          © {new Date().getFullYear()} PeopleHub | Enterprise Human Resources
>>>>>>> 51d803cb83619b0a4b800878845be1c74107b601
          <span className="version-tag">v1.0.0-stable</span>
        </div>
      </div>
    </footer>
  );
};
  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => navigate('dashboard')}>
            <div className="logo-icon">
              <img 
                src={myLogo} 
<<<<<<< HEAD
                alt="MyWave Logo" 
=======
                alt="PeopleHub Logo" 
>>>>>>> 51d803cb83619b0a4b800878845be1c74107b601
                style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className="brand-group">
<<<<<<< HEAD
              <span className="brand-name">MyWave Nexus</span>
=======
              <span className="brand-name">PeopleHub</span>
>>>>>>> 51d803cb83619b0a4b800878845be1c74107b601
              <span className="system-status">
                <span className="status-dot"></span> System Online
              </span>
            </div>
          </div>
          <div className="nav-links">
            {[
              { key:'dashboard', label:'Dashboard', icon:'📊' },
              { key:'employees', label:'Employees', icon:'👤' },
              { key:'add',       label:'Add Employee', icon:'➕' },
            ].map(tab => (
              <button key={tab.key}
                className={`nav-btn ${page === tab.key ? 'active' : ''}`}
                onClick={() => navigate(tab.key)}>
                {tab.icon} <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Pages ──────────────────────────────────────────────────── */}
      {page === 'dashboard' && (
        <Dashboard employees={employees} loading={loading} onNavigate={navigate} onView={handleView} onImageClick={handleImageClick}/>
      )}
      {page === 'employees' && (
        <EmployeeList employees={employees} loading={loading} onNavigate={navigate} onView={handleView} onImageClick={handleImageClick}/>
      )}
      {page === 'add' && (
        <AddEmployee onNavigate={navigate} onSuccess={handleSuccess} />
      )}
      {page === 'details' && (
        <EmployeeDetails emp={selectedEmployee} onBack={() => navigate('employees')} onImageClick={handleImageClick} />
      )}

      {/* ── Toast ──────────────────────────────────────────────────── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}

      <ImageModal 
        src={selectedImg} 
        onClose={() => setSelectedImg(null)} 
      />

      <Footer />
      
    </>
  );
}