import User from "../models/User.js";
import { clerkClient } from "@clerk/express";

export const syncUser = async (req, res) => {

  try {

    /*
    |--------------------------------------------------------------------------
    | Clerk Auth
    |--------------------------------------------------------------------------
    */

    const auth = req.auth();


    const clerkId = auth.userId;

    /*
    |--------------------------------------------------------------------------
    | Existing User
    |--------------------------------------------------------------------------
    */

    const existingUser = await User.findOne({
      clerkId,
    });

    if (existingUser) {

      return res.status(200).json({
        success: true,
        user: existingUser,
      });

    }

    /*
    |--------------------------------------------------------------------------
    | Fetch Clerk User
    |--------------------------------------------------------------------------
    */

    const clerkUser = await clerkClient.users.getUser(
      clerkId
    );

    /*
    |--------------------------------------------------------------------------
    | Extract Data
    |--------------------------------------------------------------------------
    */

    const email =
      clerkUser.emailAddresses[0]?.emailAddress;

    const name =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

    /*
    |--------------------------------------------------------------------------
    | Create MongoDB User
    |--------------------------------------------------------------------------
    */

    const user = await User.create({
      clerkId,
      email,
      name,
    });

    return res.status(201).json({
      success: true,
      user,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};