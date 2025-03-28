import { User } from "@/db/entities";
import { DomainUserDto } from "./dto/user-domain.dto";

export const userMapper = {
  toDomain: (user: User): DomainUserDto => {
    const { password, salt, ...rest } = user;

    return rest;
  },
};
