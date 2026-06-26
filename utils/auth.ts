export type UserRole =
  | 'student'
  | 'admin'
  | 'staff'
  | 'affiliate'
  | 'trainer'

export function getDashboardRouteByRole(
  role?: string | null
) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'staff':
      return '/staff/dashboard'
    case 'affiliate':
      return '/affiliate/dashboard'
    case 'trainer':
      return '/trainer/dashboard'
    case 'student':
    default:
      return '/dashboard'
  }
}