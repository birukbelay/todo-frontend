import { useAuth, User } from "@/lib/state/context/jotai-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuthorization = (WrappedComponent: any, allowedRoles: string[]) => {
  return function AuthorizedPage(props: any) {
    const router = useRouter();
    const { user, loading, loggedIn } = useAuth();

    useEffect(() => {
      if (!loading && !IsAuthorized(user, allowedRoles)) {
        router.replace("/"); // or redirect("/") to force navigation
      }
    }, [loading, user, router]);

    // Ensure consistent output during SSR
    if (typeof window === "undefined" || loading === null) {
      return <div style={{ visibility: "hidden" }}></div>; // Prevent mismatch
    }
    if (loading || loggedIn === null) {
      return <div>Loading...</div>;
    }

    if (!IsAuthorized(user, allowedRoles)) {
      return null; // Render nothing during the redirect
    }
    return <WrappedComponent {...props} />;
  };
};

export default withAuthorization;

export function IsAuthorized(
  user: User | null,
  allowedRoles: string[]
): boolean {
  // console.log("Current User ====>>", user);

  if (user == null) return false;
  if (!allowedRoles) return true;
  if (user && allowedRoles.includes(user.role)) return true;
  return allowedRoles.length < 1;
}

// export function IsAuthor({children, roles }: {children: React.ReactNode, roles: ROLE[]}) {
//   const {user}=useUser()

//   return roles?.includes(user?.role as ROLE) ?<>{children}</>: null
// }
// export function IsAllowed({children, action }: {children: React.ReactNode, action: ModulePath,}) {
//   const {user}=useUser()
//   const roles= PathRoles[action]
//   return roles?.includes(user?.role as ROLE) ?<>{children}</>: null
// }
