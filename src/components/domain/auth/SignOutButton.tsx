import { auth } from "~/lib/firebase";

type Props = {};

export const SignOutButton = (props: Props) => {
  const handleClick = () => {
    auth.signOut();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="btn normal-case"
    >
      Sign Out
    </button>
  );
};
