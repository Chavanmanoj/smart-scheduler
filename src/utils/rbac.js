// ============================================
// RBAC - Role Based Access Control
// Subject: Information Cyber Security (ICS)
// Topic: Access Control
// ============================================

// STEP 1: Define all possible permissions in the system
export const PERMISSIONS = {
  // Schedule permissions
  VIEW_OWN_SCHEDULES:  'view_own_schedules',
  VIEW_ALL_SCHEDULES:  'view_all_schedules',
  CREATE_SCHEDULE:     'create_schedule',
  EDIT_OWN_SCHEDULE:   'edit_own_schedule',
  EDIT_ANY_SCHEDULE:   'edit_any_schedule',
  DELETE_OWN_SCHEDULE: 'delete_own_schedule',
  DELETE_ANY_SCHEDULE: 'delete_any_schedule',
  EXPORT_ICS:          'export_ics',

  // User permissions
  VIEW_USERS:          'view_users',
  MANAGE_USERS:        'manage_users',

  // System permissions
  VIEW_LOGS:           'view_logs',
  ACCESS_ADMIN:        'access_admin',
}

// STEP 2: Define roles
export const ROLES = {
  ADMIN:   'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
}

// STEP 3: Assign permissions to each role (the RBAC matrix)
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_OWN_SCHEDULES,
    PERMISSIONS.VIEW_ALL_SCHEDULES,
    PERMISSIONS.CREATE_SCHEDULE,
    PERMISSIONS.EDIT_OWN_SCHEDULE,
    PERMISSIONS.EDIT_ANY_SCHEDULE,
    PERMISSIONS.DELETE_OWN_SCHEDULE,
    PERMISSIONS.DELETE_ANY_SCHEDULE,
    PERMISSIONS.EXPORT_ICS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_LOGS,
    PERMISSIONS.ACCESS_ADMIN,
  ],
  [ROLES.TEACHER]: [
    PERMISSIONS.VIEW_OWN_SCHEDULES,
    PERMISSIONS.VIEW_ALL_SCHEDULES,
    PERMISSIONS.CREATE_SCHEDULE,
    PERMISSIONS.EDIT_OWN_SCHEDULE,
    PERMISSIONS.DELETE_OWN_SCHEDULE,
    PERMISSIONS.EXPORT_ICS,
    PERMISSIONS.VIEW_USERS,
  ],
  [ROLES.STUDENT]: [
    PERMISSIONS.VIEW_OWN_SCHEDULES,
    PERMISSIONS.CREATE_SCHEDULE,
    PERMISSIONS.EDIT_OWN_SCHEDULE,
    PERMISSIONS.DELETE_OWN_SCHEDULE,
    PERMISSIONS.EXPORT_ICS,
  ],
}

// STEP 4: The main permission checker function
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false
  const rolePerms = ROLE_PERMISSIONS[userRole] || []
  return rolePerms.includes(permission)
}

// STEP 5: Check multiple permissions at once
export const hasAnyPermission = (userRole, permissions = []) => {
  return permissions.some(p => hasPermission(userRole, p))
}

// STEP 6: Get all permissions for a role
export const getRolePermissions = (userRole) => {
  return ROLE_PERMISSIONS[userRole] || []
}

// STEP 7: Role display info
export const ROLE_INFO = {
  [ROLES.ADMIN]: {
    label:       'Admin',
    icon:        '👑',
    color:       '#f43f5e',
    bg:          '#2d1b1b',
    border:      '#f43f5e44',
    description: 'Full system access. Can manage all users, schedules and view logs.',
  },
  [ROLES.TEACHER]: {
    label:       'Teacher',
    icon:        '👨‍🏫',
    color:       '#f59e0b',
    bg:          '#2d2010',
    border:      '#f59e0b44',
    description: 'Can view all schedules, create and manage own schedules.',
  },
  [ROLES.STUDENT]: {
    label:       'Student',
    icon:        '👨‍🎓',
    color:       '#10b981',
    bg:          '#0d2d24',
    border:      '#10b98144',
    description: 'Can only view and manage own schedules.',
  },
}