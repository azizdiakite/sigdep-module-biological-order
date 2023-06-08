import { Privilege, Role } from '@spbogui-openmrs/shared/model';
import { notification } from '@spbogui-openmrs/shared/utils';
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface RedirectNoAuthorityProps {
  authorities: string[];
  linkToRedirect: string;
}

export function RedirectNoAuthority({
  authorities,
  linkToRedirect,
}: RedirectNoAuthorityProps) {
  const navigate = useNavigate();
  // const { user } = encryptStorage.getItem('session');
  const user: any = {};
  const [privilegesLoaded, setPrivilegesLoaded] = React.useState(false);
  const [hasAuthority, setHasAuthority] = React.useState(true);

  useEffect(() => {
    if (user && !privilegesLoaded) {
      setHasAuthority(
        authorities.every(
          (p: string) =>
            user.privileges.findIndex(
              (privilege: Privilege) => privilege.name === p
            ) !== -1
        ) ||
          user.roles.findIndex((r: Role) => r.name === 'System Developer') !==
            -1
      );
      setPrivilegesLoaded(true);
    }
  }, [authorities, privilegesLoaded, user, user.privileges, user.roles]);

  useEffect(() => {
    if (!hasAuthority) {
      notification(
        'redirect-no-access',
        'warning',
        'Vous n’êtes pas autorisé a acceder a cette page !',
        'Autorisation',
        10000
      );
      navigate(linkToRedirect);
    }
  }, [hasAuthority, linkToRedirect, navigate]);

  return <div />;
}

export default RedirectNoAuthority;
