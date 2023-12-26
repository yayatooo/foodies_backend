import { Ability, AbilityBuilder } from "@casl/ability";

export default function getToken(req) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
    return null;
  }

  const token = authorizationHeader.split(" ")[1];
  return token || null;
}

const policies = {
  guest(user, { can }) {
    can("read", "product"); //guest user has read access to all data
  },
  user(user, { can }) {
    can("view", "Order");
    can("create", "Order");
    can("read", "Order", { user_id: user._id });
    can("update", "User", { _id: user._id });
    can("read", "Cart", { user_id: user._id });
    can("update", "Cart", { user_id: user._id });
    can("view", "Adress");
    can("create", "Adress", { user_id: user._id });
    can("update", "Adress", { user_id: user._id });
    can("delete", "Adress", { user_id: user._id });
    can("read", "Invoice", { user_id: user._id });
  },
  admin(admin, { can }) {
    can("manage", "all"); //admin manages everything
  },
};

export const policyFor = (user) => {
  let builder = new AbilityBuilder();
  if (user && typeof policies[user.role] === "function") {
    policies[user.role](user, builder);
  } else {
    policies["guest"](user, builder);
  }
  return new Ability(builder.rules);
};
