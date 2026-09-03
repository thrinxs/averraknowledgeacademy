export type UserRole =
  | 'student'
  | 'admin'
  | 'staff'
  | 'affiliate'
  | 'trainer'
  | 'principal'

export type AccountType = 'standard' | 'child' | 'trusted_person'

export function getDashboardRouteByRole(role?: string | null, accountType?: string | null) {
  if (accountType === 'child') return '/child/dashboard'
  switch (role) {
    case 'admin':      return '/admin/dashboard'
    case 'principal':  return '/principal/dashboard'
    case 'staff':      return '/staff/dashboard'
    case 'affiliate':  return '/affiliate/dashboard'
    case 'trainer':    return '/trainer/dashboard'
    case 'student':
    default:           return '/dashboard'
  }
}

// Determine age group from year group code
export function getAgeGroup(yearGroupCode: string): 'primary' | 'secondary' {
  const primaryYears = [
    'Year 1','Year 2','Year 3','Year 4','Year 5','Year 6',
    'Y1','Y2','Y3','Y4','Y5','Y6',
    'P1','P2','P3','P4','P5','P6',
  ]
  return primaryYears.includes(yearGroupCode) ? 'primary' : 'secondary'
}
