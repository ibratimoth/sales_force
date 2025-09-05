export const can = (userPermissions, requiredPermission) => {
  if (!userPermissions || !requiredPermission) return false;
  return userPermissions.includes(requiredPermission);
};
