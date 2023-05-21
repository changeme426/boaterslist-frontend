export default function hasRole(user: any, role: string): boolean {
  const roles = user ? user['https://boaterslist.com/roles'] : null
  if (!Array.isArray(roles)) {
    return false
  }
  return roles.includes(role)
}
