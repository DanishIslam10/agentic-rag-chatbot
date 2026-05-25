import express from "express"
import {syncUser} from "../controllers/auth.controller.js"
import { clerkMiddleware,requireAuth } from "@clerk/express";

const router = express.Router()

router.use(clerkMiddleware());

router.post("/sync", requireAuth(), syncUser)

export default router;