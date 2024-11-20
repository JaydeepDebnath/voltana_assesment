import { Router } from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getAllUsers,
    updateAccountDetails,
    deleteUser,
    inviteNewUser,
} from '../controllers/user.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/users").get(verifyJWT,getAllUsers)
router.route("/update").patch(verifyJWT,updateAccountDetails)
router.route('/delete-account').delete(verifyJWT,deleteUser)
router.route("/invite-user").post(inviteNewUser)

export default router;