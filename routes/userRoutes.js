const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController')
const UserServices = new userController();
const AuthMiddleware = new authMiddleware();
const AuthController = new authController();

router.get('/user',  UserServices.getAllUsers.bind(UserServices));
router.post('/user', UserServices.createUser.bind(UserServices));
router.get('/user/:userId', UserServices.getUserById.bind(UserServices));
router.put('/user/:userId', UserServices.UpdateUser.bind(UserServices));
router.delete('/user/:userId', UserServices.deleteUser.bind(UserServices));
router.post('/login', UserServices.loginUser.bind(UserServices));
router.get('/role', AuthController.getAllRoles.bind(AuthController));
router.post('/role', AuthController.createRole.bind(AuthController));
router.post('/permission', AuthController.createPermission.bind(AuthController));
router.get('/permission', AuthController.getAllPermissions.bind(AuthController));
router.post('/role/:role_id/permission', AuthController.assignPermissions.bind(AuthController));
router.get('/role/:role_id', AuthController.getRoleById.bind(AuthController));
router.get('/permission/:role_id', AuthController.getPermissionByRole.bind(AuthController));
router.put('/role/:role_id', AuthController.UpdateRole.bind(AuthController));
router.delete('/role/:role_id', AuthController.deleteRole.bind(AuthController));

module.exports = router;