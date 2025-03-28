import { DITOKEN } from "@/modules/auth/repos/user.repo";
import { userMapper } from "@/modules/auth/user.mapper";
import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { Logger } from "winston";

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
export const attachCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Logger: Logger = Container.get("logger");
  const UserRepositoryClass = Container.get(DITOKEN);
  const userRepository = new UserRepositoryClass();
  try {
    const userRecord = await userRepository.findUserById(
      (req as any).token!._id as number
    );

    if (!userRecord) {
      return res.sendStatus(401) as unknown as void;
    }

    const currentUser = userMapper.toDomain(userRecord);
    (req as any).currentUser = currentUser;

    return next();
  } catch (e) {
    Logger.error("🔥 Error attaching user to req: %o", e);
    return next(e);
  }
};
