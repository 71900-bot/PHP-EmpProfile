<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . '/employees.json';

# ─── Load employees from JSON ──────────────────────────────────────
function loadEmployees($file) {
    if (!file_exists($file)) {
        file_put_contents($file, json_encode([]));
    }
    $content = file_get_contents($file);
    return json_decode($content, true) ?? [];
}

# ─── Save employees to JSON ────────────────────────────────────────
function saveEmployees($file, $employees) {
    file_put_contents($file, json_encode($employees, JSON_PRETTY_PRINT));
}

# ─── Send JSON response ────────────────────────────────────────────
function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

# ─── Validate employee data ────────────────────────────────────────
function validateEmployee($data) {
    $errors = [];
    $today = date('Y-m-d');

    # Required fields
    $required = [
        'employee_name', 
        'gender', 
        'marital_status',
        'phone_no', 
        'email', 
        'date_of_birth',
        'nationality', 
        'hire_date', 
        'department',
        'position', 
        'salary',
        'profile_photo',
        'emergency_name', 
        'emergency_relation', 
        'emergency_phone'
    ];

    foreach ($required as $field) {
        if (empty(trim($data[$field] ?? ''))) {
            $errors[$field] = ucwords(str_replace('_', ' ', $field)) . ' is required.';
        }
    }

    # Email format
    if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Invalid email address.';
    }

    # Phone number validation
    # 7–15 digits 
    # Spaces, dashes, brackets not allowed
    if (!empty($data['phone_no'])) {

        $phone = trim($data['phone_no']);

        // Must start with + and followed by 7–15 digits only
        if (!preg_match('/^\+[0-9]{7,15}$/', $phone)) {
            $errors['phone_no'] = 'Phone number must be in international format like +60123456789 (no spaces, dashes, or brackets).';
        }
    }

    # Emergency phone number validation
        if (!empty($data['emergency_phone'])) {
        $ep = trim($data['emergency_phone']);
        if (!preg_match('/^\+[0-9]{7,15}$/', $ep)) {
            $errors['emergency_phone'] = 'Emergency phone must be in international format like +60123456789.';
        }
    }

    # Salary number validation - must be positive number
    if (!empty($data['salary']) && (!is_numeric($data['salary']) || $data['salary'] <= 0)) {
        $errors['salary'] = 'Salary must be a positive number.';
    }

    # Profile photo validation 
    if (empty($data['profile_photo'])) {
        $errors['profile_photo'] = 'A profile photo is required.';
    }

    # Date of birth
    # Must be at least 16 years old
    # Cannot choose future date
    if (!empty($data['date_of_birth'])) {
        $dob = DateTime::createFromFormat('Y-m-d', $data['date_of_birth']);
        if (!$dob) {
            $errors['date_of_birth'] = 'Invalid date of birth format (YYYY-MM-DD).';
        } else if (!empty($data['date_of_birth'])) {
            if ($data['date_of_birth'] > $today) {
                $errors['date_of_birth'] = "Date of birth cannot be in the future.";
            }
        } else {
            $age = (new DateTime())->diff($dob)->y;
            if ($age < 16) {
                $errors['date_of_birth'] = 'Employee must be at least 16 years old.';
            }
            if ($age > 100) {
                $errors['date_of_birth'] = 'Invalid date of birth.';
            }
        }
    }

    # Hire date format
    if (!empty($data['hire_date'])) {
        $hd = DateTime::createFromFormat('Y-m-d', $data['hire_date']);
        if (!$hd) {
            $errors['hire_date'] = 'Invalid hire date format (YYYY-MM-DD).';
        }
    }

    # Enum validation
    $validGenders      = ['Male', 'Female', 'Other'];
    $validMarital      = ['Single', 'Married', 'Divorced', 'Widowed'];
    $validDepartments  = [
        'Engineering', 'Marketing', 'Sales', 'Human Resources',
        'Finance', 'Operations', 'Legal', 'Customer Support', 'Product', 'Design'
    ];

    if (!empty($data['gender']) && !in_array($data['gender'], $validGenders)) {
        $errors['gender'] = 'Invalid gender value.';
    }
    if (!empty($data['marital_status']) && !in_array($data['marital_status'], $validMarital)) {
        $errors['marital_status'] = 'Invalid marital status.';
    }
    if (!empty($data['department']) && !in_array($data['department'], $validDepartments)) {
        $errors['department'] = 'Invalid department.';
    }

    # Address length
    if (!empty($data['address']) && strlen($data['address']) > 500) {
        $errors['address'] = 'Address must be under 500 characters.';
    }

    # Name validation
    # Only allow letters, spaces, common symbols (- and ')
    # No numbers / weird symbols
    # Reasonable length (2–100)
    if (!empty($data['employee_name'])) {
        $name = trim($data['employee_name']);

        if (strlen($name) < 2) {
            $errors['employee_name'] = 'Name must be at least 2 characters.';
        } 
        elseif (strlen($name) > 100) {
            $errors['employee_name'] = 'Name is too long.';
        }
        elseif (!preg_match("/^[a-zA-Z\s'-]+$/", $name)) {
            $errors['employee_name'] = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
        }
    } else {
        $errors['employee_name'] = 'Employee Name is required.';
}

    return $errors;
}

# ─── Route: POST /api.php?action=upload ─────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'upload') {
    header('Content-Type: application/json'); // override for file upload
    if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        respond(['success' => false, 'message' => 'No file uploaded.'], 400);
    }

    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $mime    = mime_content_type($_FILES['photo']['tmp_name']);
    if (!in_array($mime, $allowed)) {
        respond(['success' => false, 'message' => 'Invalid file type.'], 400);
    }

    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $ext      = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
    $filename = uniqid('photo_') . '.' . $ext;
    move_uploaded_file($_FILES['photo']['tmp_name'], $uploadDir . $filename);

    respond(['success' => true, 'url' => '/backend/uploads/' . $filename]);
}

# ─── Route: GET /api.php to list all employees ──────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $employees = loadEmployees($dataFile);
    respond(['success' => true, 'data' => $employees]);
}

# ─── Route: POST /api.php to create new employee ────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        respond(['success' => false, 'message' => 'Invalid JSON body.'], 400);
    }

    # Sanitize inputs
    $sanitized = [];
    $textFields = [
        'employee_name', 
        'gender', 
        'marital_status', 
        'phone_no', 
        'email',
        'address', 
        'date_of_birth', 
        'nationality', 
        'hire_date',
        'department', 
        'position', 
        'employee_id_code',
        'salary', 
        'profile_photo',
        'emergency_name', 
        'emergency_phone', 
        'emergency_relation'
    ];
    foreach ($textFields as $field) {
        $sanitized[$field] = htmlspecialchars(trim($input[$field] ?? ''), ENT_QUOTES, 'UTF-8');
    }

    # Validate
    $errors = validateEmployee($sanitized);
    if (!empty($errors)) {
        respond(['success' => false, 'errors' => $errors], 422);
    }

    # Auto-generate employee ID if blank
    if (empty($sanitized['employee_id_code'])) {
        $sanitized['employee_id_code'] = 'EMP-' . strtoupper(substr(uniqid(), -6));
    }

    # Check duplicate email
    $employees = loadEmployees($dataFile);
    foreach ($employees as $emp) {
        if (strtolower($emp['email']) === strtolower($sanitized['email'])) {
            respond(['success' => false, 'errors' => ['email' => 'Email already exists.']], 422);
        }
    }

    # Check duplicate phone number
    foreach ($employees as $emp) {
        if ($emp['phone_no'] === $sanitized['phone_no']) {
            respond(['success'=>false,'errors'=>['phone_no'=>'Phone already exists']],422);
        }
    }

    # Add metadata
    $sanitized['id'] = uniqid('emp_', true);
    $sanitized['created_at'] = date('Y-m-d H:i:s');
    $sanitized['profile_photo'] = $input['profile_photo'] ?? ''; // URL from upload

    // Special handling for profile_photo (don't trim/htmlspecialchars it) 
    // It's a long Base64 string
    $sanitized['profile_photo'] = $input['profile_photo'] ?? '';

    $employees[] = $sanitized;
    saveEmployees($dataFile, $employees);

    respond(['success' => true, 'message' => 'Employee created successfully.', 'data' => $sanitized], 201);
}

# ─── Fallback ───────────────────────────────────────────────────────────────
respond(['success' => false, 'message' => 'Method not allowed.'], 405);